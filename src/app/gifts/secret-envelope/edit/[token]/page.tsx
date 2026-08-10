import type { Metadata } from "next";
import { getSecretEnvelopeByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { SecretEnvelopeEditor } from "@/features/gifts/secret-envelope/secret-envelope-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your letter — FizzMoments",
};

export default async function SecretEnvelopeEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [envelope, userId] = await Promise.all([getSecretEnvelopeByEditToken(token), getCurrentUserId()]);

  if (!envelope) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a letter for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !envelope.userId) {
    await claimOwnershipIfUnowned("secret-envelope", envelope.id, userId);
    envelope.userId = userId;
  }

  return <SecretEnvelopeEditor envelope={envelope} isSignedIn={!!userId} />;
}
