import {
  DAY_STAMINA,
  DESK_SLOT_COUNT,
  SCROLLS_OFFERED_PER_TURN,
} from '../model/index.ts';
import type {
  Day,
  DeskSlot,
  Inquiry,
  InquiryId,
  Journal,
  Scroll,
  ScrollId,
} from '../model/index.ts';
import type { Rng } from './rng.ts';

export type ScrollIndex = Readonly<Record<ScrollId, Scroll>>;

export type DayEndReason = 'desk-full' | 'stamina-depleted' | 'deck-exhausted';

export type DayResult = {
  inquiryId: InquiryId;
  finalDesk: Day['desk'];
  draftedScrollIds: ScrollId[];
  endReason: DayEndReason;
};

const PREFERRED_WEIGHT = 3;
const FILLER_WEIGHT = 1;

type InternalDay = Day & { _placementOrder: ScrollId[] };

function sample<T>(items: readonly T[], k: number, rng: Rng): T[] {
  const pool = items.slice();
  const out: T[] = [];
  const count = Math.min(k, pool.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(rng() * (pool.length - i));
    const picked = pool[j];
    pool[j] = pool[i];
    out.push(picked);
  }
  return out;
}

function weightedSample<T>(
  items: readonly T[],
  k: number,
  weight: (item: T) => number,
  rng: Rng,
): T[] {
  if (items.length <= k) return items.slice();
  const keyed = items.map((item) => {
    const w = Math.max(weight(item), 0.0001);
    return { item, key: -Math.log(Math.max(rng(), 1e-12)) / w };
  });
  keyed.sort((a, b) => a.key - b.key);
  return keyed.slice(0, k).map((e) => e.item);
}

function emptyDesk(): Day['desk'] {
  return [null, null, null, null];
}

function asInternal(day: Day): InternalDay {
  const placement = (day as InternalDay)._placementOrder;
  if (placement) return day as InternalDay;
  return { ...day, _placementOrder: collectPlaced(day.desk) };
}

function collectPlaced(desk: readonly DeskSlot[]): ScrollId[] {
  const out: ScrollId[] = [];
  for (const slot of desk) {
    if (slot) out.push(slot.id);
  }
  return out;
}

function offerWith(
  deck: ScrollId[],
  preferredScrollIds: readonly ScrollId[],
  rng: Rng,
): ScrollId[] {
  if (preferredScrollIds.length === 0) {
    return sample(deck, SCROLLS_OFFERED_PER_TURN, rng);
  }
  const preferredSet = new Set(preferredScrollIds);
  return weightedSample(
    deck,
    SCROLLS_OFFERED_PER_TURN,
    (id) => (preferredSet.has(id) ? PREFERRED_WEIGHT : FILLER_WEIGHT),
    rng,
  );
}

export function startDay(
  inquiry: Inquiry,
  catalog: readonly Scroll[],
  journal: Journal,
  rng: Rng,
): Day {
  const deck = catalog.map((s) => s.id);
  const required = inquiry.requiredScrollIds;
  const bonus = inquiry.adjacencyBonus ?? [];
  const preferredScrollIds = Array.from(new Set([...required, ...bonus]));

  const drafted = new Set(journal.draftedScrollIds);
  const isFirstDayOfInquiry = !required.some((id) => drafted.has(id));

  let offered: ScrollId[];
  if (isFirstDayOfInquiry) {
    const guaranteed = required
      .filter((id) => deck.includes(id))
      .slice(0, SCROLLS_OFFERED_PER_TURN);
    if (guaranteed.length >= SCROLLS_OFFERED_PER_TURN) {
      offered = guaranteed;
    } else {
      const filler = sample(
        deck.filter((id) => !guaranteed.includes(id)),
        SCROLLS_OFFERED_PER_TURN - guaranteed.length,
        rng,
      );
      offered = [...guaranteed, ...filler];
    }
  } else {
    offered = offerWith(deck, preferredScrollIds, rng);
  }

  const day: InternalDay = {
    inquiryId: inquiry.id,
    stamina: DAY_STAMINA,
    deck,
    offered,
    desk: emptyDesk(),
    preferredScrollIds,
    _placementOrder: [],
  };
  return day;
}

export function playPlacement(
  day: Day,
  scrollId: ScrollId,
  slotIndex: number,
  scrolls: ScrollIndex,
  rng: Rng,
): Day {
  if (slotIndex < 0 || slotIndex >= DESK_SLOT_COUNT) {
    throw new Error(`Slot index out of range: ${slotIndex}`);
  }
  if (day.desk[slotIndex] !== null) {
    throw new Error(`Slot ${slotIndex} is already occupied`);
  }
  if (!day.offered.includes(scrollId)) {
    throw new Error(`Scroll not in offer: ${scrollId}`);
  }
  const scroll = scrolls[scrollId];
  if (!scroll) {
    throw new Error(`Scroll not found in catalog: ${scrollId}`);
  }

  const internal = asInternal(day);
  const nextDesk = internal.desk.slice() as Day['desk'];
  nextDesk[slotIndex] = scroll;

  const nextDeck = internal.deck.filter((id) => id !== scrollId);
  const nextOffered = offerWith(nextDeck, internal.preferredScrollIds, rng);

  return {
    ...internal,
    stamina: internal.stamina - scroll.staminaCost,
    deck: nextDeck,
    offered: nextOffered,
    desk: nextDesk,
    _placementOrder: [...internal._placementOrder, scrollId],
  } as InternalDay;
}

export function isDayOver(day: Day, scrolls: ScrollIndex): boolean {
  if (day.desk.every((slot) => slot !== null)) return true;
  if (day.offered.length === 0) return true;
  const cheapest = Math.min(
    ...day.offered.map((id) => scrolls[id]?.staminaCost ?? Infinity),
  );
  return day.stamina < cheapest;
}

export function endDay(day: Day): DayResult {
  const internal = asInternal(day);
  return {
    inquiryId: internal.inquiryId,
    finalDesk: internal.desk,
    draftedScrollIds: internal._placementOrder.slice(),
    endReason: reasonFor(internal),
  };
}

function reasonFor(day: Day): DayEndReason {
  if (day.desk.every((slot) => slot !== null)) return 'desk-full';
  if (day.offered.length === 0 && day.deck.length === 0) return 'deck-exhausted';
  return 'stamina-depleted';
}
