## Why

The engine works in isolation but the player still sees a placeholder. The shell wires everything together: load the journal on boot, pick an inquiry, render the topbar/offer/desk, accept taps, run the engine, save the journal, show the end-of-day result. It also has to render gracefully when there's no content authored yet — so this change can ship before the Scripture review without showing a broken screen.

## What Changes

- Introduce a new `mobile-ui` capability covering the in-game screens, interactions, and rendering pipeline.
- Add a plain-DOM render layer in `src/ui/`: one render function per screen, dispatched by a small `setState`/`render` loop. No framework.
- Add `src/state.ts` holding the runtime store: `{ journal, day, selectedScrollId, screen, currentInquiryId, lastResult }`.
- Add `src/content/index.ts` with empty `scrolls`/`inquiries` exports — populated by the next change.
- Add interaction rules: tap-scroll-then-tap-slot to place; tap-selected-scroll to deselect; journal button opens overlay; end-of-day overlay summarises drafted scrolls and newly unlocked fragments.
- Add an empty-archive screen: when there are no scrolls or inquiries, show a calm placeholder instead of crashing.
- Add end-of-content screen: when every inquiry is resolved, show a "the chronicle is whole" state.

## Capabilities

### New Capabilities
- `mobile-ui`: The screens, interactions, and render loop. Owns the visual contract between engine state and what the player sees and touches.

### Modified Capabilities
<!-- None -->

## Impact

- Adds `src/state.ts`, `src/ui/`, and `src/content/index.ts`.
- `src/main.ts` becomes a thin bootstrap that initialises the store and calls `render`.
- Bundle target: total JS under 15KB gzipped after this change (well below the 200KB ceiling).
- No new dependencies. Plain DOM, plain CSS.
