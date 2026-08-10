import type { Metadata } from "next";
import { getDateGeneratorById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { DateGeneratorPlayer } from "@/features/gifts/date-generator/date-generator-player";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const generator = await getDateGeneratorById(id);
  return { title: generator ? `${generator.title} — FizzMoments` : "FizzMoments" };
}

export default async function DateGeneratorGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const generator = await getDateGeneratorById(id);

  if (!generator) {
    return (
      <InvalidLink
        title="This date generator couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <DateGeneratorPlayer generator={generator} />;
}
