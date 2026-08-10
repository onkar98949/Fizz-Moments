import type { Metadata } from "next";
import { getOpenWhenCollectionById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { OpenWhenPlayer } from "@/features/gifts/open-when/open-when-player";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const collection = await getOpenWhenCollectionById(id);
  return { title: collection ? `${collection.title} — FizzMoments` : "FizzMoments" };
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
