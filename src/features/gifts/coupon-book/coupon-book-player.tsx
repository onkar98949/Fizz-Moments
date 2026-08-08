"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles, Stamp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { redeemCouponAction } from "@/actions/gift-actions";
import { COUPON_COLORS } from "@/types/gifts";
import type { Coupon, CouponBookData } from "@/types/gifts";

function colorFor(value: string) {
  return COUPON_COLORS.find((c) => c.value === value) ?? COUPON_COLORS[0];
}

export function CouponBookPlayer({ book }: { book: CouponBookData }) {
  const [coupons, setCoupons] = useState<Coupon[]>(book.coupons);
  const [index, setIndex] = useState(0);
  const [redeeming, setRedeeming] = useState(false);
  const coupon = coupons[index];
  const swatch = colorFor(coupon.color);

  async function redeem() {
    if (coupon.redeemed || redeeming) return;
    setRedeeming(true);
    const result = await redeemCouponAction({ id: book.id, couponId: coupon.id });
    setRedeeming(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setCoupons(result.data.coupons);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">🎫</span>
        <h1 className="font-display text-section text-balance">{book.title}</h1>
        <p className="text-muted-foreground text-caption">
          Coupon {index + 1} of {coupons.length}
        </p>
      </div>

      <div className="flex w-full max-w-sm items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Previous coupon"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
        >
          <ChevronLeft className="size-5" />
        </Button>

        <AnimatePresence mode="wait">
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, x: 24, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -24, rotate: -2 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="shadow-soft-xl relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-white"
          >
            <div className="flex flex-col items-center gap-3 px-6 pt-8 pb-6" style={{ backgroundColor: `${swatch.bg}26` }}>
              <span className="text-4xl">{coupon.icon}</span>
              <p className="font-display text-card-title text-center text-balance" style={{ color: swatch.text }}>
                {coupon.title}
              </p>
            </div>

            <div className="relative flex items-center px-2">
              <span aria-hidden className="bg-background absolute -left-3 size-6 rounded-full" />
              <div className="border-border/70 w-full border-t border-dashed" />
              <span aria-hidden className="bg-background absolute -right-3 size-6 rounded-full" />
            </div>

            <div className="flex flex-col items-center gap-4 px-6 py-6 text-center">
              {coupon.description ? <p className="text-muted-foreground text-caption">{coupon.description}</p> : null}
              {coupon.expiry ? <p className="text-muted-foreground text-meta">Valid: {coupon.expiry}</p> : null}

              {coupon.redeemed ? (
                <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium">
                  <Stamp className="size-4" />
                  Redeemed
                </span>
              ) : (
                <Button onClick={redeem} disabled={redeeming} className="w-full">
                  {redeeming ? "Redeeming…" : "Redeem"}
                </Button>
              )}
            </div>

            <AnimatePresence>
              {coupon.redeemed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 2.2, rotate: -18 }}
                  animate={{ opacity: 1, scale: 1, rotate: -18 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <span className="rounded-lg border-4 border-[#D64545]/70 px-4 py-1 text-xl font-black tracking-wider text-[#D64545]/70 uppercase">
                    Redeemed
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          aria-label="Next coupon"
          disabled={index === coupons.length - 1}
          onClick={() => setIndex((i) => Math.min(coupons.length - 1, i + 1))}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5">
        {coupons.map((c, i) => (
          <span key={c.id} className={i === index ? "bg-primary h-2 w-6 rounded-full transition-all" : "bg-secondary h-2 w-2 rounded-full transition-all"} />
        ))}
      </div>

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
