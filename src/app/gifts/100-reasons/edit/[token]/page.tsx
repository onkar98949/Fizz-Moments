import type { Metadata } from "next";
import { getHundredReasonsByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { HundredReasonsEditor } from "@/features/gifts/hundred-reasons/hundred-reasons-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your 100 reasons — FizzMoments",
};

export default async function HundredReasonsEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [gift, userId] = await Promise.all([getHundredReasonsByEditToken(token), getCurrentUserId()]);

  if (!gift) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a gift for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !gift.userId) {
    await claimOwnershipIfUnowned("100-reasons", gift.id, userId);
    gift.userId = userId;
  }

  return <HundredReasonsEditor gift={gift} isSignedIn={!!userId} />;
}
