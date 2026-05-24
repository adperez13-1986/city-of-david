import type {
  Day,
  Fragment,
  Inquiry,
  Journal,
  ScrollId,
} from './model/index.ts';
import {
  defaultRng,
  endDay,
  isDayOver,
  playPlacement,
  resolveDay,
  startDay,
} from './engine/index.ts';
import { loadJournal, saveJournal } from './storage/journal.ts';
import { inquiries, scrollIndex, scrolls } from './content/index.ts';

export type Screen =
  | 'play'
  | 'end-of-day'
  | 'journal'
  | 'completed'
  | 'empty-archive';

export type LastDay = {
  draftedCount: number;
  newlyUnlocked: Fragment[];
};

export type GameState = {
  journal: Journal;
  day: Day | null;
  selectedScrollId: ScrollId | null;
  screen: Screen;
  screenBeforeJournal: Screen | null;
  currentInquiry: Inquiry | null;
  lastDay: LastDay | null;
};

export type Action =
  | { kind: 'select-scroll'; scrollId: ScrollId }
  | { kind: 'place-here'; slotIndex: number }
  | { kind: 'clear-selection' }
  | { kind: 'open-journal' }
  | { kind: 'close-journal' }
  | { kind: 'continue-day' }
  | { kind: 'commit-answer' };

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
    case 'commit-answer':
      return commitAnswer(s);
  }
}

function placeAt(s: GameState, slotIndex: number): GameState {
  if (!s.day || !s.currentInquiry || s.selectedScrollId === null) return s;
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
  const resolved = resolveDay(s.journal, dayResult, s.currentInquiry);
  saveJournal(resolved.journal);

  return {
    ...s,
    day: nextDay,
    journal: resolved.journal,
    selectedScrollId: null,
    screen: 'end-of-day',
    lastDay: {
      draftedCount: dayResult.draftedScrollIds.length,
      newlyUnlocked: resolved.newlyUnlocked,
    },
  };
}

function continueAfterDay(s: GameState): GameState {
  if (!s.currentInquiry) return s;
  const nextDay = startDay(s.currentInquiry, scrolls, s.journal, defaultRng);
  return {
    ...s,
    day: nextDay,
    screen: 'play',
    lastDay: null,
    selectedScrollId: null,
  };
}

function commitAnswer(s: GameState): GameState {
  if (!s.currentInquiry) return s;
  const resolvedInquiries = [
    ...s.journal.resolvedInquiries,
    s.currentInquiry.id,
  ];
  const journal: Journal = { ...s.journal, resolvedInquiries };
  saveJournal(journal);

  const nextInquiry = pickNextInquiry(journal);
  if (!nextInquiry) {
    return {
      ...s,
      journal,
      currentInquiry: null,
      day: null,
      lastDay: null,
      screen: 'completed',
    };
  }

  return {
    ...s,
    journal,
    currentInquiry: nextInquiry,
    day: startDay(nextInquiry, scrolls, journal, defaultRng),
    lastDay: null,
    screen: 'play',
  };
}

function pickNextInquiry(journal: Journal): Inquiry | null {
  const resolved = new Set(journal.resolvedInquiries);
  return inquiries.find((i) => !resolved.has(i.id)) ?? null;
}

function bootState(): GameState {
  if (scrolls.length === 0 || inquiries.length === 0) {
    return {
      journal: loadJournal(),
      day: null,
      selectedScrollId: null,
      screen: 'empty-archive',
      screenBeforeJournal: null,
      currentInquiry: null,
      lastDay: null,
    };
  }

  const journal = loadJournal();
  const inquiry = pickNextInquiry(journal);
  if (!inquiry) {
    return {
      journal,
      day: null,
      selectedScrollId: null,
      screen: 'completed',
      screenBeforeJournal: null,
      currentInquiry: null,
      lastDay: null,
    };
  }
  return {
    journal,
    day: startDay(inquiry, scrolls, journal, defaultRng),
    selectedScrollId: null,
    screen: 'play',
    screenBeforeJournal: null,
    currentInquiry: inquiry,
    lastDay: null,
  };
}
