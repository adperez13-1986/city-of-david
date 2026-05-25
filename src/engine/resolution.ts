import type {
  Journal,
  Noticing,
  ScrollId,
  Theme,
  ThemeId,
} from '../model/index.ts';
import type { DayResult, ScrollIndex } from './drafting.ts';
import { getAdjacentPairs } from './desk.ts';

export type ThemeIndex = Readonly<Record<ThemeId, Theme>>;

export function detectNoticings(
  day: DayResult,
  scrolls: ScrollIndex,
  themes: ThemeIndex,
  dayNumber: number,
): Noticing[] {
  const pairs = getAdjacentPairs(day.finalDesk);
  const out: Noticing[] = [];
  for (const [aId, bId] of pairs) {
    const a = scrolls[aId];
    const b = scrolls[bId];
    if (!a || !b) continue;
    const sharedThemeIds = a.themeIds.filter((t) => b.themeIds.includes(t));
    for (const themeId of sharedThemeIds) {
      const theme = themes[themeId];
      if (!theme) continue;
      out.push({
        themeId,
        whisper: theme.whisper,
        scrollIds: [aId, bId],
        day: dayNumber,
        annotation: undefined,
      });
    }
  }
  return out;
}

export function recordDay(
  journal: Journal,
  day: DayResult,
  newNoticings: readonly Noticing[],
): Journal {
  const drafted = new Set<ScrollId>(journal.draftedScrollIds);
  for (const id of day.draftedScrollIds) drafted.add(id);
  return {
    draftedScrollIds: [...drafted],
    noticings: [...journal.noticings, ...newNoticings],
    daysPlayed: journal.daysPlayed + 1,
  };
}

export function noticingsByTheme(
  journal: Journal,
): ReadonlyMap<ThemeId, Noticing[]> {
  const grouped = new Map<ThemeId, Noticing[]>();
  for (const noticing of journal.noticings) {
    const bucket = grouped.get(noticing.themeId) ?? [];
    bucket.push(noticing);
    grouped.set(noticing.themeId, bucket);
  }
  return grouped;
}
