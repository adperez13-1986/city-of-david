## Why

The data model is in place but nothing actually plays a day. We need pure functions that turn a chosen inquiry into a sequence of decisions and an ending: shuffle the deck, offer three scrolls, place one on the desk, deduct stamina, repeat until the day ends. Without this loop, the UI has nothing to render and the journal has nothing to receive.

## What Changes

- Introduce a new `drafting` capability covering the per-run game loop.
- Provide pure-function primitives in `src/engine/`: `startDay`, `playPlacement`, `isDayOver`, `getAdjacentPairs`, `endDay`.
- Define the adjacency relation for the 2x2 desk (edge-adjacent only; diagonals are not adjacent).
- Define a `DayResult` shape that the journal capability will consume — the final desk, scrolls drafted this day, and the reason the day ended. Resolution of *what fragments unlock* is the next change's responsibility; this change only reports facts.
- Use `Math.random` for the prototype; isolate it behind a `Rng` callable so a seedable PRNG can replace it later without touching call sites.

## Capabilities

### New Capabilities
- `drafting`: The per-run engine — shuffling, offering, placing, stamina deduction, day-end detection, and desk adjacency. Pure functions returning new `Day` values; no mutation; no IO.

### Modified Capabilities
<!-- None -->

## Impact

- Adds `src/engine/` (drafting functions) and `src/engine/rng.ts` (Rng abstraction).
- No persistence yet. The journal capability (next change) owns saving the `DayResult`.
- No UI yet. The mobile UI shell consumes these engine functions later.
- Bundle impact: small, single-digit KB at most. Pure TS.
