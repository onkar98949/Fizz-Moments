"use client";

import Image from "next/image";
import { BoxReveal } from "../../_shared/box-reveal";
import type { ThePromiseData } from "../config";

export function RingBoxPromise({ data }: { data: ThePromiseData }) {
  return (
    <BoxReveal icon="💍" colorFrom="#5b3a63" colorTo="#2e1630">
      <div className="relative aspect-square w-40 overflow-hidden rounded-2xl border-4 border-white shadow-xl">
        {data.photoUrl ? <Image src={data.photoUrl} alt="" fill sizes="40vw" className="object-cover" /> : null}
      </div>
      <p className="font-display text-foreground mt-4 max-w-xs text-center text-lg text-balance">{data.quote}</p>
    </BoxReveal>
  );
}
