import type { Inquiry, Scroll, ScrollId } from '../model/index.ts';

export const scrolls: Scroll[] = [];

export const inquiries: Inquiry[] = [];

export const scrollIndex: Readonly<Record<ScrollId, Scroll>> = Object.freeze(
  Object.fromEntries(scrolls.map((s) => [s.id, s])),
);
