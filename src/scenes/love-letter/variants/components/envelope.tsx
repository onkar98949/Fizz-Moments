"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { Heart } from "lucide-react";
import { DynamicShadow } from "@/animations/effects/DynamicShadow";

export type EnvelopeHandle = {
  root: HTMLDivElement | null;
  shadow: HTMLDivElement | null;
  flap: HTMLDivElement | null;
  seal: HTMLDivElement | null;
  sealGlow: HTMLDivElement | null;
  sparkles: HTMLDivElement[];
};

export const SPARKLE_ANGLES = [-40, 20, 100, 200] as const;

/**
 * Pure structure — no animation logic of its own. `classic.tsx`'s GSAP
 * timeline reaches into the handle this exposes (`envelope.root`,
 * `envelope.flap`, `envelope.seal`, ...) and drives every transform/opacity
 * directly. This component's only job is to exist in the right shape.
 */
export const Envelope = forwardRef<EnvelopeHandle>(function Envelope(_props, ref) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const flapRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);
  const sealGlowRef = useRef<HTMLDivElement | null>(null);
  const sparklesRef = useRef<HTMLDivElement[]>([]);

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    get shadow() {
      return shadowRef.current;
    },
    get flap() {
      return flapRef.current;
    },
    get seal() {
      return sealRef.current;
    },
    get sealGlow() {
      return sealGlowRef.current;
    },
    get sparkles() {
      return sparklesRef.current;
    },
  }));

  return (
    <div className="absolute inset-0 flex items-center justify-center px-10">
      <DynamicShadow ref={shadowRef} width={224} height={24} top="58%" />

      <div ref={rootRef} className="relative w-64 opacity-0" style={{ perspective: 900 }}>
        <div
          className="relative aspect-[3/2] w-full rounded-lg"
          style={{
            background: "linear-gradient(160deg, #F3E4D0 0%, #E7D3B8 100%)",
            boxShadow: "0 18px 40px -14px rgba(0,0,0,0.35), 0 2px 4px rgba(0,0,0,0.12)",
          }}
        >
          <div
            className="absolute inset-2 rounded-md opacity-60"
            style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.06) 100%)" }}
          />

          <div ref={flapRef} className="absolute top-0 left-0 h-full w-full" style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}>
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 62%)",
                background: "linear-gradient(200deg, #EFDCC2 0%, #DCC3A0 100%)",
                backfaceVisibility: "hidden",
              }}
            />

            <div
              ref={sealRef}
              className="absolute top-[38%] left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
              style={{
                background: "radial-gradient(circle at 35% 30%, #E0B091, #A8664A 70%)",
                boxShadow: "0 3px 8px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.4)",
              }}
            >
              <div
                ref={sealGlowRef}
                className="absolute inset-0 rounded-full opacity-0"
                style={{ background: "radial-gradient(circle, rgba(255,214,158,0.9), transparent 70%)" }}
              />
              <Heart className="relative size-4 text-[#FFEFDD]/80" fill="currentColor" strokeWidth={0} />
            </div>

            {SPARKLE_ANGLES.map((angle, i) => (
              <div
                key={angle}
                ref={(el) => {
                  if (el) sparklesRef.current[i] = el;
                }}
                className="absolute top-[38%] left-1/2 size-1 rounded-full bg-[#FFE9C7] opacity-0"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
