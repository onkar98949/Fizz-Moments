import { z } from "zod";
import {
  COUPON_BOOK_LIMITS,
  DATE_GENERATOR_LIMITS,
  FORTUNE_COOKIE_LIMITS,
  GIFT_BOX_LIMITS,
  HUNDRED_REASONS_LIMITS,
  LOVE_WRAPPED_LIMITS,
  MEMORY_QUIZ_LIMITS,
  OPEN_WHEN_LIMITS,
  QUIZ_LIMITS,
  SCRATCH_CARD_LIMITS,
  SECRET_ENVELOPE_LIMITS,
  TREASURE_HUNT_LIMITS,
} from "@/types/gifts";

export const scratchCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Give this card a title.").max(SCRATCH_CARD_LIMITS.TITLE_MAX_LENGTH),
  reward: z.string().trim().min(1, "What's hidden behind this one?").max(SCRATCH_CARD_LIMITS.REWARD_MAX_LENGTH),
  photoUrl: z.string().nullable(),
});

export const scratchCardsArraySchema = z
  .array(scratchCardSchema)
  .min(SCRATCH_CARD_LIMITS.MIN_CARDS, `Add at least ${SCRATCH_CARD_LIMITS.MIN_CARDS} cards.`)
  .max(SCRATCH_CARD_LIMITS.MAX_CARDS, `Keep it to ${SCRATCH_CARD_LIMITS.MAX_CARDS} cards or fewer.`);

export const saveScratchCardGiftSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your gift a title.").max(SCRATCH_CARD_LIMITS.GIFT_TITLE_MAX_LENGTH),
  cards: scratchCardsArraySchema,
});

export type SaveScratchCardGiftInput = z.infer<typeof saveScratchCardGiftSchema>;

export const treasureHuntClueSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1, "Write the clue.").max(TREASURE_HUNT_LIMITS.TEXT_MAX_LENGTH),
  hint: z.string().trim().max(TREASURE_HUNT_LIMITS.HINT_MAX_LENGTH).nullable(),
  photoUrl: z.string().nullable(),
  code: z.string().trim().min(1, "Set the code that unlocks the next clue.").max(TREASURE_HUNT_LIMITS.CODE_MAX_LENGTH),
});

export const treasureHuntCluesArraySchema = z
  .array(treasureHuntClueSchema)
  .min(TREASURE_HUNT_LIMITS.MIN_CLUES, `Add at least ${TREASURE_HUNT_LIMITS.MIN_CLUES} clue.`)
  .max(TREASURE_HUNT_LIMITS.MAX_CLUES, `Keep it to ${TREASURE_HUNT_LIMITS.MAX_CLUES} clues or fewer.`);

export const saveTreasureHuntSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your hunt a title.").max(TREASURE_HUNT_LIMITS.GIFT_TITLE_MAX_LENGTH),
  clues: treasureHuntCluesArraySchema,
  finalMessage: z.string().trim().min(1, "What's the final surprise?").max(TREASURE_HUNT_LIMITS.FINAL_MESSAGE_MAX_LENGTH),
  finalPhotoUrl: z.string().nullable(),
});

export type SaveTreasureHuntInput = z.infer<typeof saveTreasureHuntSchema>;

export const saveGiftBoxSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your gift a title.").max(GIFT_BOX_LIMITS.GIFT_TITLE_MAX_LENGTH),
  message: z.string().trim().min(1, "What's inside the box?").max(GIFT_BOX_LIMITS.MESSAGE_MAX_LENGTH),
  photoUrl: z.string().nullable(),
});

export type SaveGiftBoxInput = z.infer<typeof saveGiftBoxSchema>;

export const wrappedStatSchema = z.object({
  id: z.string().min(1),
  emoji: z.string().min(1).max(8),
  label: z.string().trim().min(1, "Label this stat.").max(LOVE_WRAPPED_LIMITS.LABEL_MAX_LENGTH),
  value: z.number().int().min(0).max(999999),
});

export const wrappedMomentSchema = z.object({
  id: z.string().min(1),
  emoji: z.string().min(1).max(8),
  label: z.string().trim().min(1, "Label this moment.").max(LOVE_WRAPPED_LIMITS.LABEL_MAX_LENGTH),
  text: z.string().trim().min(1, "Write a little about it.").max(LOVE_WRAPPED_LIMITS.TEXT_MAX_LENGTH),
  photoUrl: z.string().nullable(),
});

export const wrappedStatsArraySchema = z
  .array(wrappedStatSchema)
  .min(LOVE_WRAPPED_LIMITS.MIN_STATS, `Add at least ${LOVE_WRAPPED_LIMITS.MIN_STATS} stat.`)
  .max(LOVE_WRAPPED_LIMITS.MAX_STATS, `Keep it to ${LOVE_WRAPPED_LIMITS.MAX_STATS} stats or fewer.`);

