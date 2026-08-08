import type { Metadata } from "next";
import { getTreasureHuntById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { TreasureHuntPlayer } from "@/features/gifts/treasure-hunt/treasure-hunt-player";

type HuntPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: HuntPageProps): Promise<Metadata> {
  const { id } = await params;
  const hunt = await getTreasureHuntById(id);
  return { title: hunt ? `${hunt.title} — FizzMoments` : "FizzMoments" };
}

export default async function TreasureHuntPage({ params }: HuntPageProps) {
  const { id } = await params;
  const hunt = await getTreasureHuntById(id);

  if (!hunt) {
    return (
      <InvalidLink
        title="This hunt couldn't be found"
        description="The link might be mistyped, or the hunt may no longer exist."
      />
    );
  }

  return <TreasureHuntPlayer hunt={hunt} />;
}
