import { Command } from 'commander';
import { checkBrowser } from './renderer/browser.js';
import { renderMarkdownToImage } from './renderer/render.js';

const program = new Command();

program
  .name('iwannashare')
  .description('Turn Markdown and AI responses into beautiful shareable long images.')
  .version('0.1.0');

program
  .argument('[input]', 'Markdown file to render')
  .option('-o, --output <path>', 'PNG output path', 'share.png')
  .option('--browser <path>', 'Chrome-compatible browser executable path')
  .action(async (input: string | undefined, options: CliOptions) => {
    if (!input) {
      program.help();
      return;
    }

    const renderOptions = {
      input,
      output: options.output
    };
    const result = await renderMarkdownToImage(
      options.browser === undefined
        ? renderOptions
        : { ...renderOptions, browserPath: options.browser }
    );

    console.log(`Rendered ${result.outputPath}`);
    console.log(`HTML preview ${result.htmlPath}`);
    console.log(`Theme ${result.theme}`);
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
  output: string;
  browser?: string;
}

await program.parseAsync();
