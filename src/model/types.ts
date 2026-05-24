export type ScrollId = string;
export type FragmentId = string;
export type InquiryId = string;

export type Scroll = {
  id: ScrollId;
  title: string;
  reference: string;
  textExcerpt: string;
  tags: string[];
  staminaCost: number;
};

export type FragmentUnlock = {
  scrollIds: ScrollId[];
  requireAdjacency?: boolean;
};

export type Fragment = {
  id: FragmentId;
  text: string;
  unlockedBy: FragmentUnlock;
};

export type Inquiry = {
  id: InquiryId;
  question: string;
  requiredScrollIds: ScrollId[];
  adjacencyBonus?: ScrollId[];
  fragments: Fragment[];
};

export type Journal = {
  unlockedFragments: FragmentId[];
  resolvedInquiries: InquiryId[];
  draftedScrollIds: ScrollId[];
  daysPlayed: number;
};

export type DeskSlot = Scroll | null;

export type Day = {
  inquiryId: InquiryId;
  stamina: number;
  deck: ScrollId[];
  offered: ScrollId[];
  desk: [DeskSlot, DeskSlot, DeskSlot, DeskSlot];
};
