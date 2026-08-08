import "server-only";
import { prisma } from "@/database/client";
import {
  scratchCardsArraySchema,
  treasureHuntCluesArraySchema,
  wrappedStatsArraySchema,
  wrappedMomentsArraySchema,
  couponsArraySchema,
  quizQuestionsArraySchema,
  quizResultTiersArraySchema,
} from "@/schemas/gifts";
import type {
  Coupon,
  CouponBookData,
  GiftBoxData,
  LoveWrappedData,
  QuizQuestion,
  QuizResultTier,
  RelationshipQuizData,
  ScratchCard,
  ScratchCardGiftData,
  TreasureHuntClue,
  TreasureHuntData,
  WrappedMoment,
  WrappedStat,
} from "@/types/gifts";
import type { CouponBook, GiftBox, LoveWrapped, RelationshipQuiz, ScratchCardGift, TreasureHunt } from "@prisma/client";

function parseCards(raw: unknown): ScratchCard[] {
  return scratchCardsArraySchema.parse(raw) as ScratchCard[];
}

function toScratchCardGiftData(row: ScratchCardGift): ScratchCardGiftData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    cards: parseCards(row.cards),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankCards(): ScratchCard[] {
  return [
    { id: crypto.randomUUID(), title: "Card One", reward: "A love note just for you.", photoUrl: null },
    { id: crypto.randomUUID(), title: "Card Two", reward: "A surprise gift is coming.", photoUrl: null },
    { id: crypto.randomUUID(), title: "Card Three", reward: "Dinner, my treat, tonight.", photoUrl: null },
  ];
}

export async function createBlankScratchCardGift(userId: string | null = null): Promise<ScratchCardGiftData> {
  const row = await prisma.scratchCardGift.create({
    data: { title: "A Surprise For You", cards: blankCards(), userId },
  });
  return toScratchCardGiftData(row);
}

export async function getScratchCardGiftById(id: string): Promise<ScratchCardGiftData | null> {
  const row = await prisma.scratchCardGift.findUnique({ where: { id } });
  return row ? toScratchCardGiftData(row) : null;
}

export async function getScratchCardGiftByEditToken(editToken: string): Promise<ScratchCardGiftData | null> {
  const row = await prisma.scratchCardGift.findUnique({ where: { editToken } });
  return row ? toScratchCardGiftData(row) : null;
}

export async function updateScratchCardGift(
  editToken: string,
  data: { title: string; cards: ScratchCard[] },
): Promise<ScratchCardGiftData> {
  const row = await prisma.scratchCardGift.update({
    where: { editToken },
    data: { title: data.title, cards: data.cards },
  });
  return toScratchCardGiftData(row);
}

function parseClues(raw: unknown): TreasureHuntClue[] {
  return treasureHuntCluesArraySchema.parse(raw) as TreasureHuntClue[];
}

function toTreasureHuntData(row: TreasureHunt): TreasureHuntData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    clues: parseClues(row.clues),
    finalMessage: row.finalMessage,
    finalPhotoUrl: row.finalPhotoUrl,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankClues(): TreasureHuntClue[] {
  return [
    {
      id: crypto.randomUUID(),
      text: "Look where we always keep the coffee.",
      hint: "Think kitchen, not bedroom.",
      photoUrl: null,
      code: "coffee",
    },
  ];
}

export async function createBlankTreasureHunt(userId: string | null = null): Promise<TreasureHuntData> {
  const row = await prisma.treasureHunt.create({
    data: {
      title: "A Little Adventure For You",
      clues: blankClues(),
      finalMessage: "You found it. I love you.",
      finalPhotoUrl: null,
      userId,
    },
  });
  return toTreasureHuntData(row);
}

export async function getTreasureHuntById(id: string): Promise<TreasureHuntData | null> {
  const row = await prisma.treasureHunt.findUnique({ where: { id } });
  return row ? toTreasureHuntData(row) : null;
}

export async function getTreasureHuntByEditToken(editToken: string): Promise<TreasureHuntData | null> {
  const row = await prisma.treasureHunt.findUnique({ where: { editToken } });
  return row ? toTreasureHuntData(row) : null;
}

export async function updateTreasureHunt(
  editToken: string,
  data: { title: string; clues: TreasureHuntClue[]; finalMessage: string; finalPhotoUrl: string | null },
): Promise<TreasureHuntData> {
  const row = await prisma.treasureHunt.update({
    where: { editToken },
    data: {
      title: data.title,
      clues: data.clues,
      finalMessage: data.finalMessage,
      finalPhotoUrl: data.finalPhotoUrl,
    },
  });
  return toTreasureHuntData(row);
}

