export type ScrollId = string;
export type ThemeId = string;

export type Theme = {
  id: ThemeId;
  whisper: string;
  description?: string;
};

export type Scroll = {
  id: ScrollId;
  title: string;
  reference: string;
  textExcerpt: string;
  tags: string[];
  themeIds: ThemeId[];
  staminaCost: number;
};

export type Noticing = {
  themeId: ThemeId;
  whisper: string;
  scrollIds: [ScrollId, ScrollId];
  day: number;
  annotation?: string;
};

export type Journal = {
  draftedScrollIds: ScrollId[];
  noticings: Noticing[];
  daysPlayed: number;
};

export type DeskSlot = Scroll | null;

export type Day = {
  stamina: number;
  deck: ScrollId[];
  offered: ScrollId[];
  desk: [DeskSlot, DeskSlot, DeskSlot, DeskSlot];
};
