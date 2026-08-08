"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { COUPON_BOOK_LIMITS, COUPON_COLORS } from "@/types/gifts";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useCouponBookEditor } from "./use-coupon-book-editor";
import type { CouponBookData } from "@/types/gifts";

export function CouponBookEditor({ book, isSignedIn }: { book: CouponBookData; isSignedIn: boolean }) {
  const editor = useCouponBookEditor(book);
  const share = useGatedShare(isSignedIn);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={COUPON_BOOK_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Coupon Book"
          className="ml-1 h-9 max-w-[220px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={share.requestShare}>
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button size="sm" onClick={editor.save} disabled={editor.isSaving}>
            {editor.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-center">
        <span className="text-3xl">🎫</span>
        <p className="text-muted-foreground text-caption">
          {editor.coupons.length}/{COUPON_BOOK_LIMITS.MAX_COUPONS} coupons
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-4">
        {editor.coupons.map((coupon, index) => (
          <motion.div key={coupon.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  value={coupon.icon}
                  onChange={(e) => editor.updateCoupon(coupon.id, { icon: e.target.value })}
                  maxLength={8}
                  className="h-9 w-14 text-center"
                />
                <Input
                  value={coupon.title}
                  onChange={(e) => editor.updateCoupon(coupon.id, { title: e.target.value })}
                  placeholder="Free Hug"
                  maxLength={COUPON_BOOK_LIMITS.TITLE_MAX_LENGTH}
                  className="h-9 w-44"
                />
              </div>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" disabled={index === 0} onClick={() => editor.moveCoupon(coupon.id, -1)}>
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move down"
                  disabled={index === editor.coupons.length - 1}
                  onClick={() => editor.moveCoupon(coupon.id, 1)}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove coupon"
                  onClick={() => editor.removeCoupon(coupon.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <Textarea
              value={coupon.description}
              onChange={(e) => editor.updateCoupon(coupon.id, { description: e.target.value })}
              placeholder="Redeemable anytime, no questions asked."
              maxLength={COUPON_BOOK_LIMITS.DESCRIPTION_MAX_LENGTH}
              className="min-h-14 text-sm"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-xs">Color</Label>
                <div className="flex gap-1.5">
                  {COUPON_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      aria-label={c.label}
                      onClick={() => editor.updateCoupon(coupon.id, { color: c.value })}
                      className={cn(
                        "size-7 rounded-full ring-2 ring-offset-2 transition-shadow",
                        coupon.color === c.value ? "ring-primary" : "ring-transparent",
                      )}
                      style={{ backgroundColor: c.bg }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-muted-foreground text-xs">Expiry (optional)</Label>
                <Input
                  value={coupon.expiry ?? ""}
                  onChange={(e) => editor.updateCoupon(coupon.id, { expiry: e.target.value || null })}
                  placeholder="No expiry"
                  maxLength={COUPON_BOOK_LIMITS.EXPIRY_MAX_LENGTH}
                  className="h-9"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button type="button" variant="outline" onClick={editor.addCoupon} disabled={editor.coupons.length >= COUPON_BOOK_LIMITS.MAX_COUPONS} className="w-full">
        <Plus className="size-4" />
        Add Coupon
      </Button>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this coupon book</DialogTitle>
            <DialogDescription>Anyone with the link can flip through and redeem it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/gifts/coupon-book/${editor.book.id}`} editPath={`/gifts/coupon-book/edit/${editor.book.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
