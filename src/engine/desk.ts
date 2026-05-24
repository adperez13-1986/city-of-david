import type { DeskSlot, ScrollId } from '../model/index.ts';

export const DESK_EDGES: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
];

export function getAdjacentPairs(
  desk: readonly DeskSlot[],
): Array<[ScrollId, ScrollId]> {
  const pairs: Array<[ScrollId, ScrollId]> = [];
  for (const [a, b] of DESK_EDGES) {
    const sa = desk[a];
    const sb = desk[b];
    if (sa && sb) {
      pairs.push([sa.id, sb.id]);
    }
  }
  return pairs;
}
