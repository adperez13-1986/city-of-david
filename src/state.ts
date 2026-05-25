import type {
  Day,
  Journal,
  Noticing,
  ScrollId,
} from './model/index.ts';
import {
  defaultRng,
  detectNoticings,
  endDay,
  isDayOver,
  playPlacement,
  recordDay,
  startDay,
} from './engine/index.ts';
import { loadJournal, saveJournal } from './storage/journal.ts';
import { scrollIndex, scrolls, themeIndex, themes } from './content/index.ts';

export type Screen = 'play' | 'end-of-day' | 'journal' | 'empty-archive';

export type LastDay = {
  draftedCount: number;
  newNoticings: Noticing[];
};

export type GameState = {
  journal: Journal;
  day: Day | null;
  selectedScrollId: ScrollId | null;
  screen: Screen;
  screenBeforeJournal: Screen | null;
  lastDay: LastDay | null;
};

export type Action =
  | { kind: 'select-scroll'; scrollId: ScrollId }
  | { kind: 'place-here'; slotIndex: number }
  | { kind: 'clear-selection' }
  | { kind: 'open-journal' }
  | { kind: 'close-journal' }
  | { kind: 'continue-day' };

let state: GameState = bootState();
let subscriber: (() => void) | null = null;

export function getState(): GameState {
  return state;
}

export function subscribe(fn: () => void): void {
  subscriber = fn;
}

export function dispatch(action: Action): void {
  state = reduce(state, action);
  subscriber?.();
}

function reduce(s: GameState, action: Action): GameState {
  switch (action.kind) {
    case 'select-scroll':
      if (s.selectedScrollId === action.scrollId) {
        return { ...s, selectedScrollId: null };
      }
      return { ...s, selectedScrollId: action.scrollId };
    case 'clear-selection':
      return { ...s, selectedScrollId: null };
    case 'place-here':
      return placeAt(s, action.slotIndex);
    case 'open-journal':
      return { ...s, screen: 'journal', screenBeforeJournal: s.screen };
    case 'close-journal':
      return {
        ...s,
        screen: s.screenBeforeJournal ?? 'play',
        screenBeforeJournal: null,
      };
    case 'continue-day':
      return continueAfterDay(s);
  }
}

function placeAt(s: GameState, slotIndex: number): GameState {
  if (!s.day || s.selectedScrollId === null) return s;
  if (s.day.desk[slotIndex] !== null) return s;
  if (!s.day.offered.includes(s.selectedScrollId)) return s;

  const nextDay = playPlacement(
    s.day,
    s.selectedScrollId,
    slotIndex,
    scrollIndex,
    defaultRng,
  );

  if (!isDayOver(nextDay, scrollIndex)) {
    return { ...s, day: nextDay, selectedScrollId: null };
  }

  const dayResult = endDay(nextDay);
  const dayNumber = s.journal.daysPlayed + 1;
  const newNoticings = detectNoticings(dayResult, scrollIndex, themeIndex, dayNumber);
  const updatedJournal = recordDay(s.journal, dayResult, newNoticings);
  saveJournal(updatedJournal);

  return {
    ...s,
    day: nextDay,
    journal: updatedJournal,
    selectedScrollId: null,
    screen: 'end-of-day',
    lastDay: {
      draftedCount: dayResult.draftedScrollIds.length,
      newNoticings,
    },
  };
}

function continueAfterDay(s: GameState): GameState {
  const nextDay = startDay(scrolls, defaultRng);
  return {
    ...s,
    day: nextDay,
    screen: 'play',
    lastDay: null,
    selectedScrollId: null,
  };
}

function bootState(): GameState {
  if (scrolls.length === 0 || themes.length === 0) {
    return {
      journal: loadJournal(),
      day: null,
      selectedScrollId: null,
      screen: 'empty-archive',
      screenBeforeJournal: null,
      lastDay: null,
    };
  }

  const journal = loadJournal();
  return {
    journal,
    day: startDay(scrolls, defaultRng),
    selectedScrollId: null,
    screen: 'play',
    screenBeforeJournal: null,
    lastDay: null,
  };
}
