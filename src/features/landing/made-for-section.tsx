"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem, viewportOnce } from "@/lib/motion";

const OCCASIONS = [
  { label: "Birthdays", tint: "coral", href: "/digital-birthday-gifts" },
  { label: "Best friends", tint: "sky", href: "/gifts-for-friends" },
  { label: "Long distance", tint: "lavender", href: "/long-distance-gifts" },
  { label: "Just because", tint: "yellow" },
  { label: "Anniversaries", tint: "coral" },
  { label: "Siblings", tint: "sky" },
  { label: "Parents", tint: "lavender" },
  { label: "Inside jokes", tint: "yellow" },
  { label: "College friends", tint: "coral" },
  { label: "Appreciation", tint: "sky" },
] as const;

const TINT_STYLE: Record<(typeof OCCASIONS)[number]["tint"], string> = {
  coral: "color-mix(in oklch, var(--coral) 22%, var(--card))",
  sky: "color-mix(in oklch, var(--sky) 26%, var(--card))",
  lavender: "color-mix(in oklch, var(--lavender) 20%, var(--card))",
  yellow: "color-mix(in oklch, var(--warm-yellow) 26%, var(--card))",
};

const EASE = [0.16, 1, 0.3, 1] as const;

/** No testimonials here on purpose — there's nothing real in the database
 *  to show, and fabricating quotes or numbers isn't worth the trust it'd
 *  cost if noticed. Occasion chips do the same job honestly: showing the
 *  actual range of people this is for. A few link through to their own
 *  dedicated occasion page where one exists — genuine internal linking,
 *  not decoration. */
export function MadeForSection() {
  return (
    <section className="px-6 py-20 sm:px-10 sm:py-24">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col gap-3"
        >
          <h2 className="font-heading text-section text-balance font-semibold">
            Made for the people who matter.
          </h2>
          <p className="text-muted-foreground text-body-lg text-balance">
            Not just partners. Everyone you&apos;d actually make something for.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer}
          className="flex flex-wrap justify-center gap-3"
        >
          {OCCASIONS.map((occasion) => {
            const chip = (
              <motion.span
                variants={staggerItem}
                whileHover={{ y: -3, scale: 1.04 }}
                transition={{ type: "spring", stiffness: 340, damping: 24 }}
                className="text-foreground block rounded-full px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: TINT_STYLE[occasion.tint] }}
              >
                {occasion.label}
              </motion.span>
            );

            return "href" in occasion ? (
              <Link key={occasion.label} href={occasion.href}>
                {chip}
              </Link>
            ) : (
              <div key={occasion.label}>{chip}</div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
