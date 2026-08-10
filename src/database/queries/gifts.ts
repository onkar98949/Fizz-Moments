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
  fortunesArraySchema,
  memoryQuizQuestionsArraySchema,
  memoryQuizResultTiersArraySchema,
  openWhenLettersArraySchema,
  dateIdeasArraySchema,
  loveReasonsArraySchema,
} from "@/schemas/gifts";
import type {
  Coupon,
  CouponBookData,
  DateGeneratorData,
  DateIdea,
  Fortune,
  FortuneCookieData,
  GiftBoxData,
  HundredReasonsData,
  LoveReason,
  LoveWrappedData,
  MemoryQuizData,
  MemoryQuizQuestion,
  MemoryQuizResultTier,
  OpenWhenCollectionData,
  OpenWhenLetter,
  QuizQuestion,
  QuizResultTier,
  RelationshipQuizData,
  ScratchCard,
  ScratchCardGiftData,
  SecretEnvelopeData,
  TreasureHuntClue,
  TreasureHuntData,
  WrappedMoment,
  WrappedStat,
} from "@/types/gifts";
import type {
  CouponBook,
  DateGenerator,
  FortuneCookie,
  GiftBox,
  HundredReasons,
  LoveWrapped,
  MemoryQuiz,
  OpenWhenCollection,
  RelationshipQuiz,
  ScratchCardGift,
  SecretEnvelope,
  TreasureHunt,
} from "@prisma/client";

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

// ---------------------------------------------------------------------------
// Second wave
// ---------------------------------------------------------------------------

function toSecretEnvelopeData(row: SecretEnvelope): SecretEnvelopeData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    style: row.style as SecretEnvelopeData["style"],
    recipientName: row.recipientName,
    letterTitle: row.letterTitle,
    message: row.message,
    senderName: row.senderName,
    photoUrl: row.photoUrl,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createBlankSecretEnvelope(userId: string | null = null): Promise<SecretEnvelopeData> {
  const row = await prisma.secretEnvelope.create({
    data: {
      title: "A Letter For You",
      style: "classic",
      recipientName: "",
      letterTitle: "A Letter For You",
      message: "Every moment with you feels like a page from my favorite story.",
      senderName: "",
      userId,
    },
  });
  return toSecretEnvelopeData(row);
}

export async function getSecretEnvelopeById(id: string): Promise<SecretEnvelopeData | null> {
  const row = await prisma.secretEnvelope.findUnique({ where: { id } });
  return row ? toSecretEnvelopeData(row) : null;
}

export async function getSecretEnvelopeByEditToken(editToken: string): Promise<SecretEnvelopeData | null> {
  const row = await prisma.secretEnvelope.findUnique({ where: { editToken } });
  return row ? toSecretEnvelopeData(row) : null;
}

export async function updateSecretEnvelope(
  editToken: string,
  data: {
    title: string;
    style: SecretEnvelopeData["style"];
    recipientName: string;
    letterTitle: string;
    message: string;
    senderName: string;
    photoUrl: string | null;
  },
): Promise<SecretEnvelopeData> {
  const row = await prisma.secretEnvelope.update({ where: { editToken }, data });
  return toSecretEnvelopeData(row);
}

