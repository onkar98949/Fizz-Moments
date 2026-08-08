import "server-only";
import { prisma } from "@/database/client";
import type { DashboardItem, DashboardKind } from "@/types/dashboard";

const KIND_META: Record<DashboardKind, { label: string; emoji: string; editBase: string; viewBase: string }> = {
  story: { label: "Story", emoji: "✨", editBase: "/edit", viewBase: "/story" },
  template: { label: "Template", emoji: "🎨", editBase: "/templates/edit", viewBase: "/templates/story" },
  "scratch-cards": {
    label: "Scratch Cards",
    emoji: "🎟️",
    editBase: "/gifts/scratch-cards/edit",
    viewBase: "/gifts/scratch-cards",
  },
  "treasure-hunt": {
    label: "Treasure Hunt",
    emoji: "🗺️",
    editBase: "/gifts/treasure-hunt/edit",
    viewBase: "/gifts/treasure-hunt",
  },
  "gift-box": { label: "Gift Box", emoji: "🎁", editBase: "/gifts/gift-box/edit", viewBase: "/gifts/gift-box" },
  "love-wrapped": {
    label: "Love Wrapped",
    emoji: "🎵",
    editBase: "/gifts/love-wrapped/edit",
    viewBase: "/gifts/love-wrapped",
  },
  "coupon-book": {
    label: "Coupon Book",
    emoji: "🎫",
    editBase: "/gifts/coupon-book/edit",
    viewBase: "/gifts/coupon-book",
  },
  "how-well": {
    label: "Quiz",
    emoji: "❓",
    editBase: "/gifts/how-well-do-you-know-me/edit",
    viewBase: "/gifts/how-well-do-you-know-me",
  },
};

type OwnableRow = { id: string; editToken: string; title: string; updatedAt: Date };

function toDashboardItem(kind: DashboardKind, row: OwnableRow): DashboardItem {
  const meta = KIND_META[kind];
  return {
    kind,
    id: row.id,
    editToken: row.editToken,
    title: row.title,
    emoji: meta.emoji,
    label: meta.label,
    editHref: `${meta.editBase}/${row.editToken}`,
    viewHref: `${meta.viewBase}/${row.id}`,
    updatedAt: row.updatedAt.toISOString(),
  };
}

/** Attaches a signed-in user to a piece of content they created as a guest,
 *  the moment they land on its edit page — but only if nobody owns it yet,
 *  so signing in on a link someone else made (and shared with you) can't
 *  hijack it into your account. */
export async function claimOwnershipIfUnowned(kind: DashboardKind, id: string, userId: string): Promise<void> {
  const where = { id, userId: null };
  const data = { userId };
  switch (kind) {
    case "story":
      await prisma.story.updateMany({ where, data });
      return;
    case "template":
      await prisma.templateProject.updateMany({ where, data });
      return;
    case "scratch-cards":
      await prisma.scratchCardGift.updateMany({ where, data });
      return;
    case "treasure-hunt":
      await prisma.treasureHunt.updateMany({ where, data });
      return;
    case "gift-box":
      await prisma.giftBox.updateMany({ where, data });
      return;
    case "love-wrapped":
      await prisma.loveWrapped.updateMany({ where, data });
      return;
    case "coupon-book":
      await prisma.couponBook.updateMany({ where, data });
      return;
    case "how-well":
      await prisma.relationshipQuiz.updateMany({ where, data });
      return;
  }
}

/** Everything a signed-in user has created, across all 8 content types,
 *  merged into one list sorted by most recently updated. */
export async function getUserCreations(userId: string): Promise<DashboardItem[]> {
  const select = { id: true, editToken: true, title: true, updatedAt: true } as const;
  const where = { userId };

  const [stories, templates, scratchCards, treasureHunts, giftBoxes, loveWrapped, couponBooks, quizzes] =
    await Promise.all([
      prisma.story.findMany({ where, select }),
      prisma.templateProject.findMany({ where, select }),
      prisma.scratchCardGift.findMany({ where, select }),
      prisma.treasureHunt.findMany({ where, select }),
      prisma.giftBox.findMany({ where, select }),
      prisma.loveWrapped.findMany({ where, select }),
      prisma.couponBook.findMany({ where, select }),
      prisma.relationshipQuiz.findMany({ where, select }),
    ]);

  const items: DashboardItem[] = [
    ...stories.map((r) => toDashboardItem("story", r)),
    ...templates.map((r) => toDashboardItem("template", r)),
    ...scratchCards.map((r) => toDashboardItem("scratch-cards", r)),
    ...treasureHunts.map((r) => toDashboardItem("treasure-hunt", r)),
    ...giftBoxes.map((r) => toDashboardItem("gift-box", r)),
    ...loveWrapped.map((r) => toDashboardItem("love-wrapped", r)),
    ...couponBooks.map((r) => toDashboardItem("coupon-book", r)),
    ...quizzes.map((r) => toDashboardItem("how-well", r)),
  ];

  return items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
