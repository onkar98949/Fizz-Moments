import type { Metadata } from "next";
import { getGiftBoxByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { GiftBoxEditor } from "@/features/gifts/gift-box/gift-box-editor";
import { NOINDEX_ROBOTS } from "@/lib/seo";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your gift box",
  robots: NOINDEX_ROBOTS,
};

export default async function GiftBoxEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [box, userId] = await Promise.all([getGiftBoxByEditToken(token), getCurrentUserId()]);

  if (!box) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a gift for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !box.userId) {
    await claimOwnershipIfUnowned("gift-box", box.id, userId);
    box.userId = userId;
  }

  return <GiftBoxEditor box={box} isSignedIn={!!userId} />;
}
