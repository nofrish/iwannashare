import type { Theme, ThemeId } from '../types.js';
import { createLongTheme } from './long/template.js';
import { longThemePresets } from './presets.js';

const themes = Object.fromEntries(
  longThemePresets.map((preset) => [preset.id, createLongTheme(preset)])
) as Record<ThemeId, Theme>;

export function getTheme(id: string): Theme {
  const theme = themes[id as ThemeId];
  if (!theme) {
    const available = Object.keys(themes).join(', ');
    throw new Error(`Unknown theme "${id}". Available themes: ${available}`);
  }

  return theme;
}

export function listThemes(): Theme[] {
  return Object.values(themes);
}
