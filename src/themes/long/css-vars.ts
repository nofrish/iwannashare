import type { LongThemeTokens } from '../../types.js';

export function longThemeVars(tokens: LongThemeTokens): string {
  const titleFont = tokens.typography.titleFont === 'serif' ? 'var(--iws-serif)' : 'var(--iws-sans)';
  const bodyFont = tokens.typography.bodyFont === 'serif' ? 'var(--iws-serif)' : 'var(--iws-sans)';
  const headingFont = tokens.typography.headingFont === 'serif' ? 'var(--iws-serif)' : 'var(--iws-sans)';

  return String.raw`
${tokens.fonts.css ?? ''}
:root {
  --iws-width: ${tokens.width}px;
  --iws-body-bg: ${tokens.colors.bodyBg};
  --iws-page-bg: ${tokens.colors.pageBg};
  --iws-page-bg-end: ${tokens.colors.pageBgEnd};
  --iws-text: ${tokens.colors.text};
  --iws-muted: ${tokens.colors.muted};
  --iws-strong: ${tokens.colors.strong};
  --iws-title: ${tokens.colors.title};
  --iws-accent: ${tokens.colors.accent};
  --iws-accent-soft: ${tokens.colors.accentSoft};
  --iws-accent-line: ${tokens.colors.accentLine};
  --iws-shadow: ${tokens.colors.shadow};
  --iws-callout-bg: ${tokens.colors.calloutBg};
  --iws-callout-key-bg: ${tokens.colors.calloutKeyBg};
  --iws-callout-note-bg: ${tokens.colors.calloutNoteBg};
  --iws-callout-warning-bg: ${tokens.colors.calloutWarningBg};
  --iws-callout-border: ${tokens.colors.calloutBorder};
  --iws-callout-text: ${tokens.colors.calloutText};
  --iws-code-bg: ${tokens.colors.codeBg};
  --iws-code-text: ${tokens.colors.codeText};
  --iws-pre-bg: ${tokens.colors.preBg};
  --iws-serif: ${tokens.fonts.serif};
  --iws-sans: ${tokens.fonts.sans};
  --iws-mono: ${tokens.fonts.mono};
  --iws-title-font: ${titleFont};
  --iws-body-font: ${bodyFont};
  --iws-heading-font: ${headingFont};
  --iws-page-padding: ${tokens.layout.pagePadding};
  --iws-content-max-width: ${tokens.layout.contentMaxWidth};
  --iws-title-max-width: ${tokens.layout.titleMaxWidth};
  --iws-title-area-margin: ${tokens.layout.titleAreaMargin};
  --iws-footer-margin-top: ${tokens.layout.footerMarginTop};
  --iws-title-size: ${tokens.typography.titleSize};
  --iws-title-weight: ${tokens.typography.titleWeight};
  --iws-title-line-height: ${tokens.typography.titleLineHeight};
  --iws-body-weight: ${tokens.typography.bodyWeight};
  --iws-body-text-stroke: ${tokens.typography.bodyTextStroke};
  --iws-body-size: ${tokens.typography.bodySize};
  --iws-body-line-height: ${tokens.typography.bodyLineHeight};
  --iws-body-paragraph-margin: ${tokens.typography.bodyParagraphMargin};
  --iws-heading-size: ${tokens.typography.headingSize};
  --iws-h3-size: ${tokens.typography.h3Size};
  --iws-callout-size: ${tokens.typography.calloutSize};
  --iws-list-size: ${tokens.typography.listSize};
  --iws-list-line-height: ${tokens.typography.listLineHeight};
  --iws-page-background: ${tokens.components.pageBackground};
}
`;
}
