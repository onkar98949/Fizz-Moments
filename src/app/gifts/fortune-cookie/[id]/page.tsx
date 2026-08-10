import type { Metadata } from "next";
import { getFortuneCookieById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { FortuneCookiePlayer } from "@/features/gifts/fortune-cookie/fortune-cookie-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const cookie = await getFortuneCookieById(id);

  if (!cookie) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: cookie.title,
    description: "A fortune, cracked open just for you.",
    path: `/gifts/fortune-cookie/${id}`,
    noindex: true,
  });
}

export default async function FortuneCookieGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const cookie = await getFortuneCookieById(id);

  if (!cookie) {
    return (
      <InvalidLink
        title="This fortune cookie couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <FortuneCookiePlayer cookie={cookie} />;
}
