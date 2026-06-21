import { Command } from 'commander';
import os from 'node:os';
import path from 'node:path';
import { configPath, loadConfig, loadPublishConfig, writePublishConfig } from './config.js';
import { readMarkdownInput } from './input.js';
import { checkBrowser } from './renderer/browser.js';
import { renderMarkdownToImage } from './renderer/render.js';
import { copyPngToClipboard, copyTextToClipboard } from './utils/clipboard.js';
import { openTarget } from './utils/open-file.js';
import { exportMarkdownToWeb } from './web/export.js';
import { publishMarkdownToWeb } from './web/publish.js';

const program = new Command();

program
  .name('iwannashare')
  .description('Turn Markdown and AI responses into beautiful shareable long images.')
  .version('0.1.0')
  .action(() => {
    program.help();
  });

program
  .command('render')
  .argument('[input]', 'Markdown file to render. Use "-" or omit input to read Markdown from stdin.')
  .option('-o, --output <path>', 'PNG output path. Defaults to share.png for file input and a temp file for stdin.')
  .option('--browser <path>', 'Chrome-compatible browser executable path')
  .option('--copy', 'Copy the rendered PNG image to the macOS clipboard')
  .option('--open', 'Open the rendered PNG image on macOS')
  .description('Render Markdown to a shareable long PNG image.')
  .action(async (input: string | undefined, options: CliOptions) => {
    if (!input && process.stdin.isTTY) {
      program.commands.find((command) => command.name() === 'render')?.help();
      return;
    }

    const output = options.output ?? defaultOutputPath(input);
    const markdownInput = await readMarkdownInput(input);
    const renderOptions =
      markdownInput.sourcePath === undefined
        ? {
            markdown: markdownInput.markdown,
            inputLabel: markdownInput.label,
            output
          }
        : {
            input: markdownInput.sourcePath,
            output
          };

    const result = await renderMarkdownToImage(
      options.browser === undefined
        ? renderOptions
        : { ...renderOptions, browserPath: options.browser }
    );

    console.log(`Rendered ${result.outputPath}`);
    console.log(`HTML preview ${result.htmlPath}`);
    console.log(`Theme ${result.theme}`);

    if (options.copy) {
      await copyPngToClipboard(result.outputPath);
      console.log('Copied PNG to clipboard');
    }

    if (options.open) {
      await openTarget(result.outputPath);
      console.log('Opened PNG');
    }
  });

program
  .command('export-web')
  .description('Export Markdown to a static web share directory.')
  .argument('[input]', 'Markdown file to export. Use "-" or omit input to read Markdown from stdin.')
  .option('-o, --output <dir>', 'Output directory. Defaults to web-share for file input and a temp directory for stdin.')
  .option('--open', 'Open the generated index.html on macOS')
  .action(async (input: string | undefined, options: ExportWebCliOptions) => {
    if (!input && process.stdin.isTTY) {
      program.commands.find((command) => command.name() === 'export-web')?.help();
      return;
    }

    const markdownInput = await readMarkdownInput(input);
    const outputDir = options.output ?? defaultWebOutputPath(input);
    const result = await exportMarkdownToWeb({
      markdown: markdownInput.markdown,
      outputDir
    });

    console.log(`Exported ${result.htmlPath}`);
    console.log(`Markdown source ${result.sourcePath}`);

    if (options.open) {
      await openTarget(result.htmlPath);
      console.log('Opened web share');
    }
  });

const configCommand = program.command('config').description('Manage IWannaShare local config.');

configCommand
  .command('init')
  .description('Write publish config to the user config directory.')
  .requiredOption('--repo-path <path>', 'Local GitHub Pages repository path')
  .requiredOption('--base-url <url>', 'Public base URL, for example https://share.example.com')
  .option('--branch <branch>', 'Publish branch', 'main')
  .option('--content-dir <dir>', 'Directory for share pages inside the repo', 'share')
  .option('--assets-dir <dir>', 'Directory for shared IWannaShare assets inside the repo', 'assets/iwannashare')
  .option('--site-name <name>', 'Site name used in metadata')
  .action(async (options: ConfigInitCliOptions) => {
    const writtenPath = await writePublishConfig(options);
    console.log(`Wrote ${writtenPath}`);
  });

configCommand
  .command('show')
  .description('Print current IWannaShare config.')
  .action(async () => {
    console.log(`Config path ${configPath()}`);
    console.log(JSON.stringify(await loadConfig(), null, 2));
  });

