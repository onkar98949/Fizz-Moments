import type { Metadata } from "next";
import { getOpenWhenCollectionById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { OpenWhenPlayer } from "@/features/gifts/open-when/open-when-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await getOpenWhenCollectionById(id);

  if (!collection) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: collection.title,
    description: "A collection of letters for whenever you need one.",
    path: `/gifts/open-when/${id}`,
    noindex: true,
  });
}

export default async function OpenWhenGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const collection = await getOpenWhenCollectionById(id);

  if (!collection) {
    return (
      <InvalidLink
        title="This collection couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <OpenWhenPlayer collection={collection} />;
}