export const wrappedMomentsArraySchema = z
  .array(wrappedMomentSchema)
  .min(LOVE_WRAPPED_LIMITS.MIN_MOMENTS, `Add at least ${LOVE_WRAPPED_LIMITS.MIN_MOMENTS} moment.`)
  .max(LOVE_WRAPPED_LIMITS.MAX_MOMENTS, `Keep it to ${LOVE_WRAPPED_LIMITS.MAX_MOMENTS} moments or fewer.`);

export const saveLoveWrappedSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your recap a title.").max(LOVE_WRAPPED_LIMITS.GIFT_TITLE_MAX_LENGTH),
  startDate: z.string().min(1, "When did it all start?"),
  stats: wrappedStatsArraySchema,
  moments: wrappedMomentsArraySchema,
  closingMessage: z.string().trim().min(1, "How should it end?").max(LOVE_WRAPPED_LIMITS.CLOSING_MAX_LENGTH),
});

export type SaveLoveWrappedInput = z.infer<typeof saveLoveWrappedSchema>;

export const couponSchema = z.object({
  id: z.string().min(1),
  icon: z.string().min(1).max(8),
  title: z.string().trim().min(1, "Give this coupon a title.").max(COUPON_BOOK_LIMITS.TITLE_MAX_LENGTH),
  description: z.string().trim().max(COUPON_BOOK_LIMITS.DESCRIPTION_MAX_LENGTH),
  color: z.string().min(1),
  expiry: z.string().trim().max(COUPON_BOOK_LIMITS.EXPIRY_MAX_LENGTH).nullable(),
  redeemed: z.boolean(),
});

export const couponsArraySchema = z
  .array(couponSchema)
  .min(COUPON_BOOK_LIMITS.MIN_COUPONS, `Add at least ${COUPON_BOOK_LIMITS.MIN_COUPONS} coupon.`)
  .max(COUPON_BOOK_LIMITS.MAX_COUPONS, `Keep it to ${COUPON_BOOK_LIMITS.MAX_COUPONS} coupons or fewer.`);

export const saveCouponBookSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your coupon book a title.").max(COUPON_BOOK_LIMITS.GIFT_TITLE_MAX_LENGTH),
  coupons: couponsArraySchema,
});

export type SaveCouponBookInput = z.infer<typeof saveCouponBookSchema>;

export const redeemCouponSchema = z.object({
  id: z.string().min(1),
  couponId: z.string().min(1),
});

export const quizOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "Give this option text.").max(QUIZ_LIMITS.OPTION_LABEL_MAX_LENGTH),
  photoUrl: z.string().nullable(),
});

export const quizQuestionSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().trim().min(1, "Write the question.").max(QUIZ_LIMITS.PROMPT_MAX_LENGTH),
    options: z
      .array(quizOptionSchema)
      .min(QUIZ_LIMITS.MIN_OPTIONS, `Each question needs at least ${QUIZ_LIMITS.MIN_OPTIONS} options.`)
      .max(QUIZ_LIMITS.MAX_OPTIONS, `Keep it to ${QUIZ_LIMITS.MAX_OPTIONS} options per question.`),
    correctOptionId: z.string().min(1),
  })
  .refine((q) => q.options.some((o) => o.id === q.correctOptionId), {
    message: "Mark which option is correct.",
    path: ["correctOptionId"],
  });

export const quizResultTierSchema = z.object({
  id: z.string().min(1),
  minPercent: z.number().int().min(0).max(100),
  title: z.string().trim().min(1, "Give this result a title.").max(QUIZ_LIMITS.TIER_TITLE_MAX_LENGTH),
  message: z.string().trim().min(1, "What's the message?").max(QUIZ_LIMITS.TIER_MESSAGE_MAX_LENGTH),
});

export const quizQuestionsArraySchema = z
  .array(quizQuestionSchema)
  .min(QUIZ_LIMITS.MIN_QUESTIONS, `Add at least ${QUIZ_LIMITS.MIN_QUESTIONS} questions.`)
  .max(QUIZ_LIMITS.MAX_QUESTIONS, `Keep it to ${QUIZ_LIMITS.MAX_QUESTIONS} questions or fewer.`);

export const quizResultTiersArraySchema = z
  .array(quizResultTierSchema)
  .min(QUIZ_LIMITS.MIN_TIERS, `Add at least ${QUIZ_LIMITS.MIN_TIERS} result.`)
  .max(QUIZ_LIMITS.MAX_TIERS, `Keep it to ${QUIZ_LIMITS.MAX_TIERS} results or fewer.`);

