import { Command } from 'commander';
import os from 'node:os';
import path from 'node:path';
import { checkBrowser } from './renderer/browser.js';
import { renderMarkdownToImage } from './renderer/render.js';
import { copyPngToClipboard } from './utils/clipboard.js';
import { openFile } from './utils/open-file.js';

const program = new Command();

program
  .name('iwannashare')
  .description('Turn Markdown and AI responses into beautiful shareable long images.')
  .version('0.1.0');

program
  .argument('[input]', 'Markdown file to render. Use "-" or omit input to read Markdown from stdin.')
  .option('-o, --output <path>', 'PNG output path. Defaults to share.png for file input and a temp file for stdin.')
  .option('--browser <path>', 'Chrome-compatible browser executable path')
  .option('--copy', 'Copy the rendered PNG image to the macOS clipboard')
  .option('--open', 'Open the rendered PNG image on macOS')
  .action(async (input: string | undefined, options: CliOptions) => {
    if (!input && process.stdin.isTTY) {
      program.help();
      return;
    }

    const output = options.output ?? defaultOutputPath(input);
    const markdown = input === undefined || input === '-' ? await readStdin() : undefined;
    const renderOptions =
      markdown === undefined
        ? { input: input as string, output }
        : {
            markdown,
            inputLabel: '<stdin>',
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
      await openFile(result.outputPath);
      console.log('Opened PNG');
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

function defaultOutputPath(input: string | undefined): string {
  if (input === undefined || input === '-') {
    return path.join(os.tmpdir(), `iwannashare-${Date.now()}.png`);
  }

  return 'share.png';
}

async function readStdin(): Promise<string> {
  process.stdin.setEncoding('utf8');

  let content = '';
  for await (const chunk of process.stdin) {
    content += chunk;
  }

  if (!content.trim()) {
    throw new Error('No Markdown input received from stdin.');
  }

  return content;
}

await program.parseAsync();
