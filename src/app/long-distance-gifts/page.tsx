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
  title: "Digital Gifts for Long-Distance Friends & Partners",
  description:
    "A digital gift built for long distance — no shipping, no time zones to worry about, just a link that arrives instantly. For partners, best friends, and family living far away.",
  path: "/long-distance-gifts",
});

const FAQ_ITEMS = [
  {
    question: "Does the recipient need to be in the same country?",
    answer:
      "No — a FizzMoment is just a link. It opens the same way whether they're across town or across the world, with no shipping cost or delay either way.",
  },
  {
    question: "Do I need their address?",
    answer: "No. You only need a way to send them a link — text, WhatsApp, email, DM, however you'd normally talk.",
  },
  {
    question: "Can I time it to arrive at a specific moment?",
    answer:
      "You control exactly when you send the link, so you can time it for their morning, a time zone difference, or a specific moment like midnight on their birthday.",
  },
  {
    question: "Is it free to send internationally?",
    answer: "Yes — there's no shipping, so there's no extra cost for distance. Creating and sending is free.",
  },
];

export default function LongDistanceGiftsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Gifts", href: "/gifts" }, { label: "Long Distance", href: "/long-distance-gifts" }]} />
      <main className="flex-1">
        <section className="px-6 pt-10 pb-16 sm:px-10 sm:pt-14 sm:pb-20">
          <div className="mx-auto flex max-w-3xl flex-col items-start gap-5">
            <span className="text-primary-active text-eyebrow font-semibold uppercase">For long distance</span>
            <h1 className="font-heading text-hero text-balance font-semibold">
              Digital gifts for long-distance friends &amp; partners
            </h1>
            <p className="text-muted-foreground text-body-lg max-w-xl text-balance">
              Distance makes shipping slow and timing hard. A FizzMoment skips both — it&apos;s just a
              link, so it arrives the second you send it, wherever they are.
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
          heading="Made for the miles in between"
          ids={["open-when", "secret-envelope", "date-generator", "fortune-cookie", "100-reasons"]}
        />

        <section className="px-6 py-16 sm:px-10">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            <h2 className="font-heading text-section text-balance font-semibold">
              A few ways people close the distance
            </h2>
            <ul className="text-muted-foreground text-body-lg flex flex-col gap-3 leading-relaxed">
              <li>
                <strong className="text-foreground">An Open When Collection</strong> — a set of sealed
                letters for &quot;open when you miss me,&quot; &quot;open when you need a laugh,&quot;
                so they have something for the exact moment they need it, not just today.
              </li>
              <li>
                <strong className="text-foreground">A Date Idea Generator</strong>, reframed as virtual
                date night ideas — something to actually do together on a call, not just look at.
              </li>
              <li>
                <strong className="text-foreground">A Secret Envelope</strong> — one letter that feels
                like it was handed to them, even from a thousand miles away.
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
