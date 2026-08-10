"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBlankScratchCardGift,
  getScratchCardGiftByEditToken,
  updateScratchCardGift,
  createBlankTreasureHunt,
  getTreasureHuntByEditToken,
  updateTreasureHunt,
  createBlankGiftBox,
  getGiftBoxByEditToken,
  updateGiftBox,
  createBlankLoveWrapped,
  getLoveWrappedByEditToken,
  updateLoveWrapped,
  createBlankCouponBook,
  getCouponBookByEditToken,
  updateCouponBook,
  redeemCoupon,
  createBlankRelationshipQuiz,
  getRelationshipQuizByEditToken,
  updateRelationshipQuiz,
  createBlankSecretEnvelope,
  getSecretEnvelopeByEditToken,
  updateSecretEnvelope,
  createBlankFortuneCookie,
  getFortuneCookieByEditToken,
  updateFortuneCookie,
  createBlankMemoryQuiz,
  getMemoryQuizByEditToken,
  updateMemoryQuiz,
  createBlankOpenWhenCollection,
  getOpenWhenCollectionByEditToken,
  updateOpenWhenCollection,
  openLetter,
  createBlankDateGenerator,
  getDateGeneratorByEditToken,
  updateDateGenerator,
  createBlankHundredReasons,
  getHundredReasonsByEditToken,
  updateHundredReasons,
} from "@/database/queries/gifts";
import {
  saveScratchCardGiftSchema,
  saveTreasureHuntSchema,
  saveGiftBoxSchema,
  saveLoveWrappedSchema,
  saveCouponBookSchema,
  redeemCouponSchema,
  saveRelationshipQuizSchema,
  saveSecretEnvelopeSchema,
  saveFortuneCookieSchema,
  saveMemoryQuizSchema,
  saveOpenWhenCollectionSchema,
  openLetterSchema,
  saveDateGeneratorSchema,
  saveHundredReasonsSchema,
} from "@/schemas/gifts";
import { getCurrentUserId } from "@/lib/supabase/server";
import type {
  CouponBookData,
  DateGeneratorData,
  FortuneCookieData,
  GiftBoxData,
  HundredReasonsData,
  LoveWrappedData,
  MemoryQuizData,
  OpenWhenCollectionData,
  RelationshipQuizData,
  ScratchCardGiftData,
  SecretEnvelopeData,
  TreasureHuntData,
} from "@/types/gifts";

export type GiftActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function createBlankScratchCardGiftAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const gift = await createBlankScratchCardGift(userId);
  redirect(`/gifts/scratch-cards/edit/${gift.editToken}`);
}

export async function saveScratchCardGiftAction(
  input: unknown,
): Promise<GiftActionResult<ScratchCardGiftData>> {
  const parsed = saveScratchCardGiftSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getScratchCardGiftByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const gift = await updateScratchCardGift(parsed.data.editToken, {
    title: parsed.data.title,
    cards: parsed.data.cards,
  });

  revalidatePath(`/gifts/scratch-cards/edit/${gift.editToken}`);
  revalidatePath(`/gifts/scratch-cards/${gift.id}`);

  return { success: true, data: gift };
}

export async function createBlankTreasureHuntAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const hunt = await createBlankTreasureHunt(userId);
  redirect(`/gifts/treasure-hunt/edit/${hunt.editToken}`);
}

export async function saveTreasureHuntAction(
  input: unknown,
): Promise<GiftActionResult<TreasureHuntData>> {
  const parsed = saveTreasureHuntSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getTreasureHuntByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const hunt = await updateTreasureHunt(parsed.data.editToken, {
    title: parsed.data.title,
    clues: parsed.data.clues,
    finalMessage: parsed.data.finalMessage,
    finalPhotoUrl: parsed.data.finalPhotoUrl,
  });

  revalidatePath(`/gifts/treasure-hunt/edit/${hunt.editToken}`);
  revalidatePath(`/gifts/treasure-hunt/${hunt.id}`);

  return { success: true, data: hunt };
}

export async function createBlankGiftBoxAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const box = await createBlankGiftBox(userId);
  redirect(`/gifts/gift-box/edit/${box.editToken}`);
}