function toGiftBoxData(row: GiftBox): GiftBoxData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    message: row.message,
    photoUrl: row.photoUrl,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createBlankGiftBox(userId: string | null = null): Promise<GiftBoxData> {
  const row = await prisma.giftBox.create({
    data: {
      title: "A Little Something For You",
      message: "I made this just for you. I love you.",
      photoUrl: null,
      userId,
    },
  });
  return toGiftBoxData(row);
}

export async function getGiftBoxById(id: string): Promise<GiftBoxData | null> {
  const row = await prisma.giftBox.findUnique({ where: { id } });
  return row ? toGiftBoxData(row) : null;
}

export async function getGiftBoxByEditToken(editToken: string): Promise<GiftBoxData | null> {
  const row = await prisma.giftBox.findUnique({ where: { editToken } });
  return row ? toGiftBoxData(row) : null;
}

export async function updateGiftBox(
  editToken: string,
  data: { title: string; message: string; photoUrl: string | null },
): Promise<GiftBoxData> {
  const row = await prisma.giftBox.update({
    where: { editToken },
    data: { title: data.title, message: data.message, photoUrl: data.photoUrl },
  });
  return toGiftBoxData(row);
}

function toLoveWrappedData(row: LoveWrapped): LoveWrappedData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    startDate: row.startDate.toISOString(),
    stats: wrappedStatsArraySchema.parse(row.stats) as WrappedStat[],
    moments: wrappedMomentsArraySchema.parse(row.moments) as WrappedMoment[],
    closingMessage: row.closingMessage,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankWrappedStats(): WrappedStat[] {
  return [
    { id: crypto.randomUUID(), emoji: "📸", label: "memories", value: 214 },
    { id: crypto.randomUUID(), emoji: "✈️", label: "trips", value: 6 },
    { id: crypto.randomUUID(), emoji: "🍕", label: "pizza dates", value: 58 },
  ];
}

function blankWrappedMoments(): WrappedMoment[] {
  return [
    { id: crypto.randomUUID(), emoji: "📍", label: "Favorite place", text: "That little café we always go back to.", photoUrl: null },
    { id: crypto.randomUUID(), emoji: "😂", label: "Funniest memory", text: "The time we got hopelessly lost on our first trip.", photoUrl: null },
  ];
}

export async function createBlankLoveWrapped(userId: string | null = null): Promise<LoveWrappedData> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 400);

  const row = await prisma.loveWrapped.create({
    data: {
      title: "Our Year, Wrapped",
      startDate,
      stats: blankWrappedStats(),
      moments: blankWrappedMoments(),
      closingMessage: "Here's to many more memories.",
      userId,
    },
  });
  return toLoveWrappedData(row);
}

export async function getLoveWrappedById(id: string): Promise<LoveWrappedData | null> {
  const row = await prisma.loveWrapped.findUnique({ where: { id } });
  return row ? toLoveWrappedData(row) : null;
}

export async function getLoveWrappedByEditToken(editToken: string): Promise<LoveWrappedData | null> {
  const row = await prisma.loveWrapped.findUnique({ where: { editToken } });
  return row ? toLoveWrappedData(row) : null;
}

export async function updateLoveWrapped(
  editToken: string,
  data: { title: string; startDate: string; stats: WrappedStat[]; moments: WrappedMoment[]; closingMessage: string },
): Promise<LoveWrappedData> {
  const row = await prisma.loveWrapped.update({
    where: { editToken },
    data: {
      title: data.title,
      startDate: new Date(data.startDate),
      stats: data.stats,
      moments: data.moments,
      closingMessage: data.closingMessage,
    },
  });
  return toLoveWrappedData(row);
}

