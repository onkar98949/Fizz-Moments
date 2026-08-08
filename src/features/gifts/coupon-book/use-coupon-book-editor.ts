"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveCouponBookAction } from "@/actions/gift-actions";
import { COUPON_BOOK_LIMITS } from "@/types/gifts";
import type { Coupon, CouponBookData } from "@/types/gifts";

function blankCoupon(): Coupon {
  return { id: crypto.randomUUID(), icon: "🎁", title: "", description: "", color: "coral", expiry: null, redeemed: false };
}

export function useCouponBookEditor(book: CouponBookData) {
  const [title, setTitle] = useState(book.title);
  const [coupons, setCoupons] = useState<Coupon[]>(book.coupons);
  const [isSaving, setIsSaving] = useState(false);

  function addCoupon() {
    if (coupons.length >= COUPON_BOOK_LIMITS.MAX_COUPONS) {
      toast.error(`You can add up to ${COUPON_BOOK_LIMITS.MAX_COUPONS} coupons.`);
      return;
    }
    setCoupons((prev) => [...prev, blankCoupon()]);
  }

  function removeCoupon(id: string) {
    if (coupons.length <= COUPON_BOOK_LIMITS.MIN_COUPONS) {
      toast.error(`Keep at least ${COUPON_BOOK_LIMITS.MIN_COUPONS} coupon.`);
      return;
    }
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCoupon(id: string, patch: Partial<Omit<Coupon, "id">>) {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function moveCoupon(id: string, direction: -1 | 1) {
    setCoupons((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      const nextIndex = index + direction;
      if (index === -1 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  async function save() {
    setIsSaving(true);
    const result = await saveCouponBookAction({ editToken: book.editToken, title, coupons });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return { book, title, setTitle, coupons, addCoupon, removeCoupon, updateCoupon, moveCoupon, isSaving, save };
}

export type CouponBookEditor = ReturnType<typeof useCouponBookEditor>;
