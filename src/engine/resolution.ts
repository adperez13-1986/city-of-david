import type {
  DeskSlot,
  Fragment,
  Inquiry,
  Journal,
  ScrollId,
} from '../model/index.ts';
import type { DayResult } from './drafting.ts';
import { DESK_EDGES } from './desk.ts';

export type ResolveDayResult = {
  journal: Journal;
  newlyUnlocked: Fragment[];
};

export function resolveDay(
  journal: Journal,
  day: DayResult,
  inquiry: Inquiry,
): ResolveDayResult {
  const drafted = new Set(journal.draftedScrollIds);
  for (const id of day.draftedScrollIds) drafted.add(id);

  const unlocked = new Set(journal.unlockedFragments);
  const newlyUnlocked: Fragment[] = [];

  for (const fragment of inquiry.fragments) {
    if (unlocked.has(fragment.id)) continue;
    const required = fragment.unlockedBy.scrollIds;
    const adj = fragment.unlockedBy.requireAdjacency === true;
    const matches = adj
      ? areScrollsConnected(required, day.finalDesk)
      : required.every((id) => drafted.has(id));
    if (!matches) continue;
    unlocked.add(fragment.id);
    newlyUnlocked.push(fragment);
  }

  return {
    journal: {
      ...journal,
      draftedScrollIds: [...drafted],
      unlockedFragments: [...unlocked],
      daysPlayed: journal.daysPlayed + 1,
    },
    newlyUnlocked,
  };
}

export function isInquiryResolvable(
  journal: Journal,
  inquiry: Inquiry,
): boolean {
  const unlocked = new Set(journal.unlockedFragments);
  return inquiry.fragments.every((f) =>
    f.unlockedBy.requireAdjacency ? true : unlocked.has(f.id),
  );
}

function areScrollsConnected(
  required: readonly ScrollId[],
  desk: readonly DeskSlot[],
): boolean {
  if (required.length === 0) return true;

  const positions: number[] = [];
  for (const id of required) {
    const idx = desk.findIndex((slot) => slot?.id === id);
    if (idx === -1) return false;
    positions.push(idx);
  }
  if (required.length === 1) return true;

  const positionSet = new Set(positions);
  const visited = new Set<number>([positions[0]]);
  const queue: number[] = [positions[0]];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const [a, b] of DESK_EDGES) {
      let neighbour: number;
      if (a === current) neighbour = b;
      else if (b === current) neighbour = a;
      else continue;
      if (!positionSet.has(neighbour) || visited.has(neighbour)) continue;
      visited.add(neighbour);
      queue.push(neighbour);
    }
  }

  return visited.size === positions.length;
}