export const saveRelationshipQuizSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your quiz a title.").max(QUIZ_LIMITS.GIFT_TITLE_MAX_LENGTH),
  questions: quizQuestionsArraySchema,
  resultTiers: quizResultTiersArraySchema,
});

export type SaveRelationshipQuizInput = z.infer<typeof saveRelationshipQuizSchema>;

// ---------------------------------------------------------------------------
// Second wave
// ---------------------------------------------------------------------------

export const envelopeStyleSchema = z.enum(["classic", "minimal", "romantic", "vintage", "playful"]);

export const saveSecretEnvelopeSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your letter a title.").max(SECRET_ENVELOPE_LIMITS.GIFT_TITLE_MAX_LENGTH),
  style: envelopeStyleSchema,
  recipientName: z.string().trim().min(1, "Who is this for?").max(SECRET_ENVELOPE_LIMITS.RECIPIENT_NAME_MAX_LENGTH),
  letterTitle: z.string().trim().min(1, "Give your letter a title.").max(SECRET_ENVELOPE_LIMITS.LETTER_TITLE_MAX_LENGTH),
  message: z.string().trim().min(1, "Write your letter.").max(SECRET_ENVELOPE_LIMITS.MESSAGE_MAX_LENGTH),
  senderName: z.string().trim().min(1, "Sign it — who's it from?").max(SECRET_ENVELOPE_LIMITS.SENDER_NAME_MAX_LENGTH),
  photoUrl: z.string().nullable(),
});

export type SaveSecretEnvelopeInput = z.infer<typeof saveSecretEnvelopeSchema>;

export const fortuneSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1, "Write this fortune.").max(FORTUNE_COOKIE_LIMITS.FORTUNE_MAX_LENGTH),
});

export const fortunesArraySchema = z
  .array(fortuneSchema)
  .min(FORTUNE_COOKIE_LIMITS.MIN_FORTUNES, `Add at least ${FORTUNE_COOKIE_LIMITS.MIN_FORTUNES} fortune.`)
  .max(FORTUNE_COOKIE_LIMITS.MAX_FORTUNES, `Keep it to ${FORTUNE_COOKIE_LIMITS.MAX_FORTUNES} fortunes or fewer.`);

export const saveFortuneCookieSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your gift a title.").max(FORTUNE_COOKIE_LIMITS.GIFT_TITLE_MAX_LENGTH),
  recipientName: z.string().trim().min(1, "Who is this for?").max(FORTUNE_COOKIE_LIMITS.RECIPIENT_NAME_MAX_LENGTH),
  fortunes: fortunesArraySchema,
});

export type SaveFortuneCookieInput = z.infer<typeof saveFortuneCookieSchema>;

export const memoryQuizOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "Give this option text.").max(MEMORY_QUIZ_LIMITS.OPTION_LABEL_MAX_LENGTH),
});

export const memoryQuizQuestionSchema = z
  .object({
    id: z.string().min(1),
    prompt: z.string().trim().min(1, "Write the question.").max(MEMORY_QUIZ_LIMITS.PROMPT_MAX_LENGTH),
    options: z
      .array(memoryQuizOptionSchema)
      .min(MEMORY_QUIZ_LIMITS.MIN_OPTIONS, `Each question needs at least ${MEMORY_QUIZ_LIMITS.MIN_OPTIONS} options.`)
      .max(MEMORY_QUIZ_LIMITS.MAX_OPTIONS, `Keep it to ${MEMORY_QUIZ_LIMITS.MAX_OPTIONS} options per question.`),
    correctOptionId: z.string().min(1),
    correctReaction: z.string().trim().min(1, "What do you say when they get it right?").max(MEMORY_QUIZ_LIMITS.REACTION_MAX_LENGTH),
    wrongReaction: z.string().trim().min(1, "What do you say when they get it wrong?").max(MEMORY_QUIZ_LIMITS.REACTION_MAX_LENGTH),
  })
  .refine((q) => q.options.some((o) => o.id === q.correctOptionId), {
    message: "Mark which option is correct.",
    path: ["correctOptionId"],
  });

export const memoryQuizQuestionsArraySchema = z
  .array(memoryQuizQuestionSchema)
  .min(MEMORY_QUIZ_LIMITS.MIN_QUESTIONS, `Add at least ${MEMORY_QUIZ_LIMITS.MIN_QUESTIONS} questions.`)
  .max(MEMORY_QUIZ_LIMITS.MAX_QUESTIONS, `Keep it to ${MEMORY_QUIZ_LIMITS.MAX_QUESTIONS} questions or fewer.`);

export const memoryQuizResultTierSchema = z.object({
  id: z.string().min(1),
  minPercent: z.number().int().min(0).max(100),
  title: z.string().trim().min(1, "Give this result a title.").max(MEMORY_QUIZ_LIMITS.TIER_TITLE_MAX_LENGTH),
  message: z.string().trim().min(1, "What's the message?").max(MEMORY_QUIZ_LIMITS.TIER_MESSAGE_MAX_LENGTH),
});

