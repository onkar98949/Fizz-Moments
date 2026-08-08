import type { Metadata } from "next";
import { getScratchCardGiftById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { ScratchCardPlayer } from "@/features/gifts/scratch-cards/scratch-card-player";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const gift = await getScratchCardGiftById(id);
  return { title: gift ? `${gift.title} — FizzMoments` : "FizzMoments" };
}

export default async function ScratchCardGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const gift = await getScratchCardGiftById(id);

  if (!gift) {
    return (
      <InvalidLink
        title="This gift couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <ScratchCardPlayer gift={gift} />;
}
