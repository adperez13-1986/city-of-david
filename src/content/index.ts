import type { Scroll, ScrollId, Theme, ThemeId } from '../model/index.ts';
import { scrolls } from './scrolls.ts';
import { themes } from './themes.ts';

export { scrolls } from './scrolls.ts';
export { themes } from './themes.ts';

export const scrollIndex: Readonly<Record<ScrollId, Scroll>> = Object.freeze(
  Object.fromEntries(scrolls.map((s) => [s.id, s])),
);

export const themeIndex: Readonly<Record<ThemeId, Theme>> = Object.freeze(
  Object.fromEntries(themes.map((t) => [t.id, t])),
);

if (import.meta.env.DEV) {
  validateContent();
}

function validateContent(): void {
  const themeIds = new Set(themes.map((t) => t.id));
  for (const scroll of scrolls) {
    for (const themeId of scroll.themeIds) {
      if (!themeIds.has(themeId)) {
        console.warn(
          `[content] scroll "${scroll.id}" references missing theme: ${themeId}`,
        );
      }
    }
  }
  for (const theme of themes) {
    const carriers = scrolls.filter((s) => s.themeIds.includes(theme.id));
    if (carriers.length < 2) {
      console.warn(
        `[content] theme "${theme.id}" has ${carriers.length} carriers (need >=2 for any noticing)`,
      );
    }
  }
}
