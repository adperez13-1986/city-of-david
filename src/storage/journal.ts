import type { Journal, Noticing } from '../model/index.ts';

export const STORAGE_KEY = 'cityOfDavid:journal:v2';

export function emptyJournal(): Journal {
  return {
    draftedScrollIds: [],
    noticings: [],
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
    Array.isArray(j.draftedScrollIds) &&
    j.draftedScrollIds.every((v) => typeof v === 'string') &&
    Array.isArray(j.noticings) &&
    j.noticings.every(isNoticing) &&
    typeof j.daysPlayed === 'number' &&
    Number.isFinite(j.daysPlayed)
  );
}

function isNoticing(value: unknown): value is Noticing {
  if (value === null || typeof value !== 'object') return false;
  const n = value as Partial<Noticing>;
  return (
    typeof n.themeId === 'string' &&
    typeof n.whisper === 'string' &&
    Array.isArray(n.scrollIds) &&
    n.scrollIds.length === 2 &&
    n.scrollIds.every((id) => typeof id === 'string') &&
    typeof n.day === 'number' &&
    (n.annotation === undefined || typeof n.annotation === 'string')
  );
}
