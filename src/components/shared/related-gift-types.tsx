import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GIFT_TYPES } from "@/constants/gifts";
import { cn } from "@/lib/utils";

/** A small grid pulling real entries straight out of the actual gift
 *  library (never invented copy) — used on occasion landing pages to show
 *  which real FizzMoments experiences fit that occasion, each linking
 *  through to /gifts to actually create one. */
export function RelatedGiftTypes({ ids, heading }: { ids: string[]; heading: string }) {
  const gifts = ids.map((id) => GIFT_TYPES.find((g) => g.id === id)).filter((g): g is (typeof GIFT_TYPES)[number] => Boolean(g));

  if (gifts.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10">
      <h2 className="font-heading text-section mb-8 text-balance font-semibold">{heading}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => (
          <Link
            key={gift.id}
            href="/gifts"
            className="group border-border bg-card shadow-soft hover:shadow-soft-lg flex flex-col gap-3 rounded-xl border p-6 transition-shadow duration-300"
          >
            <span className={cn("clay flex size-11 items-center justify-center rounded-xl text-xl", gift.tint)}>
              {gift.icon}
            </span>
            <div className="flex flex-col gap-1.5">
              <h3 className="font-heading text-card-title font-semibold">{gift.title}</h3>
              <p className="text-muted-foreground text-caption leading-relaxed">{gift.shortDescription}</p>
            </div>
            <span className="text-primary-active mt-auto flex items-center gap-1 text-sm font-medium">
              Try it
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
