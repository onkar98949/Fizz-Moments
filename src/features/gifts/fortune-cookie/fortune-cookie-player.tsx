"use client";

import { Sparkles } from "lucide-react";
import { FortuneCookieReveal } from "./fortune-cookie-reveal";
import type { FortuneCookieData } from "@/types/gifts";

export function FortuneCookiePlayer({ cookie }: { cookie: FortuneCookieData }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <FortuneCookieReveal recipientName={cookie.recipientName} fortunes={cookie.fortunes} />

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}
