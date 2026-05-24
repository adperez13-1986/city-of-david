## 1. Extend the data model

- [x] 1.1 Add `draftedScrollIds: ScrollId[]` to `Journal` in `src/model/types.ts`

## 2. Storage module

- [x] 2.1 Create `src/storage/journal.ts` exporting `STORAGE_KEY`, `emptyJournal`, `loadJournal`, `saveJournal`
- [x] 2.2 `loadJournal` wraps the parse in try/catch and falls back to `emptyJournal()` on any error or shape mismatch
- [x] 2.3 `loadJournal` validates the four expected fields exist and are the right primitive types — anything else is treated as corrupt

## 3. Build

- [x] 3.1 `npm run build` succeeds
- [x] 3.2 Bundle JS stays under 5KB gzipped
