## Context

We have a working engine and persistence layer. We need to make it visible and touchable. The user wants to test on a phone, so the design must be portrait-first, thumb-reachable, and fast (no framework, no animations beyond fades). The shell must also work with zero content, since the Scripture content review happens after this change ships.

## Goals / Non-Goals

**Goals:**
- One module that takes engine state and returns DOM, plus a small event-delegation handler that mutates state and re-renders.
- Render the four screens: `play`, `end-of-day`, `journal`, `completed`, `empty-archive`.
- Touch-first: hit targets ≥ 44pt; bottom-anchored desk; no hover-only affordances.
- A complete loop testable on the live URL: open, place, end, resolve, repeat.

**Non-Goals:**
- Drag-and-drop, gestures, animations beyond opacity fades.
- Reorderable desk slots — tap-tap is enough.
- Multiple saves, settings, audio.
- Server sync. Everything is local.

## Decisions

**No framework, no virtual DOM.**
The shell is small enough that `element.innerHTML = template` plus delegated click handlers is faster to write and read than introducing Preact or lit-html. We'll re-render the whole `#app` on each state change. Performance is fine — the DOM is tiny (≤ 50 nodes).

**State store as a module-scope mutable + a setState that triggers render.**
Alternative considered: an observer pattern, signals, an event emitter. Rejected as overkill. One render path, one mutation function, easy to trace.

**Selection lives in state, not in the DOM.**
Putting `selectedScrollId: ScrollId | null` in the state means the next re-render reflects the selection. We don't have to query the DOM to know what's selected, and the selection survives a re-render triggered by any other action.

**Click delegation on `#app`, not per-element handlers.**
With `innerHTML` re-rendering, per-element handlers would constantly need re-binding. A single delegated click listener that reads `data-action` attributes is simpler and avoids leaks.

**Day starts on boot; no "start day" button.**
The user opens the app to play. A start button is a tap with no choice — cut it.

**End-of-day → "Continue" → either new day or commit answer.**
We deliberately *don't* auto-start the next day. The end-of-day panel is the player's pause: see what unlocked, decide whether to commit an answer or push for more. This is also the heart of the "you showed up, that was enough" sensibility — a beat, not a churn.

**Render uses `data-action` and `data-arg` attributes.**
Example: `<button data-action="select-scroll" data-arg="scroll-david-cave">…</button>`. The delegate function looks up the action and runs it. No string parsing, no IDs to manage.

## Risks / Trade-offs

- **Full re-render on every action** → for 50-node DOM this is invisible, but if the journal ever grows to hundreds of fragments, we'd start to feel it. Mitigation: scope re-render to a sub-section if measured.
- **No virtual DOM means no input focus preservation** → not a concern; we have no text inputs.
- **innerHTML XSS surface** → all content fields (titles, references, excerpts, fragment text) need to be HTML-escaped before interpolation. Use an `escape` helper and pass every dynamic string through it. There is no rich-text content in the data shapes; everything is plain text.
- **State and content are tied by id** → if content ids drift between releases, the journal could reference a fragment id that no longer exists. Mitigation: render unknown fragments as "[entry from an older chronicle]" instead of crashing.

## Migration Plan

This is greenfield — no migration. The user keeps their existing `localStorage.cityOfDavid:journal:v1`.
