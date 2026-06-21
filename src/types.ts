export type RenderMode = 'long';

export type ThemeId = 'default';

export interface ShareDocumentMeta {
  title?: string;
  author?: string;
  source?: string;
  date?: string;
  slug?: string;
}

export interface ShareDocument {
  meta: ShareDocumentMeta;
  html: string;
  plainText: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  mode: RenderMode;
  width: number;
  viewportHeight: number;
  render(document: ShareDocument): string;
}

export interface LongThemeTokens {
  id: ThemeId;
  name: string;
  width: number;
  viewportHeight: number;
  label: string;
  fonts: {
    serif: string;
    sans: string;
    mono: string;
    css?: string;
  };
  colors: {
    bodyBg: string;
    pageBg: string;
    pageBgEnd: string;
    text: string;
    muted: string;
    strong: string;
    title: string;
    accent: string;
    accentSoft: string;
    accentLine: string;
    shadow: string;
    calloutBg: string;
    calloutKeyBg: string;
    calloutNoteBg: string;
    calloutWarningBg: string;
    calloutBorder: string;
    calloutText: string;
    codeBg: string;
    codeText: string;
    preBg: string;
  };
  layout: {
    pagePadding: string;
    contentMaxWidth: string;
    titleMaxWidth: string;
    titleAreaMargin: string;
    footerMarginTop: string;
  };
  typography: {
    titleFont: 'serif' | 'sans';
    bodyFont: 'serif' | 'sans';
    headingFont: 'serif' | 'sans';
    titleSize: string;
    titleWeight: number;
    titleLineHeight: number;
    bodyWeight: number;
    bodyTextStroke: string;
    bodySize: string;
    bodyLineHeight: number;
    bodyParagraphMargin: string;
    headingSize: string;
    h3Size: string;
    calloutSize: string;
    listSize: string;
    listLineHeight: number;
  };
  components: {
    pageBackground: string;
    titleTransform: 'none' | 'compact' | 'newspaper';
    calloutStyle: 'left-bar' | 'soft-card' | 'quote-card' | 'plain-rule';
    dropcap: boolean;
  };
}

export type RenderOptions =
  | {
      input: string;
      output: string;
      browserPath?: string;
    }
  | {
      markdown: string;
      inputLabel: string;
      output: string;
      browserPath?: string;
    };

export interface BrowserCheck {
  ok: boolean;
  executablePath?: string;
  message: string;
}
