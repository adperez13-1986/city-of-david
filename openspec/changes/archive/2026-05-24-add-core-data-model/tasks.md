## 1. Create the model module

- [x] 1.1 Create `src/model/constants.ts` exporting `DAY_STAMINA`, `DESK_SLOT_COUNT`, `SCROLLS_OFFERED_PER_TURN`
- [x] 1.2 Create `src/model/types.ts` exporting `Scroll`, `Fragment`, `Inquiry`, `Journal`, `Day`, and any small aliases used by them
- [x] 1.3 Create `src/model/index.ts` re-exporting everything from `constants.ts` and `types.ts`

## 2. Wire the model into the bootstrap path

- [x] 2.1 Import the constants module from `src/main.ts` so the build pipeline confirms it compiles into the bundle (placeholder reference is fine — gameplay use comes later)
- [x] 2.2 Confirm `npm run build` succeeds and the bundle size delta is ≤ 0.1 KB gzipped (types are erased, constants are inlined; only the import statement should appear)
