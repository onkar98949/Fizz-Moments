import type { Metadata } from "next";
import { getHundredReasonsById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { HundredReasonsPlayer } from "@/features/gifts/hundred-reasons/hundred-reasons-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const gift = await getHundredReasonsById(id);

  if (!gift) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: gift.title,
    description: "100 reasons, revealed one at a time.",
    path: `/gifts/100-reasons/${id}`,
    noindex: true,
  });
}

export default async function HundredReasonsGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const gift = await getHundredReasonsById(id);

  if (!gift) {
    return (
      <InvalidLink
        title="This gift couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <HundredReasonsPlayer gift={gift} />;
}
