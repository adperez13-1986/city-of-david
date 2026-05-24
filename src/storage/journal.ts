import type { Journal } from '../model/index.ts';

export const STORAGE_KEY = 'cityOfDavid:journal:v1';

export function emptyJournal(): Journal {
  return {
    unlockedFragments: [],
    resolvedInquiries: [],
    draftedScrollIds: [],
    daysPlayed: 0,
  };
}

export function loadJournal(): Journal {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return emptyJournal();
    const parsed = JSON.parse(raw) as unknown;
    if (!isJournal(parsed)) return emptyJournal();
    return parsed;
  } catch {
    return emptyJournal();
  }
}

export function saveJournal(journal: Journal): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(journal));
}

function isJournal(value: unknown): value is Journal {
  if (value === null || typeof value !== 'object') return false;
  const j = value as Partial<Journal>;
  return (
    Array.isArray(j.unlockedFragments) &&
    j.unlockedFragments.every((v) => typeof v === 'string') &&
    Array.isArray(j.resolvedInquiries) &&
    j.resolvedInquiries.every((v) => typeof v === 'string') &&
    Array.isArray(j.draftedScrollIds) &&
    j.draftedScrollIds.every((v) => typeof v === 'string') &&
    typeof j.daysPlayed === 'number' &&
    Number.isFinite(j.daysPlayed)
  );
}
