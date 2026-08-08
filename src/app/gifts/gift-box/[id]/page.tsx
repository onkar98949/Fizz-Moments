import type { Metadata } from "next";
import { getGiftBoxById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { GiftBoxPlayer } from "@/features/gifts/gift-box/gift-box-player";

type BoxPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: BoxPageProps): Promise<Metadata> {
  const { id } = await params;
  const box = await getGiftBoxById(id);
  return { title: box ? `${box.title} — FizzMoments` : "FizzMoments" };
}

export default async function GiftBoxPage({ params }: BoxPageProps) {
  const { id } = await params;
  const box = await getGiftBoxById(id);

  if (!box) {
    return (
      <InvalidLink
        title="This gift couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <GiftBoxPlayer box={box} />;
}
