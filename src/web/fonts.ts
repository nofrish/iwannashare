import { mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { copyDirectory } from '../utils/fs.js';

const require = createRequire(import.meta.url);
const fontPackage = '@daihaus/lxgw-bright';
const fontCssFiles = ['400-normal.css', '500-normal.css'] as const;
const fontDirs = ['400-normal', '500-normal'] as const;

export interface WebFontAssets {
  css: string;
  assetDir: string;
}

export async function prepareWebFontAssets(options: {
  outputRoot: string;
  assetsDir: string;
  publicAssetsPath: string;
}): Promise<WebFontAssets> {
  const packageRoot = path.dirname(require.resolve(`${fontPackage}/package.json`));
  const assetRoot = path.join(options.outputRoot, options.assetsDir);
  const fontRoot = path.join(assetRoot, 'fonts', 'lxgw-bright');

  await mkdir(fontRoot, { recursive: true });

  const cssParts: string[] = [];
  for (const cssFile of fontCssFiles) {
    const css = await readFile(path.join(packageRoot, cssFile), 'utf8');
    cssParts.push(rewriteFontCssUrls(css, `${options.publicAssetsPath}/fonts/lxgw-bright`));
  }

  for (const directory of fontDirs) {
    await copyDirectory(path.join(packageRoot, directory), path.join(fontRoot, directory));
  }

  return {
    css: cssParts.join('\n'),
    assetDir: assetRoot
  };
}

function rewriteFontCssUrls(css: string, publicFontRoot: string): string {
  const root = publicFontRoot.replace(/\/+$/, '');
  return css.replace(/url\((['"]?)\.\/([^)'"]+)\1\)/g, (_match, quote: string, relativePath: string) => {
    return `url(${quote}${root}/${relativePath}${quote})`;
  });
}
