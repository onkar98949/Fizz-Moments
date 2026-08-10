import type { Metadata } from "next";
import { getFortuneCookieById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { FortuneCookiePlayer } from "@/features/gifts/fortune-cookie/fortune-cookie-player";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const cookie = await getFortuneCookieById(id);
  return { title: cookie ? `${cookie.title} — FizzMoments` : "FizzMoments" };
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