function toFortuneCookieData(row: FortuneCookie): FortuneCookieData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    recipientName: row.recipientName,
    fortunes: fortunesArraySchema.parse(row.fortunes) as Fortune[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankFortunes(): Fortune[] {
  return [{ id: crypto.randomUUID(), text: "You're going to fall in love with this person all over again this weekend." }];
}

export async function createBlankFortuneCookie(userId: string | null = null): Promise<FortuneCookieData> {
  const row = await prisma.fortuneCookie.create({
    data: { title: "Your Fortune", recipientName: "", fortunes: blankFortunes(), userId },
  });
  return toFortuneCookieData(row);
}

export async function getFortuneCookieById(id: string): Promise<FortuneCookieData | null> {
  const row = await prisma.fortuneCookie.findUnique({ where: { id } });
  return row ? toFortuneCookieData(row) : null;
}

export async function getFortuneCookieByEditToken(editToken: string): Promise<FortuneCookieData | null> {
  const row = await prisma.fortuneCookie.findUnique({ where: { editToken } });
  return row ? toFortuneCookieData(row) : null;
}

export async function updateFortuneCookie(
  editToken: string,
  data: { title: string; recipientName: string; fortunes: Fortune[] },
): Promise<FortuneCookieData> {
  const row = await prisma.fortuneCookie.update({ where: { editToken }, data });
  return toFortuneCookieData(row);
}

function toMemoryQuizData(row: MemoryQuiz): MemoryQuizData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    questions: memoryQuizQuestionsArraySchema.parse(row.questions) as MemoryQuizQuestion[],
    resultTiers: memoryQuizResultTiersArraySchema.parse(row.resultTiers) as MemoryQuizResultTier[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankMemoryQuizQuestions(): MemoryQuizQuestion[] {
  function opts(labels: string[]) {
    return labels.map((label) => ({ id: crypto.randomUUID(), label }));
  }
  const q1Options = opts(["Cafe", "Park", "Cinema", "Restaurant"]);
  const q2Options = opts(["A rom-com", "An action movie", "A horror movie", "A documentary"]);
  const q3Options = opts(["Me", "You"]);
  return [
    {
      id: crypto.randomUUID(),
      prompt: "Where did we have our first date?",
      options: q1Options,
      correctOptionId: q1Options[1].id,
      correctReaction: "Okayyy you actually remember 😭❤️",
      wrongReaction: "HOW do you not remember this?! 😂",
    },
    {
      id: crypto.randomUUID(),
      prompt: "What was the first movie we watched together?",
      options: q2Options,
      correctOptionId: q2Options[0].id,
      correctReaction: "Okayyy you actually remember 😭❤️",
      wrongReaction: "HOW do you not remember this?! 😂",
    },
    {
      id: crypto.randomUUID(),
      prompt: "Who said \"I love you\" first?",
      options: q3Options,
      correctOptionId: q3Options[0].id,
      correctReaction: "Okayyy you actually remember 😭❤️",
      wrongReaction: "HOW do you not remember this?! 😂",
    },
  ];
}

function blankMemoryQuizResultTiers(): MemoryQuizResultTier[] {
  return [
    { id: crypto.randomUUID(), minPercent: 0, title: "We need more memories", message: "Okay... we need to make more memories 😂" },
    { id: crypto.randomUUID(), minPercent: 70, title: "You know us so well", message: "You officially know us better than I expected." },
  ];
}

export async function createBlankMemoryQuiz(userId: string | null = null): Promise<MemoryQuizData> {
  const row = await prisma.memoryQuiz.create({
    data: {
      title: "How Well Do You Remember Us?",
      questions: blankMemoryQuizQuestions(),
      resultTiers: blankMemoryQuizResultTiers(),
      userId,
    },
  });
  return toMemoryQuizData(row);
}

export async function getMemoryQuizById(id: string): Promise<MemoryQuizData | null> {
  const row = await prisma.memoryQuiz.findUnique({ where: { id } });
  return row ? toMemoryQuizData(row) : null;
}

export async function getMemoryQuizByEditToken(editToken: string): Promise<MemoryQuizData | null> {
  const row = await prisma.memoryQuiz.findUnique({ where: { editToken } });
  return row ? toMemoryQuizData(row) : null;
}

export async function updateMemoryQuiz(
  editToken: string,
  data: { title: string; questions: MemoryQuizQuestion[]; resultTiers: MemoryQuizResultTier[] },
): Promise<MemoryQuizData> {
  const row = await prisma.memoryQuiz.update({
    where: { editToken },
    data: { title: data.title, questions: data.questions, resultTiers: data.resultTiers },
  });
  return toMemoryQuizData(row);
}

function toOpenWhenCollectionData(row: OpenWhenCollection): OpenWhenCollectionData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    letters: openWhenLettersArraySchema.parse(row.letters) as OpenWhenLetter[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankOpenWhenLetters(): OpenWhenLetter[] {
  return [
    { id: crypto.randomUUID(), label: "you miss me", emoji: "💌", message: "I know I'm not there right now, but I'm always just a call away.", photoUrl: null, opened: false },
    { id: crypto.randomUUID(), label: "you're having a bad day", emoji: "🌧️", message: "Bad days don't last. And I'm always in your corner.", photoUrl: null, opened: false },
    { id: crypto.randomUUID(), label: "you need a hug", emoji: "🥺", message: "Consider this your hug from me, wherever you are.", photoUrl: null, opened: false },
  ];
}

export async function createBlankOpenWhenCollection(userId: string | null = null): Promise<OpenWhenCollectionData> {
  const row = await prisma.openWhenCollection.create({
    data: { title: "Letters From Me", letters: blankOpenWhenLetters(), userId },
  });
  return toOpenWhenCollectionData(row);
}

export async function getOpenWhenCollectionById(id: string): Promise<OpenWhenCollectionData | null> {
  const row = await prisma.openWhenCollection.findUnique({ where: { id } });
  return row ? toOpenWhenCollectionData(row) : null;
}

export async function getOpenWhenCollectionByEditToken(editToken: string): Promise<OpenWhenCollectionData | null> {
  const row = await prisma.openWhenCollection.findUnique({ where: { editToken } });
  return row ? toOpenWhenCollectionData(row) : null;
}

export async function updateOpenWhenCollection(
  editToken: string,
  data: { title: string; letters: OpenWhenLetter[] },
): Promise<OpenWhenCollectionData> {
  const row = await prisma.openWhenCollection.update({ where: { editToken }, data });
  return toOpenWhenCollectionData(row);
}

/** Public mutation (no edit token) — the recipient opens a letter and that
 *  state persists, same pattern as CouponBook's redeem. */
export async function openLetter(id: string, letterId: string): Promise<OpenWhenCollectionData | null> {
  const row = await prisma.openWhenCollection.findUnique({ where: { id } });
  if (!row) return null;

  const letters = openWhenLettersArraySchema.parse(row.letters) as OpenWhenLetter[];
  if (!letters.some((l) => l.id === letterId)) return null;

  const nextLetters = letters.map((l) => (l.id === letterId ? { ...l, opened: true } : l));
  const updated = await prisma.openWhenCollection.update({ where: { id }, data: { letters: nextLetters } });
  return toOpenWhenCollectionData(updated);
}

function toDateGeneratorData(row: DateGenerator): DateGeneratorData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    ideas: dateIdeasArraySchema.parse(row.ideas) as DateIdea[],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankDateIdeas(): DateIdea[] {
  return [
    { id: crypto.randomUUID(), text: "Make breakfast together.", budget: "Free", difficulty: "Easy", timeEstimate: "~30 min" },
    { id: crypto.randomUUID(), text: "Go for a midnight drive.", budget: "Free", difficulty: "Easy", timeEstimate: "~1 hour" },
    { id: crypto.randomUUID(), text: "Recreate your first date.", budget: "$$", difficulty: "Medium", timeEstimate: "~2 hours" },
  ];
}

export async function createBlankDateGenerator(userId: string | null = null): Promise<DateGeneratorData> {
  const row = await prisma.dateGenerator.create({
    data: { title: "What Should We Do Tonight?", ideas: blankDateIdeas(), userId },
  });
  return toDateGeneratorData(row);
}

export async function getDateGeneratorById(id: string): Promise<DateGeneratorData | null> {
  const row = await prisma.dateGenerator.findUnique({ where: { id } });
  return row ? toDateGeneratorData(row) : null;
}

export async function getDateGeneratorByEditToken(editToken: string): Promise<DateGeneratorData | null> {
  const row = await prisma.dateGenerator.findUnique({ where: { editToken } });
  return row ? toDateGeneratorData(row) : null;
}

export async function updateDateGenerator(
  editToken: string,
  data: { title: string; ideas: DateIdea[] },
): Promise<DateGeneratorData> {
  const row = await prisma.dateGenerator.update({ where: { editToken }, data });
  return toDateGeneratorData(row);
}

function toHundredReasonsData(row: HundredReasons): HundredReasonsData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    reasons: loveReasonsArraySchema.parse(row.reasons) as LoveReason[],
    finalMessage: row.finalMessage,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function blankLoveReasons(): LoveReason[] {
  const texts = [
    "Your laugh.",
    "The way you get excited about little things.",
    "You always know when something is wrong.",
    "Your terrible jokes.",
    "The way you hold my hand.",
    "You make ordinary days feel special.",
    "Your terrible puns.",
    "How you remember the little things.",
    "The way you say my name.",
    "You still choose me every day.",
  ];
  return texts.map((text) => ({ id: crypto.randomUUID(), text, photoUrl: null }));
}

export async function createBlankHundredReasons(userId: string | null = null): Promise<HundredReasonsData> {
  const row = await prisma.hundredReasons.create({
    data: {
      title: "100 Reasons I Love You",
      reasons: blankLoveReasons(),
      finalMessage: "But if I had to choose one reason... You.",
      userId,
    },
  });
  return toHundredReasonsData(row);
}

export async function getHundredReasonsById(id: string): Promise<HundredReasonsData | null> {
  const row = await prisma.hundredReasons.findUnique({ where: { id } });
  return row ? toHundredReasonsData(row) : null;
}

export async function getHundredReasonsByEditToken(editToken: string): Promise<HundredReasonsData | null> {
  const row = await prisma.hundredReasons.findUnique({ where: { editToken } });
  return row ? toHundredReasonsData(row) : null;
}

export async function updateHundredReasons(
  editToken: string,
  data: { title: string; reasons: LoveReason[]; finalMessage: string | null },
): Promise<HundredReasonsData> {
  const row = await prisma.hundredReasons.update({ where: { editToken }, data });
  return toHundredReasonsData(row);
}