function toCouponBookData(row: CouponBook): CouponBookData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    coupons: couponsArraySchema.parse(row.coupons) as Coupon[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankCoupons(): Coupon[] {
  return [
    { id: crypto.randomUUID(), icon: "🤗", title: "Free Hug", description: "Redeemable anytime, no questions asked.", color: "coral", expiry: null, redeemed: false },
    { id: crypto.randomUUID(), icon: "🎬", title: "Movie Night", description: "Your pick, my treat.", color: "lavender", expiry: null, redeemed: false },
    { id: crypto.randomUUID(), icon: "🥞", title: "Breakfast in Bed", description: "Whenever you want it.", color: "yellow", expiry: null, redeemed: false },
  ];
}

export async function createBlankCouponBook(userId: string | null = null): Promise<CouponBookData> {
  const row = await prisma.couponBook.create({
    data: { title: "A Book Of Somedays", coupons: blankCoupons(), userId },
  });
  return toCouponBookData(row);
}

export async function getCouponBookById(id: string): Promise<CouponBookData | null> {
  const row = await prisma.couponBook.findUnique({ where: { id } });
  return row ? toCouponBookData(row) : null;
}

export async function getCouponBookByEditToken(editToken: string): Promise<CouponBookData | null> {
  const row = await prisma.couponBook.findUnique({ where: { editToken } });
  return row ? toCouponBookData(row) : null;
}

export async function updateCouponBook(
  editToken: string,
  data: { title: string; coupons: Coupon[] },
): Promise<CouponBookData> {
  const row = await prisma.couponBook.update({
    where: { editToken },
    data: { title: data.title, coupons: data.coupons },
  });
  return toCouponBookData(row);
}

/** Redeems one coupon by public id (no edit token needed — the recipient,
 *  not the creator, is the one redeeming) and returns the updated book, or
 *  null if the gift or that specific coupon doesn't exist. */
export async function redeemCoupon(id: string, couponId: string): Promise<CouponBookData | null> {
  const row = await prisma.couponBook.findUnique({ where: { id } });
  if (!row) return null;

  const coupons = couponsArraySchema.parse(row.coupons) as Coupon[];
  if (!coupons.some((c) => c.id === couponId)) return null;

  const nextCoupons = coupons.map((c) => (c.id === couponId ? { ...c, redeemed: true } : c));
  const updated = await prisma.couponBook.update({ where: { id }, data: { coupons: nextCoupons } });
  return toCouponBookData(updated);
}

function toRelationshipQuizData(row: RelationshipQuiz): RelationshipQuizData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    questions: quizQuestionsArraySchema.parse(row.questions) as QuizQuestion[],
    resultTiers: quizResultTiersArraySchema.parse(row.resultTiers) as QuizResultTier[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankQuizQuestions(): QuizQuestion[] {
  const makeOptions = (labels: string[]) => labels.map((label) => ({ id: crypto.randomUUID(), label, photoUrl: null }));

  const q1Options = makeOptions(["Cake 🍰", "Brownie 🍫", "Ice Cream 🍦"]);
  const q2Options = makeOptions(["True", "False"]);
  const q3Options = makeOptions(["Movies", "Board Games", "Just Talking", "Cooking Together"]);
  const q4Options = makeOptions(["Morning Person", "Night Owl"]);
  const q5Options = makeOptions(["The Beach", "The Mountains", "A City Trip"]);

  return [
    { id: crypto.randomUUID(), prompt: "What's my favorite dessert?", options: q1Options, correctOptionId: q1Options[0].id },
    { id: crypto.randomUUID(), prompt: "I always steal the blanket at night.", options: q2Options, correctOptionId: q2Options[0].id },
    { id: crypto.randomUUID(), prompt: "What's our go-to date night?", options: q3Options, correctOptionId: q3Options[2].id },
    { id: crypto.randomUUID(), prompt: "Am I a morning person or a night owl?", options: q4Options, correctOptionId: q4Options[1].id },
    { id: crypto.randomUUID(), prompt: "Where would I want to go on our next trip?", options: q5Options, correctOptionId: q5Options[0].id },
  ];
}

function blankQuizResultTiers(): QuizResultTier[] {
  return [
    { id: crypto.randomUUID(), minPercent: 0, title: "We need another date 😂", message: "There's still plenty to learn about each other — I love that." },
    { id: crypto.randomUUID(), minPercent: 50, title: "Pretty good!", message: "You really do pay attention. Not bad at all." },
    { id: crypto.randomUUID(), minPercent: 80, title: "You definitely know me ❤️", message: "Okay, I'm impressed. You really do know me." },
  ];
}

export async function createBlankRelationshipQuiz(userId: string | null = null): Promise<RelationshipQuizData> {
  const row = await prisma.relationshipQuiz.create({
    data: {
      title: "How Well Do You Know Me?",
      questions: blankQuizQuestions(),
      resultTiers: blankQuizResultTiers(),
      userId,
    },
  });
  return toRelationshipQuizData(row);
}

export async function getRelationshipQuizById(id: string): Promise<RelationshipQuizData | null> {
  const row = await prisma.relationshipQuiz.findUnique({ where: { id } });
  return row ? toRelationshipQuizData(row) : null;
}

export async function getRelationshipQuizByEditToken(editToken: string): Promise<RelationshipQuizData | null> {
  const row = await prisma.relationshipQuiz.findUnique({ where: { editToken } });
  return row ? toRelationshipQuizData(row) : null;
}

export async function updateRelationshipQuiz(
  editToken: string,
  data: { title: string; questions: QuizQuestion[]; resultTiers: QuizResultTier[] },
): Promise<RelationshipQuizData> {
  const row = await prisma.relationshipQuiz.update({
    where: { editToken },
    data: { title: data.title, questions: data.questions, resultTiers: data.resultTiers },
  });
  return toRelationshipQuizData(row);
}
