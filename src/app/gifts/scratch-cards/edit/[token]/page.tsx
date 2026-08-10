import type { Metadata } from "next";
import { getScratchCardGiftByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { ScratchCardEditor } from "@/features/gifts/scratch-cards/scratch-card-editor";
import { NOINDEX_ROBOTS } from "@/lib/seo";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your gift",
  robots: NOINDEX_ROBOTS,
};

export default async function ScratchCardEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [gift, userId] = await Promise.all([getScratchCardGiftByEditToken(token), getCurrentUserId()]);

  if (!gift) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a gift for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !gift.userId) {
    await claimOwnershipIfUnowned("scratch-cards", gift.id, userId);
    gift.userId = userId;
  }

  return <ScratchCardEditor gift={gift} isSignedIn={!!userId} />;
}
