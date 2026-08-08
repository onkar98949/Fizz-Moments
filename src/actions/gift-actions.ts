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
} from "@/database/queries/gifts";
import {
  saveScratchCardGiftSchema,
  saveTreasureHuntSchema,
  saveGiftBoxSchema,
  saveLoveWrappedSchema,
  saveCouponBookSchema,
  redeemCouponSchema,
  saveRelationshipQuizSchema,
} from "@/schemas/gifts";
import { getCurrentUserId } from "@/lib/supabase/server";
import type {
  CouponBookData,
  GiftBoxData,
  LoveWrappedData,
  RelationshipQuizData,
  ScratchCardGiftData,
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
