import type { LongThemeTokens } from '../types.js';
import { calloutColors } from './color-utils.js';
import { loadPackageCss } from './font-css.js';

const pingfang = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
const lxgwBright = '"LXGW Bright", "Songti SC", "STSong", serif';
const mono = '"SFMono-Regular", Consolas, monospace';

function fontCss(...files: Array<[packageName: string, cssFile: string]>): string {
  return files.map(([packageName, cssFile]) => loadPackageCss(packageName, cssFile)).join('\n');
}

export const longThemePresets: LongThemeTokens[] = [
  {
    id: 'default',
    name: 'Default',
    width: 1080,
    viewportHeight: 900,
    label: 'default',
    fonts: {
      css: fontCss(
        ['@daihaus/lxgw-bright', '400-normal.css'],
        ['@daihaus/lxgw-bright', '500-normal.css']
      ),
      serif: lxgwBright,
      sans: pingfang,
      mono
    },
    colors: {
      bodyBg: '#efe9dd',
      pageBg: '#fbf7ee',
      pageBgEnd: '#f7f0e4',
      text: '#264653',
      muted: 'rgba(38, 70, 83, 0.66)',
      strong: '#19343f',
      title: '#19343f',
      accent: '#2a9d8f',
      accentSoft: 'rgba(42, 157, 143, 0.11)',
      accentLine: 'rgba(42, 157, 143, 0.26)',
      shadow: 'rgba(38, 70, 83, 0.26)',
      ...calloutColors({
        bg: 'rgba(42, 157, 143, 0.13)',
        keyBg: 'rgba(42, 157, 143, 0.16)',
        noteBg: 'rgba(244, 162, 97, 0.16)',
        warningBg: 'rgba(231, 111, 81, 0.15)',
        border: 'rgba(42, 157, 143, 0.32)',
        text: '#264653'
      }),
      codeBg: 'rgba(42, 157, 143, 0.12)',
      codeText: '#264653',
      preBg: '#f2eadc'
    },
    layout: {
      pagePadding: '78px 60px 64px',
      contentMaxWidth: '960px',
      titleMaxWidth: '960px',
      titleAreaMargin: '44px',
      footerMarginTop: '64px'
    },
    typography: {
      titleFont: 'serif',
      bodyFont: 'serif',
      headingFont: 'serif',
      titleSize: '64px',
      titleWeight: 500,
      titleLineHeight: 1.14,
      bodyWeight: 400,
      bodyTextStroke: '0.14px',
      bodySize: '43px',
      bodyLineHeight: 1.42,
      bodyParagraphMargin: '30px',
      headingSize: '52px',
      h3Size: '47px',
      calloutSize: '43px',
      listSize: '43px',
      listLineHeight: 1.32
    },
    components: {
      pageBackground:
        'radial-gradient(circle at 86% 6%, rgba(42, 157, 143, 0.08), transparent 30%), linear-gradient(180deg, var(--iws-page-bg) 0%, var(--iws-page-bg-end) 100%)',
      titleTransform: 'newspaper',
      calloutStyle: 'soft-card',
      dropcap: false
    }
  }
];
