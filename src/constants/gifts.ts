export type GiftDifficulty = "Easy" | "Medium";
export type GiftStatus = "available" | "coming-soon";
export type ClayTint = "clay-primary" | "clay-coral" | "clay-lavender" | "clay-yellow" | "clay-sky";

export type GiftType = {
  id: string;
  /** Route segment — /gifts/[slug] */
  slug: string;
  icon: string;
  tint: ClayTint;
  title: string;
  shortDescription: string;
  exampleLabel?: string;
  exampleChips: string[];
  difficulty: GiftDifficulty;
  estimatedMinutes: string;
  status: GiftStatus;
};

/** The Romantic Interactive Gifts library — six mini interactive
 *  experiences, all wired to real creation flows. */
export const GIFT_TYPES: GiftType[] = [
  {
    id: "scratch-cards",
    slug: "scratch-cards",
    icon: "🎟️",
    tint: "clay-coral",
    title: "Scratch Card Collection",
    shortDescription: "Hide surprises behind realistic scratch cards.",
    exampleLabel: "Scratch to reveal:",
    exampleChips: ["❤️ A love note", "🎁 A surprise gift", "🍕 Tonight's dinner", "✈️ Our next trip"],
    difficulty: "Easy",
    estimatedMinutes: "~5 min to create",
    status: "available",
  },
  {
    id: "treasure-hunt",
    slug: "treasure-hunt",
    icon: "🗺️",
    tint: "clay-sky",
    title: "Treasure Hunt",
    shortDescription: "Lead someone through clues until they discover the final surprise.",
    exampleLabel: '"Look where we always keep coffee."',
    exampleChips: ["📍 Find the clue", "🔑 Unlock the next one", "❤️ Final gift"],
    difficulty: "Medium",
    estimatedMinutes: "~10 min to create",
    status: "available",
  },
  {
    id: "gift-box",
    slug: "gift-box",
    icon: "🎁",
    tint: "clay-lavender",
    title: "Gift Box Reveal",
    shortDescription: "Wrap your surprise inside a beautifully animated gift box.",
    exampleLabel: "Tap the ribbon:",
    exampleChips: ["🎀 Ribbon unties", "📦 Box shakes", "✨ Surprise appears"],
    difficulty: "Easy",
    estimatedMinutes: "~4 min to create",
    status: "available",
  },
  {
    id: "love-wrapped",
    slug: "love-wrapped",
    icon: "🎵",
    tint: "clay-primary",
    title: "Love Wrapped",
    shortDescription: "Your relationship, presented like a beautiful yearly recap.",
    exampleLabel: "Cinematic stat cards:",
    exampleChips: ["❤️ Together 742 days", "📸 214 memories", "✈️ 6 trips", "🍕 58 pizza dates"],
    difficulty: "Medium",
    estimatedMinutes: "~8 min to create",
    status: "available",
  },
  {
    id: "coupon-book",
    slug: "coupon-book",
    icon: "🎫",
    tint: "clay-yellow",
    title: "Love Coupon Book",
    shortDescription: "Create redeemable coupons for thoughtful moments together.",
    exampleLabel: "Flip through coupons for:",
    exampleChips: ["🤗 Free Hug", "🎬 Movie Night", "🥞 Breakfast in Bed", "🎉 Surprise Date"],
    difficulty: "Easy",
    estimatedMinutes: "~6 min to create",
    status: "available",
  },
  {
    id: "how-well",
    slug: "how-well-do-you-know-me",
    icon: "❓",
    tint: "clay-coral",
    title: "How Well Do You Know Me?",
    shortDescription: "Create a fun relationship quiz to see how well they know you.",
    exampleLabel: "What's my favorite dessert?",
    exampleChips: ["🍰 Cake", "🍫 Brownie", "🍦 Ice Cream"],
    difficulty: "Easy",
    estimatedMinutes: "~7 min to create",
    status: "available",
  },
];
