import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { FaqSection } from "@/components/shared/faq-section";
import { RelatedGiftTypes } from "@/components/shared/related-gift-types";
import { Button } from "@/components/ui/button";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Digital Gifts for Your Best Friend",
  description:
    "Digital gifts built for friendship, not just romance — memory quizzes about your inside jokes, 100 reasons you're glad they exist, and more. Free to start, ready in minutes.",
  path: "/gifts-for-friends",
});

const FAQ_ITEMS = [
  {
    question: "Is FizzMoments only for couples?",
    answer:
      "No — most of what people build on FizzMoments isn't romantic at all. The gift types work exactly the same whether it's for a partner, a best friend, a sibling, or a college roommate you haven't seen in years.",
  },
  {
    question: "Does my friend need to download an app or make an account?",
    answer:
      "No. You send them a link, they open it in their phone's browser, and that's it — no app, no sign-up, no waiting.",
  },
  {
    question: "Is it free?",
    answer: "Yes, creating and sharing a gift is free. You don't need an account to make or send one.",
  },
  {
    question: "What if we're long-distance?",
    answer:
      "That's actually one of the best uses for it — a link arrives instantly no matter where they are. See our long-distance gifts page for ideas built specifically for that.",
  },
];

export default function GiftsForFriendsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gifts", href: "/gifts" }, { label: "For Friends", href: "/gifts-for-friends" }]} />
      <main className="flex-1">
        <section className="px-6 pt-10 pb-16 sm:px-10 sm:pt-14 sm:pb-20">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-5">
            <span className="text-primary-active text-eyebrow font-semibold uppercase">For your best friend</span>
            <h1 className="font-heading text-hero text-balance font-semibold">
              Digital gifts for your best friend
            </h1>
            <p className="text-muted-foreground text-body-lg max-w-xl text-balance">
              A birthday text gets forgotten by lunch. A FizzMoment shows you actually remember the
              inside jokes, the chaos, the years of it. Add your own photos and memories — it&apos;s
              ready to send in a few minutes.
            </p>
            <Button
              size="lg"
              className="gap-2"
              nativeButton={false}
              render={
                <Link href="/gifts">
                  Make a Moment
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
          </div>
        </section>

        <RelatedGiftTypes
          heading="Built for friendship, not just romance"
          ids={["memory-quiz", "100-reasons", "fortune-cookie", "coupon-book", "open-when", "treasure-hunt"]}
        />

        <section className="px-6 py-16 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <h2 className="font-heading text-section text-balance font-semibold">A few ways people actually use it</h2>
            <ul className="text-muted-foreground text-body-lg flex flex-col gap-3 leading-relaxed">
              <li>
                <strong className="text-foreground">A Memory Quiz</strong> testing how well they actually
                remember your friendship — with your own reaction to every answer.
              </li>
              <li>
                <strong className="text-foreground">100 Reasons</strong> they&apos;re one of your favorite
                people, revealed one at a time instead of dumped all at once.
              </li>
              <li>
                <strong className="text-foreground">An Open When Collection</strong> — sealed letters
                labeled &quot;open when you&apos;re having a bad day&quot; or &quot;open when you miss
                home,&quot; for whenever they actually need one.
              </li>
            </ul>
          </div>
        </section>

        <FaqSection items={FAQ_ITEMS} />

        <section className="border-border border-t px-6 py-16 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <p className="text-muted-foreground text-body-lg">Looking for something more specific?</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/long-distance-gifts" className="text-primary-active font-medium underline underline-offset-2">
                Gifts for long-distance friends
              </Link>
              <Link href="/digital-birthday-gifts" className="text-primary-active font-medium underline underline-offset-2">
                Digital birthday gifts
              </Link>
              <Link href="/gifts" className="text-primary-active font-medium underline underline-offset-2">
                Browse every gift type
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
