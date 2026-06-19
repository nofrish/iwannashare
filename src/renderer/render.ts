import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseMarkdown } from '../parser/markdown.js';
import type { RenderOptions, ShareDocument, Theme } from '../types.js';
import { ensureParentDir } from '../utils/fs.js';
import { getTheme } from '../themes/index.js';
import { screenshotHtml } from './browser.js';

export interface RenderResult {
  inputPath: string;
  htmlPath: string;
  outputPath: string;
  theme: string;
}

export async function renderMarkdownToImage(options: RenderOptions): Promise<RenderResult> {
  const inputPath = path.resolve(options.input);
  const outputPath = path.resolve(options.output);
  const markdown = await readFile(inputPath, 'utf8');
  const document = parseMarkdown(markdown);
  const theme = getTheme('default');
  const renderInput = {
    document,
    theme,
    outputPath
  };
  const htmlPath = await renderThemeToFiles(
    options.browserPath === undefined ? renderInput : { ...renderInput, browserPath: options.browserPath }
  );

  return {
    inputPath,
    htmlPath,
    outputPath,
    theme: theme.id
  };
}

async function renderThemeToFiles(input: {
  document: ShareDocument;
  theme: Theme;
  outputPath: string;
  browserPath?: string;
}): Promise<string> {
  const outputPath = path.resolve(input.outputPath);
  const html = input.theme.render(input.document);
  const htmlPath = outputPath.replace(/\.png$/i, '.html');

  await ensureParentDir(outputPath);
  await writeFile(htmlPath, html, 'utf8');

  const screenshotOptions = {
    htmlPath,
    outputPath,
    theme: input.theme
  };

  await screenshotHtml(
    input.browserPath === undefined
      ? screenshotOptions
      : { ...screenshotOptions, browserPath: input.browserPath }
  );

  return htmlPath;
}
