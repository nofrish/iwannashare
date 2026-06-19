import type { LongThemeTokens, ShareDocument, Theme } from '../../types.js';
import { escapeHtml } from '../../utils/html.js';
import { longBaseCss } from './base-css.js';
import { longThemeVars } from './css-vars.js';

export function createLongTheme(tokens: LongThemeTokens): Theme {
  return {
    id: tokens.id,
    name: tokens.name,
    mode: 'long',
    width: tokens.width,
    viewportHeight: tokens.viewportHeight,
    render(document) {
      const title = document.meta.title ?? inferTitle(document);
      const displayDate = document.meta.date ?? new Date().toISOString().slice(0, 10);

      return renderLongHtml({
        tokens,
        title,
        bodyHtml: document.html,
        displayDate,
        signature: 'iwannashare by nofrish'
      });
    }
  };
}

function inferTitle(document: ShareDocument): string {
  const firstLine = document.plainText.split(/[。！？\n]/)[0]?.trim();
  return firstLine || 'Untitled Share';
}

function renderLongHtml(input: {
  tokens: LongThemeTokens;
  title: string;
  bodyHtml: string;
  displayDate: string;
  signature: string;
}): string {
  const pageClasses = [
    'page',
    input.tokens.components.dropcap ? 'has-dropcap' : '',
    input.tokens.components.titleTransform === 'compact' ? 'title-compact' : '',
    input.tokens.components.titleTransform === 'newspaper' ? 'title-newspaper' : '',
    `callout-${input.tokens.components.calloutStyle}`
  ]
    .filter(Boolean)
    .join(' ');

  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(input.title)}</title>
  <style>${longThemeVars(input.tokens)}${longBaseCss}</style>
</head>
<body>
  <main class="${pageClasses}">
    <p class="kicker">${escapeHtml(input.displayDate)}</p>
    <header class="title-area">
      <h1>${escapeHtml(input.title)}</h1>
    </header>
    <article class="content">
      ${input.bodyHtml}
    </article>
    <footer class="footer">
      <span>${escapeHtml(input.signature)}</span>
    </footer>
  </main>
</body>
</html>`;
}
