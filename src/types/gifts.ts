/** A single scratch card — see src/schemas/gifts.ts for validation. */
export type ScratchCard = {
  id: string;
  title: string;
  reward: string;
  photoUrl: string | null;
};

export type ScratchCardGiftData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  cards: ScratchCard[];
  createdAt: string;
  updatedAt: string;
};

export const SCRATCH_CARD_LIMITS = {
  MIN_CARDS: 3,
  MAX_CARDS: 20,
  TITLE_MAX_LENGTH: 60,
  REWARD_MAX_LENGTH: 200,
  GIFT_TITLE_MAX_LENGTH: 80,
} as const;

/** A single step in the chain — solved by entering `code` (matched
 *  trimmed + case-insensitively) before the next clue unlocks. */
export type TreasureHuntClue = {
  id: string;
  text: string;
  hint: string | null;
  photoUrl: string | null;
  code: string;
};

export type TreasureHuntData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  clues: TreasureHuntClue[];
  finalMessage: string;
  finalPhotoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export const TREASURE_HUNT_LIMITS = {
  MIN_CLUES: 1,
  MAX_CLUES: 15,
  TEXT_MAX_LENGTH: 300,
  HINT_MAX_LENGTH: 150,
  CODE_MAX_LENGTH: 40,
  FINAL_MESSAGE_MAX_LENGTH: 400,
  GIFT_TITLE_MAX_LENGTH: 80,
} as const;

/** The third gift — no list, just one message + one optional photo sealed
 *  inside a box the recipient taps open. */
export type GiftBoxData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  message: string;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export const GIFT_BOX_LIMITS = {
  MESSAGE_MAX_LENGTH: 400,
  GIFT_TITLE_MAX_LENGTH: 80,
} as const;

/** A count-up number stat (e.g. "214 memories"). */
export type WrappedStat = {
  id: string;
  emoji: string;
  label: string;
  value: number;
};

/** One flexible "moment" slide — covers favorite place, funniest memory,
 *  best photo, inside jokes, future goals, and anything else the creator
 *  wants to add, all in the same shape. */
export type WrappedMoment = {
  id: string;
  emoji: string;
  label: string;
  text: string;
  photoUrl: string | null;
};

export type LoveWrappedData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  startDate: string;
  stats: WrappedStat[];
  moments: WrappedMoment[];
  closingMessage: string;
  createdAt: string;
  updatedAt: string;
};

export const LOVE_WRAPPED_LIMITS = {
  MIN_STATS: 1,
  MAX_STATS: 6,
  MIN_MOMENTS: 1,
  MAX_MOMENTS: 8,
  LABEL_MAX_LENGTH: 40,
  TEXT_MAX_LENGTH: 300,
  CLOSING_MAX_LENGTH: 200,
  GIFT_TITLE_MAX_LENGTH: 80,
} as const;

export type Coupon = {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  expiry: string | null;
  redeemed: boolean;
};

export type CouponBookData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  coupons: Coupon[];
  createdAt: string;
  updatedAt: string;
};

export const COUPON_BOOK_LIMITS = {
  MIN_COUPONS: 1,
  MAX_COUPONS: 20,
  TITLE_MAX_LENGTH: 40,
  DESCRIPTION_MAX_LENGTH: 150,
  EXPIRY_MAX_LENGTH: 40,
  GIFT_TITLE_MAX_LENGTH: 80,
} as const;

/** Preset coupon accent colors — a small curated set rather than a raw
 *  color picker, matching the app's "no random colors" design system. */
export const COUPON_COLORS = [
  { value: "coral", label: "Coral", bg: "#FF8A65", text: "#7A2E12" },
  { value: "lavender", label: "Lavender", bg: "#B79CED", text: "#3B2170" },
  { value: "yellow", label: "Warm Yellow", bg: "#FFD166", text: "#6B4A00" },
  { value: "sky", label: "Sky", bg: "#8FD3FF", text: "#0A3A5C" },
  { value: "primary", label: "Green", bg: "#8CD94A", text: "#2F5E12" },
] as const;

export type QuizOption = {
  id: string;
  label: string;
  photoUrl: string | null;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type QuizResultTier = {
  id: string;
  minPercent: number;
  title: string;
  message: string;
};

export type RelationshipQuizData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  questions: QuizQuestion[];
  resultTiers: QuizResultTier[];
  createdAt: string;
  updatedAt: string;
};

export const QUIZ_LIMITS = {
  MIN_QUESTIONS: 5,
  MAX_QUESTIONS: 50,
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 4,
  PROMPT_MAX_LENGTH: 200,
  OPTION_LABEL_MAX_LENGTH: 60,
  MIN_TIERS: 1,
  MAX_TIERS: 5,
  TIER_TITLE_MAX_LENGTH: 60,
  TIER_MESSAGE_MAX_LENGTH: 200,
  GIFT_TITLE_MAX_LENGTH: 80,
} as const;
