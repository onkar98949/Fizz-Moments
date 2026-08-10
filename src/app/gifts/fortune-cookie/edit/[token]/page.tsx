import type { Metadata } from "next";
import { getFortuneCookieByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { FortuneCookieEditor } from "@/features/gifts/fortune-cookie/fortune-cookie-editor";
import { NOINDEX_ROBOTS } from "@/lib/seo";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your fortune cookie",
  robots: NOINDEX_ROBOTS,
};

export default async function FortuneCookieEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [cookie, userId] = await Promise.all([getFortuneCookieByEditToken(token), getCurrentUserId()]);

  if (!cookie) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a fortune cookie for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !cookie.userId) {
    await claimOwnershipIfUnowned("fortune-cookie", cookie.id, userId);
    cookie.userId = userId;
  }

  return <FortuneCookieEditor cookie={cookie} isSignedIn={!!userId} />;
}
