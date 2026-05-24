## Why

The drafting engine reports facts (what landed where, what was drafted). The journal stores the cumulative record. Neither of them decides which fragments unlock — that's a separate concern with its own rules: some unlocks are "you have ever drafted these scrolls" (cross-run, journal-based) and some are "you placed these scrolls adjacent on the desk today" (single-run, desk-based). Putting the rule in one place keeps each layer focused.

## What Changes

- Introduce a new `inquiry-resolution` capability with two pure functions:
  - `resolveDay(journal, dayResult, inquiry)` returns a new `journal` plus the list of fragments newly unlocked this day.
  - `isInquiryResolvable(journal, inquiry)` returns `true` when every "core" fragment of the inquiry (one with no `requireAdjacency`) is in the journal's `unlockedFragments`.
- Define connectivity for adjacency unlocks: a set of required scrolls is "adjacent" when their occupied slots form a connected subgraph under `DESK_EDGES`. This handles the "all three are adjacent" case in the cave inquiry without forcing a special rule per fragment.
- Bump `daysPlayed` inside `resolveDay` so the journal's day count stays consistent with reality.

## Capabilities

### New Capabilities
- `inquiry-resolution`: The rule for turning a finished day into journal updates. Pure functions over journal, day result, and inquiry.

### Modified Capabilities
<!-- None -->

## Impact

- Adds `src/engine/resolution.ts` (re-exported via `src/engine/index.ts`).
- No persistence or UI changes here — the UI shell calls `resolveDay` then hands the new journal to `saveJournal`.
- Bundle impact: low single-digit KB.
