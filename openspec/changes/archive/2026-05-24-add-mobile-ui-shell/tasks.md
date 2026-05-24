## 1. Content placeholder

- [x] 1.1 Create `src/content/index.ts` exporting empty `scrolls: Scroll[]`, `inquiries: Inquiry[]`, and a memoised `scrollIndex` map for `O(1)` lookup
- [x] 1.2 Confirm tsc accepts the file (empty arrays satisfy the types)

## 2. State store

- [x] 2.1 Create `src/state.ts` exporting `GameState`, `getState`, `setState`, `dispatch(action)` and the `Action` union (`select-scroll`, `place-here`, `clear-selection`, `open-journal`, `close-journal`, `continue-day`, `commit-answer`)
- [x] 2.2 `dispatch` is the only place the engine and storage layer are called; render only reads state

## 3. UI modules

- [x] 3.1 Create `src/ui/escape.ts` exporting `escapeHtml(value: string): string`
- [x] 3.2 Create `src/ui/render.ts` exporting `mount(root: HTMLElement): void` which subscribes to state and renders `#app.innerHTML` on each change
- [x] 3.3 Render screens: `play`, `end-of-day`, `journal`, `completed`, `empty-archive`
- [x] 3.4 Wire a single delegated click handler on `#app` that reads `data-action` / `data-arg` and dispatches

## 4. Bootstrap

- [x] 4.1 Update `src/main.ts` to: import style, find `#app`, call `mount(app)`

## 5. Styles

- [x] 5.1 Add CSS for `.topbar`, `.offer`, `.scroll-card`, `.desk`, `.slot`, `.overlay`, `.end-panel`, `.empty-state`/`state-screen`, `.pill`, `.btn`
- [x] 5.2 Honor portrait orientation (max-width 420px); desk anchored bottom with flex column layout
- [x] 5.3 Selected scroll uses a 1px accent border + inset accent shadow + soft accent background; no transforms
- [x] 5.4 Overlay uses `position: fixed; inset: 0;` with parchment background and a "Close" tap target

## 6. Build and deploy verification

- [x] 6.1 `npm run build` succeeds; total JS gzipped < 15KB (measured: 3.91 KB)
- [x] 6.2 `npm run dev` serves the entry HTML at `/city-of-david/` (curl-verified)
- [ ] 6.3 Push to main and confirm the GitHub Pages deploy succeeds
