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

/** The Interactive Digital Gifts library — twelve mini interactive
 *  experiences, all wired to real creation flows. Not romance-only: gift
 *  types here work equally for friends, family, and "just because." */
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
  {
    id: "secret-envelope",
    slug: "secret-envelope",
    icon: "💌",
    tint: "clay-lavender",
    title: "Secret Envelope",
    shortDescription: "Hide a personal letter inside a digital envelope they have to open.",
    exampleLabel: "Tap to open:",
    exampleChips: ["✉️ Sealed shut", "🖐️ Flap opens", "📜 Letter unfolds"],
    difficulty: "Easy",
    estimatedMinutes: "~4 min to create",
    status: "available",
  },
  {
    id: "fortune-cookie",
    slug: "fortune-cookie",
    icon: "🥠",
    tint: "clay-yellow",
    title: "Love Fortune Cookie",
    shortDescription: "Let them crack open a surprise fortune written just for them.",
    exampleLabel: "Crack it open:",
    exampleChips: ["🥠 One cookie", "✨ Splits apart", "📃 Fortune revealed"],
    difficulty: "Easy",
    estimatedMinutes: "~3 min to create",
    status: "available",
  },
  {
    id: "memory-quiz",
    slug: "memory-quiz",
    icon: "🧠",
    tint: "clay-sky",
    title: "Memory Quiz",
    shortDescription: "See how well they remember your story, with reactions after every answer.",
    exampleLabel: "Where was our first date?",
    exampleChips: ["☕ Cafe", "🌳 Park", "🎬 Cinema"],
    difficulty: "Medium",
    estimatedMinutes: "~8 min to create",
    status: "available",
  },
  {
    id: "open-when",
    slug: "open-when",
    icon: "✉️",
    tint: "clay-coral",
    title: "Open When...",
    shortDescription: "A collection of letters for every moment they need you.",
    exampleLabel: "Open when you...",
    exampleChips: ["💌 Miss me", "🌧️ Have a bad day", "🥺 Need a hug"],
    difficulty: "Medium",
    estimatedMinutes: "~10 min to create",
    status: "available",
  },
  {
    id: "date-generator",
    slug: "date-generator",
    icon: "🎲",
    tint: "clay-primary",
    title: "Date Idea Generator",
    shortDescription: "Spin for your next date — curated by you, picked at random.",
    exampleLabel: "Spin for a date:",
    exampleChips: ["🍰 Dessert hunt", "🚗 Midnight drive", "🍳 Breakfast together"],
    difficulty: "Easy",
    estimatedMinutes: "~5 min to create",
    status: "available",
  },
  {
    id: "100-reasons",
    slug: "100-reasons",
    icon: "💚",
    tint: "clay-lavender",
    title: "100 Reasons I Love You",
    shortDescription: "Give them tiny reasons to smile, one beautiful reveal at a time.",
    exampleLabel: "Reason #01:",
    exampleChips: ["😄 Your laugh", "🤝 The little things", "❤️ You"],
    difficulty: "Medium",
    estimatedMinutes: "~12 min to create",
    status: "available",
  },
];
