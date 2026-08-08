"use client";

import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { DynamicShadow } from "@/animations/effects/DynamicShadow";

export const CORNERS = [
  { top: "0%", left: "0%", originX: 0, originY: 0, from: -6 },
  { top: "0%", left: "100%", originX: 1, originY: 0, from: 6 },
  { top: "100%", left: "0%", originX: 0, originY: 1, from: 5 },
  { top: "100%", left: "100%", originX: 1, originY: 1, from: -5 },
] as const;

export type LetterPaperHandle = {
  root: HTMLDivElement | null;
  shadow: HTMLDivElement | null;
  corners: HTMLDivElement[];
  heading: HTMLParagraphElement | null;
  sentences: HTMLSpanElement[];
  signature: HTMLParagraphElement | null;
};

type LetterPaperProps = {
  recipientName: string;
  message: string;
  signature: string;
};

function splitIntoSentences(message: string): string[][] {
  return message
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((paragraph) => (paragraph.match(/[^.!?]+[.!?]*/g) ?? [paragraph]).map((s) => s.trim()).filter(Boolean));
}

/** Pure structure, same principle as `envelope.tsx` — `classic.tsx`'s
 *  timeline owns every animation via the exposed handle. */
export const LetterPaper = forwardRef<LetterPaperHandle, LetterPaperProps>(function LetterPaper({ recipientName, message, signature }, ref) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLParagraphElement | null>(null);
  const sentenceRefs = useRef<HTMLSpanElement[]>([]);
  const signatureRef = useRef<HTMLParagraphElement | null>(null);

  useImperativeHandle(ref, () => ({
    get root() {
      return rootRef.current;
    },
    get shadow() {
      return shadowRef.current;
    },
    get corners() {
      return cornersRef.current;
    },
    get heading() {
      return headingRef.current;
    },
    get sentences() {
      return sentenceRefs.current;
    },
    get signature() {
      return signatureRef.current;
    },
  }));

  const paragraphs = useMemo(() => splitIntoSentences(message), [message]);
  // Cleared before the map below repopulates it via callback refs — keeps
  // this in sync when `message` changes the sentence count between renders.
  sentenceRefs.current = [];

  return (
    <div className="absolute inset-0 flex items-center justify-center px-8">
      <DynamicShadow ref={shadowRef} width={240} height={32} top="62%" />

      <div
        ref={rootRef}
        className="relative w-64 origin-top overflow-hidden rounded-sm opacity-0"
        style={{
          background: "linear-gradient(175deg, #FFFDF8 0%, #FBF3E4 100%)",
          boxShadow: "0 22px 50px -16px rgba(0,0,0,0.32), 0 1px 2px rgba(0,0,0,0.12)",
          minHeight: "18rem",
        }}
      >
        {CORNERS.map((c, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) cornersRef.current[i] = el;
            }}
            className="absolute size-10 bg-black/[0.03]"
            style={{ top: c.top, left: c.left }}
          />
        ))}

        <div className="relative flex h-full flex-col gap-3 px-6 py-8">
          <p ref={headingRef} className="font-display text-lg text-[#2C2C2C] opacity-0">
            Dear {recipientName || "you"},
          </p>

          {paragraphs.map((sentences, pIndex) => (
            <p key={pIndex} className="flex flex-col gap-1">
              {sentences.map((sentence, sIndex) => (
                <span
                  key={sIndex}
                  ref={(el) => {
                    if (el) sentenceRefs.current.push(el);
                  }}
                  className="text-sm leading-relaxed text-[#2C2C2C]/85 opacity-0"
                >
                  {sentence}
                </span>
              ))}
            </p>
          ))}

          <p ref={signatureRef} className="font-script text-primary mt-auto self-end pr-2 text-2xl opacity-0">
            {signature || "Always"}
          </p>
        </div>
      </div>
    </div>
  );
});
