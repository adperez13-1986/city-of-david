## Context

The data model defines what a `Day` looks like. This change defines how a day evolves: from the moment the scribe sits down to the moment the desk is cleared. Every function here is pure — given the same inputs, it returns the same output — so the day loop is trivial to test and the UI can hold the current `Day` in plain state.

## Goals / Non-Goals

**Goals:**
- A complete loop: start, place, place, …, end.
- Pure functions returning new `Day` values; no shared mutation.
- A single `Rng` seam so deterministic tests are possible later without rewriting the engine.
- A `DayResult` shape rich enough for the next two changes (journal-persistence, inquiry-resolution) to consume without re-deriving anything.

**Non-Goals:**
- Fragment unlocks. The drafting layer reports *what happened*; the inquiry-resolution layer interprets it.
- Persistence. The journal-persistence change owns localStorage.
- UI concerns: animation timing, slot highlighting, tap zones — none of those exist here.

## Decisions

**Random sampling without replacement.**
Alternative considered: shuffle once at day start and pop the top. Chosen approach (sample from a `Set` each time) is two lines longer but easier to reason about — there's no global "deck order" mental model to maintain. Performance is identical for ~20 scrolls.

**Two stop conditions: stamina or desk-full.**
Spec says "when stamina runs out, the day ends," but a 2x2 desk holds only 4 scrolls and stamina can support up to 6 placements. Without a desk-full stop, the player would face an unwinnable turn (3 offered scrolls, no empty slot). Making desk-full a stop is the natural way out and matches the implicit Blue Prince intuition that "the room is full, the day is done." A third stop — deck-exhausted — is added defensively for edge cases (e.g. testing with a tiny catalog).

**Throw on bad placement, don't return Result/Either.**
Bad placements (occupied slot, scroll not in offer) are caller bugs, not gameplay outcomes. Throwing keeps the success-path types clean. The UI guards against bad inputs before calling; tests assert by `expect(() => ...).toThrow`.

**`Rng = () => number` instead of an interface.**
A callable is the smallest possible seam. No `interface Rng { random(): number }` ceremony. Swapping in a seedable PRNG later is a one-line change.

**Drafted-scroll order is preserved.**
`DayResult.draftedScrollIds` keeps placement order, not slot order. The journal may eventually want to know which scroll was drafted first (e.g. for "first draft of the day" tracking); slot order can be recovered from the final desk if needed.

## Risks / Trade-offs

- **No replay log** → if a future feature wants to replay a day deterministically (for a "log of yesterday" feature), the `DayResult` only captures final state. Mitigation: extend `DayResult` with a `moves: Move[]` array when that feature lands. Not premature for the prototype.
- **Throw-on-bad-input means UI must guard** → if the UI forgets to disable a slot button when the slot is full, the user sees a console error. Mitigation: the UI shell change will wrap placements with a guard.
