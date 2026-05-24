## Context

This is the foundational change for the prototype. No code exists yet beyond the Vite scaffold. Every later change — drafting, desk, journal persistence, inquiry resolution, UI — references the types defined here, so getting the shapes right early avoids churn.

The prototype is vanilla TypeScript with no runtime framework. There is no class hierarchy, no ORM, no validation library. Types are purely compile-time contracts; runtime values are plain objects (POJOs) loaded from bundled data files.

## Goals / Non-Goals

**Goals:**
- One module (`src/model/`) that exports every type and constant the rest of the app needs.
- Authoring shapes that read like data, not configuration of behavior — a content author can add a `Scroll` or `Inquiry` as JSON-shaped TS without touching gameplay code.
- Zero runtime cost: types are erased at build; constants are inlined.

**Non-Goals:**
- Validation / parsing of authored content (Zod, runtime guards). Boundary checks come later if needed; this change trusts the TS compiler.
- Reducers, selectors, or stores. Those land with the gameplay changes.
- Persistence shapes. Journal persistence has its own change; this change defines only the in-memory `Journal` type, not its on-disk format.

## Decisions

**Single `src/model/` module instead of one file per type.**
The model surface is small (~6 types). Splitting one-per-file adds import noise without aiding navigation. Keep `src/model/types.ts` and `src/model/constants.ts` and re-export from `src/model/index.ts`. If the surface grows beyond ~15 types, revisit.

**`Fragment.unlockedBy` is a structural predicate, not a function.**
Alternative considered: storing unlock conditions as predicate functions. Rejected because that makes content non-serializable and harder to author. The structural form `{ scrollIds: string[]; requireAdjacency?: boolean }` covers every MVP inquiry pattern. If a future inquiry needs a richer predicate (e.g. "any two of these three"), we revisit then.

**Tags are free-form strings, not an enum.**
Tags are authored alongside scrolls; locking them to an enum would require editing the type each time we add content. The cost of a typo is low (a missed cross-reference; not a crash). If tag taxonomy becomes load-bearing, we promote to a union type.

**`Day` lives in the model, not in a separate "engine" module.**
The shape of run-scoped state is part of the contract every consumer reads. Putting it next to the persistent types makes the difference between "what survives" (`Journal`) and "what resets" (`Day`) visible at a glance.

## Risks / Trade-offs

- **No runtime validation** → if a content author writes a scroll referencing a non-existent fragment id, we'll only catch it when that scroll is drafted. Mitigation: a one-shot dev-only sanity check that runs at app bootstrap (added with the content change, not here) can verify referential integrity.
- **Constants in TS, not JSON** → balance tweaks require a rebuild. Acceptable for a prototype; revisit if we ever ship a live-tuning tool.
