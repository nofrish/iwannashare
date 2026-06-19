import type { LongThemeTokens } from '../types.js';

export function calloutColors(input: {
  bg: string;
  keyBg?: string;
  noteBg?: string;
  warningBg?: string;
  border: string;
  text: string;
}): Pick<
  LongThemeTokens['colors'],
  'calloutBg' | 'calloutKeyBg' | 'calloutNoteBg' | 'calloutWarningBg' | 'calloutBorder' | 'calloutText'
> {
  return {
    calloutBg: input.bg,
    calloutKeyBg: input.keyBg ?? input.bg,
    calloutNoteBg: input.noteBg ?? input.bg,
    calloutWarningBg: input.warningBg ?? input.bg,
    calloutBorder: input.border,
    calloutText: input.text
  };
}
