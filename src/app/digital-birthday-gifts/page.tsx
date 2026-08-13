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
  title: "Digital Birthday Gifts They'll Actually Remember",
  description:
    "Digital birthday gifts that go beyond a text — scratch cards, a treasure hunt, a year-in-review recap. Free to create, ready in minutes, for anyone's birthday.",
  path: "/digital-birthday-gifts",
});

const FAQ_ITEMS = [
  {
    question: "Can I send it right at midnight?",
    answer:
      "Yes — you control exactly when you send the link, so you can time it for the first minute of their birthday if you want to.",
  },
  {
    question: "Is it free?",
    answer: "Yes, creating and sending a digital birthday gift on FizzMoments is free, with no account required.",
  },
  {
    question: "I forgot their birthday — can I still make something in time?",
    answer:
      "Most gift types take a few minutes to put together, so it's realistic to build and send something the same day.",
  },
  {
    question: "Is this only for partners?",
    answer:
      "No — these work for anyone's birthday: a best friend, a sibling, a parent, a coworker. Nothing about it assumes a romantic relationship.",
  },
];

export default function DigitalBirthdayGiftsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gifts", href: "/gifts" }, { label: "Birthday", href: "/digital-birthday-gifts" }]} />
      <main className="flex-1">
        <section className="px-6 pt-10 pb-16 sm:px-10 sm:pt-14 sm:pb-20">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-5">
            <span className="text-primary-active text-eyebrow font-semibold uppercase">For birthdays</span>
            <h1 className="font-heading text-hero text-balance font-semibold">
              Digital birthday gifts they&apos;ll actually remember
            </h1>
            <p className="text-muted-foreground text-body-lg max-w-xl text-balance">
              Not another &quot;Happy birthday!! 🎉&quot; text. Add your own photos and memories, pick
              something interactive, and send a gift that actually feels like it came from you.
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
          heading="Built for the day itself"
          ids={["gift-box", "scratch-cards", "treasure-hunt", "love-wrapped", "100-reasons"]}
        />

        <section className="px-6 py-16 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <h2 className="font-heading text-section text-balance font-semibold">A few ideas to start from</h2>
            <ul className="text-muted-foreground text-body-lg flex flex-col gap-3 leading-relaxed">
              <li>
                <strong className="text-foreground">A Gift Box</strong> they tap open to reveal one
                message and photo — simple, but it still gets a real reaction.
              </li>
              <li>
                <strong className="text-foreground">A Treasure Hunt</strong> of clues leading to a final
                birthday message, for when a straight-up message feels too plain.
              </li>
              <li>
                <strong className="text-foreground">A Love Wrapped recap</strong> — a Spotify-Wrapped-style
                look back at your year together, stats and all.
              </li>
            </ul>
          </div>
        </section>

        <FaqSection items={FAQ_ITEMS} />

        <section className="border-border border-t px-6 py-16 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <p className="text-muted-foreground text-body-lg">Looking for something more specific?</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/gifts-for-friends" className="text-primary-active font-medium underline underline-offset-2">
                Gifts for best friends
              </Link>
              <Link href="/long-distance-gifts" className="text-primary-active font-medium underline underline-offset-2">
                Gifts for long-distance friends
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
