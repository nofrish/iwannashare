import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);

export function loadPackageCss(packageName: string, cssFile: string): string {
  const packageJson = require.resolve(`${packageName}/package.json`);
  const packageRoot = path.dirname(packageJson);
  const cssPath = path.join(packageRoot, cssFile);
  const raw = readFileSync(cssPath, 'utf8');
  return absolutizeCssUrls(raw, path.dirname(cssPath));
}

function absolutizeCssUrls(css: string, baseDir: string): string {
  return css.replace(
    /url\((['"]?)(\.\/[^)'"]+)\1\)/g,
    (_match, quote: string, relativePath: string) =>
      `url(${quote}${pathToFileURL(path.join(baseDir, relativePath)).href}${quote})`
  );
}