export async function saveGiftBoxAction(input: unknown): Promise<GiftActionResult<GiftBoxData>> {
  const parsed = saveGiftBoxSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getGiftBoxByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const box = await updateGiftBox(parsed.data.editToken, {
    title: parsed.data.title,
    message: parsed.data.message,
    photoUrl: parsed.data.photoUrl,
  });

  revalidatePath(`/gifts/gift-box/edit/${box.editToken}`);
  revalidatePath(`/gifts/gift-box/${box.id}`);

  return { success: true, data: box };
}

export async function createBlankLoveWrappedAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const wrapped = await createBlankLoveWrapped(userId);
  redirect(`/gifts/love-wrapped/edit/${wrapped.editToken}`);
}

export async function saveLoveWrappedAction(input: unknown): Promise<GiftActionResult<LoveWrappedData>> {
  const parsed = saveLoveWrappedSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getLoveWrappedByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const wrapped = await updateLoveWrapped(parsed.data.editToken, {
    title: parsed.data.title,
    startDate: parsed.data.startDate,
    stats: parsed.data.stats,
    moments: parsed.data.moments,
    closingMessage: parsed.data.closingMessage,
  });

  revalidatePath(`/gifts/love-wrapped/edit/${wrapped.editToken}`);
  revalidatePath(`/gifts/love-wrapped/${wrapped.id}`);

  return { success: true, data: wrapped };
}

export async function createBlankCouponBookAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const book = await createBlankCouponBook(userId);
  redirect(`/gifts/coupon-book/edit/${book.editToken}`);
}

export async function saveCouponBookAction(input: unknown): Promise<GiftActionResult<CouponBookData>> {
  const parsed = saveCouponBookSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getCouponBookByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const book = await updateCouponBook(parsed.data.editToken, {
    title: parsed.data.title,
    coupons: parsed.data.coupons,
  });

  revalidatePath(`/gifts/coupon-book/edit/${book.editToken}`);
  revalidatePath(`/gifts/coupon-book/${book.id}`);

  return { success: true, data: book };
}

export async function redeemCouponAction(input: unknown): Promise<GiftActionResult<CouponBookData>> {
  const parsed = redeemCouponSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "That coupon couldn't be found." };
  }

  const book = await redeemCoupon(parsed.data.id, parsed.data.couponId);
  if (!book) {
    return { success: false, error: "That coupon couldn't be found." };
  }

  revalidatePath(`/gifts/coupon-book/${book.id}`);

  return { success: true, data: book };
}

export async function createBlankRelationshipQuizAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const quiz = await createBlankRelationshipQuiz(userId);
  redirect(`/gifts/how-well-do-you-know-me/edit/${quiz.editToken}`);
}

export async function saveRelationshipQuizAction(input: unknown): Promise<GiftActionResult<RelationshipQuizData>> {
  const parsed = saveRelationshipQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getRelationshipQuizByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const quiz = await updateRelationshipQuiz(parsed.data.editToken, {
    title: parsed.data.title,
    questions: parsed.data.questions,
    resultTiers: parsed.data.resultTiers,
  });

  revalidatePath(`/gifts/how-well-do-you-know-me/edit/${quiz.editToken}`);
  revalidatePath(`/gifts/how-well-do-you-know-me/${quiz.id}`);

  return { success: true, data: quiz };
}

// ---------------------------------------------------------------------------
// Second wave
// ---------------------------------------------------------------------------

export async function createBlankSecretEnvelopeAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const envelope = await createBlankSecretEnvelope(userId);
  redirect(`/gifts/secret-envelope/edit/${envelope.editToken}`);
}

export async function saveSecretEnvelopeAction(input: unknown): Promise<GiftActionResult<SecretEnvelopeData>> {
  const parsed = saveSecretEnvelopeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getSecretEnvelopeByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const envelope = await updateSecretEnvelope(parsed.data.editToken, {
    title: parsed.data.title,
    style: parsed.data.style,
    recipientName: parsed.data.recipientName,
    letterTitle: parsed.data.letterTitle,
    message: parsed.data.message,
    senderName: parsed.data.senderName,
    photoUrl: parsed.data.photoUrl,
  });

  revalidatePath(`/gifts/secret-envelope/edit/${envelope.editToken}`);
  revalidatePath(`/gifts/secret-envelope/${envelope.id}`);

  return { success: true, data: envelope };
}