export const memoryQuizResultTiersArraySchema = z
  .array(memoryQuizResultTierSchema)
  .min(MEMORY_QUIZ_LIMITS.MIN_TIERS, `Add at least ${MEMORY_QUIZ_LIMITS.MIN_TIERS} result.`)
  .max(MEMORY_QUIZ_LIMITS.MAX_TIERS, `Keep it to ${MEMORY_QUIZ_LIMITS.MAX_TIERS} results or fewer.`);

export const saveMemoryQuizSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your quiz a title.").max(MEMORY_QUIZ_LIMITS.GIFT_TITLE_MAX_LENGTH),
  questions: memoryQuizQuestionsArraySchema,
  resultTiers: memoryQuizResultTiersArraySchema,
});

export type SaveMemoryQuizInput = z.infer<typeof saveMemoryQuizSchema>;

export const openWhenLetterSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "What's this letter for? (e.g. \"you miss me\")").max(OPEN_WHEN_LIMITS.LABEL_MAX_LENGTH),
  emoji: z.string().min(1).max(8),
  message: z.string().trim().min(1, "Write this letter.").max(OPEN_WHEN_LIMITS.MESSAGE_MAX_LENGTH),
  photoUrl: z.string().nullable(),
  opened: z.boolean(),
});

export const openWhenLettersArraySchema = z
  .array(openWhenLetterSchema)
  .min(OPEN_WHEN_LIMITS.MIN_LETTERS, `Add at least ${OPEN_WHEN_LIMITS.MIN_LETTERS} letters.`)
  .max(OPEN_WHEN_LIMITS.MAX_LETTERS, `Keep it to ${OPEN_WHEN_LIMITS.MAX_LETTERS} letters or fewer.`);

export const saveOpenWhenCollectionSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your collection a title.").max(OPEN_WHEN_LIMITS.GIFT_TITLE_MAX_LENGTH),
  letters: openWhenLettersArraySchema,
});

export type SaveOpenWhenCollectionInput = z.infer<typeof saveOpenWhenCollectionSchema>;

export const openLetterSchema = z.object({
  id: z.string().min(1),
  letterId: z.string().min(1),
});

export const dateBudgetSchema = z.enum(["Free", "$", "$$", "$$$"]);
export const dateDifficultySchema = z.enum(["Easy", "Medium", "Hard"]);

export const dateIdeaSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1, "Describe the date idea.").max(DATE_GENERATOR_LIMITS.TEXT_MAX_LENGTH),
  budget: dateBudgetSchema,
  difficulty: dateDifficultySchema,
  timeEstimate: z.string().trim().max(DATE_GENERATOR_LIMITS.TIME_ESTIMATE_MAX_LENGTH),
});

export const dateIdeasArraySchema = z
  .array(dateIdeaSchema)
  .min(DATE_GENERATOR_LIMITS.MIN_IDEAS, `Add at least ${DATE_GENERATOR_LIMITS.MIN_IDEAS} ideas.`)
  .max(DATE_GENERATOR_LIMITS.MAX_IDEAS, `Keep it to ${DATE_GENERATOR_LIMITS.MAX_IDEAS} ideas or fewer.`);

export const saveDateGeneratorSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your generator a title.").max(DATE_GENERATOR_LIMITS.GIFT_TITLE_MAX_LENGTH),
  ideas: dateIdeasArraySchema,
});

export type SaveDateGeneratorInput = z.infer<typeof saveDateGeneratorSchema>;

export const loveReasonSchema = z.object({
  id: z.string().min(1),
  text: z.string().trim().min(1, "Write this reason.").max(HUNDRED_REASONS_LIMITS.REASON_MAX_LENGTH),
  photoUrl: z.string().nullable(),
});

export const loveReasonsArraySchema = z
  .array(loveReasonSchema)
  .min(HUNDRED_REASONS_LIMITS.MIN_REASONS, `Add at least ${HUNDRED_REASONS_LIMITS.MIN_REASONS} reasons.`)
  .max(HUNDRED_REASONS_LIMITS.MAX_REASONS, `Keep it to ${HUNDRED_REASONS_LIMITS.MAX_REASONS} reasons or fewer.`);

export const saveHundredReasonsSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your gift a title.").max(HUNDRED_REASONS_LIMITS.GIFT_TITLE_MAX_LENGTH),
  reasons: loveReasonsArraySchema,
  finalMessage: z.string().trim().max(HUNDRED_REASONS_LIMITS.FINAL_MESSAGE_MAX_LENGTH).nullable(),
});

export type SaveHundredReasonsInput = z.infer<typeof saveHundredReasonsSchema>;
