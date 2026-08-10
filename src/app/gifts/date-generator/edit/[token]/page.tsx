import type { Metadata } from "next";
import { getDateGeneratorByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { DateGeneratorEditor } from "@/features/gifts/date-generator/date-generator-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your date generator — FizzMoments",
};

export default async function DateGeneratorEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [generator, userId] = await Promise.all([getDateGeneratorByEditToken(token), getCurrentUserId()]);

  if (!generator) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a date generator for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !generator.userId) {
    await claimOwnershipIfUnowned("date-generator", generator.id, userId);
    generator.userId = userId;
  }

  return <DateGeneratorEditor generator={generator} isSignedIn={!!userId} />;
}
