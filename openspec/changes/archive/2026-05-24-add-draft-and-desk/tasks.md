## 1. Engine module

- [x] 1.1 Create `src/engine/rng.ts` exporting `Rng` type and `defaultRng`
- [x] 1.2 Create `src/engine/desk.ts` exporting `DESK_EDGES`, `getAdjacentPairs(desk)`
- [x] 1.3 Create `src/engine/drafting.ts` exporting `startDay`, `playPlacement`, `isDayOver`, `endDay`, and `DayResult`
- [x] 1.4 Create `src/engine/index.ts` re-exporting everything

## 2. Sample without replacement helper

- [x] 2.1 Implement a small `sample(items, k, rng)` helper inside `drafting.ts` (no separate module — single private function)
- [x] 2.2 The helper SHALL handle `k > items.length` by returning every item

## 3. Compile-time sanity

- [x] 3.1 Confirm `tsc` accepts the new engine module against the strict tsconfig (`verbatimModuleSyntax`, `erasableSyntaxOnly`, `noUnusedLocals`)
- [x] 3.2 Confirm `npm run build` succeeds. Runtime exercise of the engine deferred to the UI shell change, which is the first real caller

## 4. Cleanup

- [x] 4.1 No leftover smoke-test code in `main.ts` (deferred to UI shell change per task 3.2)
