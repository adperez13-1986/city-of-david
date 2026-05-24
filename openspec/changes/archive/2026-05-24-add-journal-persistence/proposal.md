## Why

The inquiries are designed to resolve "across any number of runs." For that to mean anything, the journal has to survive a page refresh and remember which scrolls the scribe has ever drafted — not just which fragments have unlocked. Otherwise every reload throws away the player's accumulated knowledge.

## What Changes

- Introduce a new `journal-persistence` capability with three operations: `emptyJournal`, `loadJournal`, `saveJournal`.
- Use a versioned localStorage key (`cityOfDavid:journal:v1`) so future schema changes can ignore old payloads cleanly.
- Treat corrupt or unreadable data as "no journal" — return the empty default and overwrite on the next save.
- **MODIFIED**: Extend the `Journal` type to track `draftedScrollIds: ScrollId[]` — the union of every scroll the scribe has drafted across every run — so cross-run fragment unlocks (next change) have a stable source of truth.

## Capabilities

### New Capabilities
- `journal-persistence`: Read and write the player's `Journal` to localStorage with a versioned key and resilient parsing.

### Modified Capabilities
- `data-model`: `Journal` gains a `draftedScrollIds` field so cross-run unlocks can be computed.

## Impact

- Adds `src/storage/journal.ts`.
- Modifies `src/model/types.ts` to add `draftedScrollIds: ScrollId[]` to `Journal`.
- No UI yet — the mobile UI shell wires load on boot and save on day-end.
- Bundle impact: tens of bytes of JS.