export async function createBlankFortuneCookieAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const cookie = await createBlankFortuneCookie(userId);
  redirect(`/gifts/fortune-cookie/edit/${cookie.editToken}`);
}

export async function saveFortuneCookieAction(input: unknown): Promise<GiftActionResult<FortuneCookieData>> {
  const parsed = saveFortuneCookieSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getFortuneCookieByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const cookie = await updateFortuneCookie(parsed.data.editToken, {
    title: parsed.data.title,
    recipientName: parsed.data.recipientName,
    fortunes: parsed.data.fortunes,
  });

  revalidatePath(`/gifts/fortune-cookie/edit/${cookie.editToken}`);
  revalidatePath(`/gifts/fortune-cookie/${cookie.id}`);

  return { success: true, data: cookie };
}

export async function createBlankMemoryQuizAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const quiz = await createBlankMemoryQuiz(userId);
  redirect(`/gifts/memory-quiz/edit/${quiz.editToken}`);
}

export async function saveMemoryQuizAction(input: unknown): Promise<GiftActionResult<MemoryQuizData>> {
  const parsed = saveMemoryQuizSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getMemoryQuizByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const quiz = await updateMemoryQuiz(parsed.data.editToken, {
    title: parsed.data.title,
    questions: parsed.data.questions,
    resultTiers: parsed.data.resultTiers,
  });

  revalidatePath(`/gifts/memory-quiz/edit/${quiz.editToken}`);
  revalidatePath(`/gifts/memory-quiz/${quiz.id}`);

  return { success: true, data: quiz };
}

export async function createBlankOpenWhenCollectionAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const collection = await createBlankOpenWhenCollection(userId);
  redirect(`/gifts/open-when/edit/${collection.editToken}`);
}

export async function saveOpenWhenCollectionAction(
  input: unknown,
): Promise<GiftActionResult<OpenWhenCollectionData>> {
  const parsed = saveOpenWhenCollectionSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getOpenWhenCollectionByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const collection = await updateOpenWhenCollection(parsed.data.editToken, {
    title: parsed.data.title,
    letters: parsed.data.letters,
  });

  revalidatePath(`/gifts/open-when/edit/${collection.editToken}`);
  revalidatePath(`/gifts/open-when/${collection.id}`);

  return { success: true, data: collection };
}

export async function openLetterAction(input: unknown): Promise<GiftActionResult<OpenWhenCollectionData>> {
  const parsed = openLetterSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "That letter couldn't be found." };
  }

  const collection = await openLetter(parsed.data.id, parsed.data.letterId);
  if (!collection) {
    return { success: false, error: "That letter couldn't be found." };
  }

  revalidatePath(`/gifts/open-when/${collection.id}`);

  return { success: true, data: collection };
}

export async function createBlankDateGeneratorAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const generator = await createBlankDateGenerator(userId);
  redirect(`/gifts/date-generator/edit/${generator.editToken}`);
}

export async function saveDateGeneratorAction(input: unknown): Promise<GiftActionResult<DateGeneratorData>> {
  const parsed = saveDateGeneratorSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getDateGeneratorByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const generator = await updateDateGenerator(parsed.data.editToken, {
    title: parsed.data.title,
    ideas: parsed.data.ideas,
  });

  revalidatePath(`/gifts/date-generator/edit/${generator.editToken}`);
  revalidatePath(`/gifts/date-generator/${generator.id}`);

  return { success: true, data: generator };
}

export async function createBlankHundredReasonsAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const gift = await createBlankHundredReasons(userId);
  redirect(`/gifts/100-reasons/edit/${gift.editToken}`);
}

export async function saveHundredReasonsAction(input: unknown): Promise<GiftActionResult<HundredReasonsData>> {
  const parsed = saveHundredReasonsSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getHundredReasonsByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const gift = await updateHundredReasons(parsed.data.editToken, {
    title: parsed.data.title,
    reasons: parsed.data.reasons,
    finalMessage: parsed.data.finalMessage,
  });

  revalidatePath(`/gifts/100-reasons/edit/${gift.editToken}`);
  revalidatePath(`/gifts/100-reasons/${gift.id}`);

  return { success: true, data: gift };
}
