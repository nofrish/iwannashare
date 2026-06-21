import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parseMarkdown } from '../parser/markdown.js';
import type { ShareDocument } from '../types.js';
import { prepareWebFontAssets } from './fonts.js';
import { renderDefaultWebPage } from './theme.js';

export interface ExportWebOptions {
  markdown: string;
  outputDir: string;
  assetsDir?: string;
  siteName?: string;
  canonicalUrl?: string;
}

export interface ExportWebResult {
  outputDir: string;
  htmlPath: string;
  sourcePath: string;
  document: ShareDocument;
}

export async function exportMarkdownToWeb(options: ExportWebOptions): Promise<ExportWebResult> {
  const outputDir = path.resolve(options.outputDir);
  const assetsDir = options.assetsDir ?? 'assets/iwannashare';
  const document = parseMarkdown(options.markdown);
  const fontAssets = await prepareWebFontAssets({
    outputRoot: outputDir,
    assetsDir,
    publicAssetsPath: assetsDir
  });

  const htmlPath = path.join(outputDir, 'index.html');
  const sourcePath = path.join(outputDir, 'source.md');
  const html = renderDefaultWebPage({
    document,
    fontCss: fontAssets.css,
    ...(options.siteName === undefined ? {} : { siteName: options.siteName }),
    ...(options.canonicalUrl === undefined ? {} : { canonicalUrl: options.canonicalUrl })
  });

  await mkdir(outputDir, { recursive: true });
  await writeFile(htmlPath, html, 'utf8');
  await writeFile(sourcePath, options.markdown, 'utf8');

  return {
    outputDir,
    htmlPath,
    sourcePath,
    document
  };
}