program
  .command('publish')
  .description('Publish Markdown as a static web page through the configured GitHub Pages repo.')
  .argument('[input]', 'Markdown file to publish. Use "-" or omit input to read Markdown from stdin.')
  .option('--slug <slug>', 'URL slug. Defaults to frontmatter slug, ASCII title, or a timestamp.')
  .option('--no-push', 'Commit locally but do not push to origin')
  .option('--copy-url', 'Copy the published URL to the macOS clipboard')
  .option('--open', 'Open the published URL on macOS after publishing')
  .option('--allow-dirty', 'Allow publishing when the target repo has uncommitted changes')
  .action(async (input: string | undefined, options: PublishCliOptions) => {
    if (!input && process.stdin.isTTY) {
      program.commands.find((command) => command.name() === 'publish')?.help();
      return;
    }

    const markdownInput = await readMarkdownInput(input);
    const loaded = await loadPublishConfig();
    const result = await publishMarkdownToWeb({
      markdown: markdownInput.markdown,
      config: loaded.config,
      ...(options.slug === undefined ? {} : { slug: options.slug }),
      push: options.push,
      allowDirty: options.allowDirty ?? false
    });

    console.log(`Published ${result.url}`);
    console.log(`Wrote ${result.htmlPath}`);
    console.log(`Markdown source ${result.sourcePath}`);
    console.log(result.committed ? 'Committed changes' : 'No publish changes to commit');
    console.log(options.push ? 'Pushed to origin' : 'Skipped push');

    if (options.copyUrl) {
      await copyTextToClipboard(result.url);
      console.log('Copied URL to clipboard');
    }

    if (options.open) {
      await openTarget(result.url);
      console.log('Opened published URL');
    }
  });

program
  .command('doctor')
  .description('Check local rendering dependencies.')
  .option('--browser <path>', 'Chrome-compatible browser executable path')
  .action(async (options: Pick<CliOptions, 'browser'>) => {
    const browser = await checkBrowser(options.browser);
    console.log(browser.ok ? `OK ${browser.message}` : `ERROR ${browser.message}`);
    process.exitCode = browser.ok ? 0 : 1;
  });

interface CliOptions {
  output?: string;
  browser?: string;
  copy?: boolean;
  open?: boolean;
}

interface ExportWebCliOptions {
  output?: string;
  open?: boolean;
}

interface ConfigInitCliOptions {
  repoPath: string;
  baseUrl: string;
  branch?: string;
  contentDir?: string;
  assetsDir?: string;
  siteName?: string;
}

interface PublishCliOptions {
  slug?: string;
  push: boolean;
  copyUrl?: boolean;
  open?: boolean;
  allowDirty?: boolean;
}

function defaultOutputPath(input: string | undefined): string {
  if (input === undefined || input === '-') {
    return path.join(os.tmpdir(), `iwannashare-${Date.now()}.png`);
  }

  return 'share.png';
}

function defaultWebOutputPath(input: string | undefined): string {
  if (input === undefined || input === '-') {
    return path.join(os.tmpdir(), `iwannashare-web-${Date.now()}`);
  }

  return 'web-share';
}

await program.parseAsync(normalizeArgv(process.argv)).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

function normalizeArgv(argv: string[]): string[] {
  const firstArg = argv[2];
  const rootOptions = new Set(['-h', '--help', '-V', '--version']);
  const renderOptions = new Set(['-o', '--output', '--browser', '--copy', '--open']);
  const renderOptionPrefixes = ['--output=', '--browser='];
  const commands = new Set(['render', 'export-web', 'config', 'publish', 'doctor', 'help']);

  if (firstArg === undefined) {
    return process.stdin.isTTY ? argv : [argv[0] ?? 'node', argv[1] ?? 'iwannashare', 'render'];
  }

  if (rootOptions.has(firstArg) || commands.has(firstArg)) {
    return argv;
  }

  const isRenderOption =
    renderOptions.has(firstArg) || renderOptionPrefixes.some((prefix) => firstArg.startsWith(prefix));

  if (firstArg !== '-' && firstArg.startsWith('-') && !isRenderOption) {
    return argv;
  }

  return [argv[0] ?? 'node', argv[1] ?? 'iwannashare', 'render', ...argv.slice(2)];
}
