import type { Metadata } from "next";
import { getLoveWrappedByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { LoveWrappedEditor } from "@/features/gifts/love-wrapped/love-wrapped-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your recap — FizzMoments",
};

export default async function LoveWrappedEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [wrapped, userId] = await Promise.all([getLoveWrappedByEditToken(token), getCurrentUserId()]);

  if (!wrapped) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a recap for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !wrapped.userId) {
    await claimOwnershipIfUnowned("love-wrapped", wrapped.id, userId);
    wrapped.userId = userId;
  }

  return <LoveWrappedEditor wrapped={wrapped} isSignedIn={!!userId} />;
}
