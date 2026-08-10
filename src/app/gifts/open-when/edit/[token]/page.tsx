import type { Metadata } from "next";
import { getOpenWhenCollectionByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { OpenWhenEditor } from "@/features/gifts/open-when/open-when-editor";
import { NOINDEX_ROBOTS } from "@/lib/seo";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your letters",
  robots: NOINDEX_ROBOTS,
};

export default async function OpenWhenEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [collection, userId] = await Promise.all([getOpenWhenCollectionByEditToken(token), getCurrentUserId()]);

  if (!collection) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a collection for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !collection.userId) {
    await claimOwnershipIfUnowned("open-when", collection.id, userId);
    collection.userId = userId;
  }

  return <OpenWhenEditor collection={collection} isSignedIn={!!userId} />;
}
