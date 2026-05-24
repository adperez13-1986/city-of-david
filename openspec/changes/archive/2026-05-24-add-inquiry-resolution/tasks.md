## 1. Resolution module

- [x] 1.1 Create `src/engine/resolution.ts` exporting `resolveDay` and `isInquiryResolvable`
- [x] 1.2 Add a private `areScrollsConnected(scrollIds, desk)` helper that BFS-walks `DESK_EDGES` over occupied positions

## 2. Re-exports

- [x] 2.1 Re-export resolution functions from `src/engine/index.ts`

## 3. Build

- [x] 3.1 `npm run build` succeeds
- [x] 3.2 The whole engine + storage layer is still under 5KB gzipped JS
