import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GiftLibrary } from "@/features/gifts/gift-library";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Interactive Digital Gifts",
  description:
    "Personalized digital gifts for anyone you care about — scratch cards, treasure hunts, memory quizzes, secret letters, and more. Not just for partners. Make one and share it with a link in minutes.",
  path: "/gifts",
});

export default function GiftsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <GiftLibrary />
        <section className="mx-auto w-full max-w-5xl px-5 pb-16 sm:pb-20">
          <p className="text-muted-foreground text-caption">
            Shopping for someone specific?{" "}
            <Link href="/gifts-for-friends" className="text-primary-active font-medium underline underline-offset-2">
              Gifts for best friends
            </Link>
            ,{" "}
            <Link href="/digital-birthday-gifts" className="text-primary-active font-medium underline underline-offset-2">
              digital birthday gifts
            </Link>
            , or{" "}
            <Link href="/long-distance-gifts" className="text-primary-active font-medium underline underline-offset-2">
              gifts for long distance
            </Link>
            .
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
