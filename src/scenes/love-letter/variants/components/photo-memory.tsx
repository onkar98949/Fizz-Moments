"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { DynamicShadow } from "@/animations/effects/DynamicShadow";

export const FLOATING_HEARTS = [
  { left: "14%", size: 14 },
  { left: "78%", size: 18 },
  { left: "34%", size: 11 },
  { left: "62%", size: 15 },
  { left: "50%", size: 12 },
  { left: "22%", size: 16 },
] as const;

export type PhotoMemoryHandle = {
  root: HTMLDivElement | null;
  shadow: HTMLDivElement | null;
  imageWrap: HTMLDivElement | null;
  caption: HTMLParagraphElement | null;
  hearts: HTMLDivElement[];
};

type PhotoMemoryProps = {
  photoUrl: string;
  caption: string;
};

export const PhotoMemory = forwardRef<PhotoMemoryHandle, PhotoMemoryProps>(function PhotoMemory({ photoUrl, caption }, ref) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const imageWrapRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const heartsRef = useRef<HTMLDivElement[]>([]);

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    get shadow() {
      return shadowRef.current;
    },
    get imageWrap() {
      return imageWrapRef.current;
    },
    get caption() {
      return captionRef.current;
    },
    get hearts() {
      return heartsRef.current;
    },
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center px-8">
      {FLOATING_HEARTS.map((h, i) => (
        <div
          key={h.left}
          ref={(el) => {
            if (el) heartsRef.current[i] = el;
          }}
          className="pointer-events-none absolute bottom-1/4 text-white opacity-0"
          style={{ left: h.left }}
        >
          <Heart size={h.size} strokeWidth={1.25} />
        </div>
      ))}

      <DynamicShadow ref={shadowRef} width={192} height={40} top="64%" />

      <div ref={rootRef} className="relative flex w-52 flex-col gap-3 rounded-sm bg-white p-3 pb-6 opacity-0" style={{ boxShadow: "0 26px 55px -18px rgba(0,0,0,0.4)" }}>
        <div className="relative aspect-square w-full overflow-hidden bg-black">
          <div ref={imageWrapRef} className="absolute inset-0">
            {photoUrl ? <Image src={photoUrl} alt="" fill sizes="40vw" className="object-cover" priority /> : null}
          </div>
        </div>
        <p ref={captionRef} className="font-script text-center text-lg text-[#2C2C2C] opacity-0">
          {caption}
        </p>
      </div>
    </div>
  );
});
