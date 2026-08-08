import type { Metadata } from "next";
import { getTreasureHuntByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { TreasureHuntEditor } from "@/features/gifts/treasure-hunt/treasure-hunt-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your treasure hunt — FizzMoments",
};

export default async function TreasureHuntEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [hunt, userId] = await Promise.all([getTreasureHuntByEditToken(token), getCurrentUserId()]);

  if (!hunt) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a hunt for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !hunt.userId) {
    await claimOwnershipIfUnowned("treasure-hunt", hunt.id, userId);
    hunt.userId = userId;
  }

  return <TreasureHuntEditor hunt={hunt} isSignedIn={!!userId} />;
}
