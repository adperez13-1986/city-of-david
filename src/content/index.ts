import type { Scroll, ScrollId } from '../model/index.ts';
import { scrolls } from './scrolls.ts';
import { inquiries } from './inquiries.ts';

export { scrolls } from './scrolls.ts';
export { inquiries } from './inquiries.ts';

export const scrollIndex: Readonly<Record<ScrollId, Scroll>> = Object.freeze(
  Object.fromEntries(scrolls.map((s) => [s.id, s])),
);

if (import.meta.env.DEV) {
  validateContent();
}

function validateContent(): void {
  const scrollIds = new Set(scrolls.map((s) => s.id));
  for (const inquiry of inquiries) {
    for (const id of inquiry.requiredScrollIds) {
      if (!scrollIds.has(id)) {
        console.warn(
          `[content] inquiry "${inquiry.id}" references missing scroll: ${id}`,
        );
      }
    }
    for (const fragment of inquiry.fragments) {
      for (const id of fragment.unlockedBy.scrollIds) {
        if (!scrollIds.has(id)) {
          console.warn(
            `[content] fragment "${fragment.id}" references missing scroll: ${id}`,
          );
        }
      }
    }
  }
}
