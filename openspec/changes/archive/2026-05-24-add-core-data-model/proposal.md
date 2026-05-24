## Why

Every subsequent feature — drafting, the desk, the journal, inquiry resolution, UI — depends on a shared type vocabulary. Settling the data shapes first gives every later change a contract to write against and prevents shape drift between modules.

## What Changes

- Introduce a new `data-model` capability that defines the core type vocabulary for the prototype: `Scroll`, `Fragment`, `Inquiry`, `Journal`, `Day` (run-scoped state), and the small set of supporting enums/aliases needed to describe them.
- Establish constants for the prototype's tunable numbers (stamina per day, desk slot count, scrolls offered per turn) co-located with the types.
- Provide an authoring shape for `Scroll` content (text excerpt, reference, tags, stamina cost) and an authoring shape for `Inquiry` content (question, required scrolls, fragments, adjacency bonus) so future content can be added as plain data without code changes.
- Keep all types in a single typed module with zero runtime cost; no classes, no factories, no validation runtime — boundary checks happen when scenes load content.

## Capabilities

### New Capabilities
- `data-model`: The shared TypeScript vocabulary for the game — scroll, fragment, inquiry, journal entry, and day-scope types, plus tunable constants. Has no behavior; it is the contract every other capability references.

### Modified Capabilities
<!-- None — this is the foundational change. -->

## Impact

- Adds `src/model/` module (types and constants).
- No effect on UI, persistence, or game loop yet — those land in later changes.
- Bundle impact: zero runtime code. Types are erased at build time.
