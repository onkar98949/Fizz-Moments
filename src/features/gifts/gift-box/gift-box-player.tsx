"use client";

import { GiftBoxReveal } from "./gift-box-reveal";
import type { GiftBoxData } from "@/types/gifts";

export function GiftBoxPlayer({ box }: { box: GiftBoxData }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-16">
      <GiftBoxReveal title={box.title} message={box.message} photoUrl={box.photoUrl} />
    </div>
  );
}
