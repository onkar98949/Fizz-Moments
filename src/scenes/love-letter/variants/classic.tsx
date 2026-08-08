"use client";

import { useRef } from "react";
import gsap from "gsap";
import { CinematicStage } from "@/animations/components/CinematicStage";
import { useSceneTimeline } from "@/animations/gsap/useSceneTimeline";
import { AMBIENT_FADE_IN_S, EASE } from "@/animations/gsap/sceneDefaults";
import { Envelope, SPARKLE_ANGLES, type EnvelopeHandle } from "./components/envelope";
import { LetterPaper, CORNERS, type LetterPaperHandle } from "./components/letter-paper";
import { PhotoMemory, type PhotoMemoryHandle } from "./components/photo-memory";
import type { LoveLetterData } from "../types";

/**
 * One GSAP timeline drives this entire scene — every phase below is a
 * position on `tl`, not a `setTimeout`. Camera/lighting/particles are
 * intentionally NOT part of this timeline: `CinematicStage` owns those as
 * continuous, scene-agnostic loops (see `useCameraAnimation`), the same way
 * a camera operator keeps a shot breathing independently of what the actors
 * are doing. This timeline only touches the letter's own objects.
 */
export function ClassicLoveLetter({ data }: { data: LoveLetterData }) {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const stageBgRef = useRef<HTMLDivElement | null>(null);
  const envelopeRef = useRef<EnvelopeHandle | null>(null);
  const paperRef = useRef<LetterPaperHandle | null>(null);
  const photoRef = useRef<PhotoMemoryHandle | null>(null);

  useSceneTimeline(
    sceneRef,
    (tl) => {
      const envelope = envelopeRef.current;
      const paper = paperRef.current;
      const photo = photoRef.current;
      if (!envelope || !paper || !photo) return;

      // ---- Initial state, set once before any tween runs ----
      gsap.set(envelope.root, { yPercent: 130, opacity: 0 });
      gsap.set(paper.root, { yPercent: 70, opacity: 0, scaleY: 0.22 });
      gsap.set(paper.corners, { rotation: (i: number) => CORNERS[i].from, opacity: 0.6 });
      gsap.set([paper.heading, ...paper.sentences, paper.signature], { opacity: 0, y: 10 });
      gsap.set(photo.root, { yPercent: 120, opacity: 0, rotation: 5, scale: 0.85 });
      gsap.set(photo.hearts, { opacity: 0 });
      gsap.set(envelope.sparkles, { opacity: 0, scale: 0, x: 0, y: 0 });
      gsap.set([envelope.shadow, paper.shadow, photo.shadow], { opacity: 0 });

      // ---- Phase 1 (0 -> 1s): background wakes up ----
      tl.fromTo(stageBgRef.current, { opacity: 0 }, { opacity: 1, duration: AMBIENT_FADE_IN_S, ease: EASE.soft }, 0);

      // ---- Phase 2 (1 -> 2s): envelope lands with weight ----
      tl.to(envelope.root, { yPercent: 0, opacity: 1, duration: 0.9, ease: EASE.landing }, 1);
      tl.fromTo(envelope.shadow, { opacity: 0, scaleX: 0.7 }, { opacity: 0.22, scaleX: 1, duration: 0.9, ease: EASE.landing }, 1);

      // ---- Phase 3 (2 -> 3s): wax seal glows and sparkles ----
      tl.to(envelope.seal, { scale: 1.1, duration: 0.35, ease: EASE.pop, yoyo: true, repeat: 1 }, 2);
      tl.fromTo(envelope.sealGlow, { opacity: 0, scale: 0.8 }, { opacity: 0.9, scale: 1.6, duration: 0.9, ease: EASE.soft }, 2);
      tl.to(
        envelope.sparkles,
        {
          opacity: 1,
          scale: 1,
          x: (i: number) => Math.cos((SPARKLE_ANGLES[i] * Math.PI) / 180) * 32,
          y: (i: number) => Math.sin((SPARKLE_ANGLES[i] * Math.PI) / 180) * 32,
          duration: 0.6,
          stagger: 0.12,
          ease: EASE.pop,
        },
        2.1,
      );
      tl.to(envelope.sparkles, { opacity: 0, duration: 0.4 }, 2.8);

      // ---- Phase 4 (3 -> 5s): flap opens, paper begins its slow slide ----
      tl.to(envelope.flap, { rotateX: -168, duration: 1, ease: "power2.inOut" }, 3);
      tl.fromTo(paper.shadow, { opacity: 0 }, { opacity: 0.14, duration: 1.2, ease: EASE.soft }, 3.5);
      tl.to(paper.root, { yPercent: 15, opacity: 0.9, duration: 1.3, ease: EASE.soft }, 3.6);

      // ---- Phase 5 (5 -> 6.5s): letter unfolds, corners settle independently ----
      tl.to(paper.root, { yPercent: 0, scaleY: 1, opacity: 1, duration: 1.2, ease: EASE.landing }, 5);
      tl.to(paper.shadow, { opacity: 0.22, duration: 1.2, ease: EASE.soft }, 5);
      tl.to(paper.corners, { rotation: 0, opacity: 0, duration: 1, stagger: 0.1, ease: EASE.soft }, 5.1);

      // ---- Phase 6 (6.5 -> 8s): handwriting, then the signature ----
      tl.to(paper.heading, { opacity: 1, y: 0, duration: 0.5, ease: EASE.soft }, 6.5);
      const sentenceCount = paper.sentences.length;
      const sentenceStagger = Math.min(0.32, 1 / Math.max(sentenceCount, 1));
      tl.to(paper.sentences, { opacity: 1, y: 0, duration: 0.5, stagger: sentenceStagger, ease: EASE.soft }, 6.85);
      tl.to(paper.signature, { opacity: 1, y: 0, duration: 0.5, ease: EASE.soft }, 7.7);

      // ---- Phase 7 (8 -> 9s): the photo slides out and lands ----
      tl.to(photo.root, { yPercent: 0, opacity: 1, rotation: -2.5, scale: 1, duration: 0.85, ease: EASE.landing }, 8);
      tl.fromTo(photo.shadow, { opacity: 0 }, { opacity: 0.22, duration: 0.85, ease: EASE.landing }, 8);
      // "Paper underneath reacts" — a small settle, not a hold.
      tl.to(paper.root, { rotation: 0.6, duration: 0.3, ease: "power1.out" }, 8).to(paper.root, { rotation: 0, duration: 0.4, ease: "power1.inOut" }, 8.3);
      tl.to(photo.root, { rotation: 0, scale: 1.08, duration: 0.6, ease: EASE.soft }, 8.7);
      tl.to(photo.imageWrap, { scale: 1.18, duration: 4, ease: "none" }, 8.2);
      tl.to(photo.caption, { opacity: 1, y: 0, duration: 0.6, ease: EASE.soft }, 8.9);
      // Hearts start their own infinite drift once the photo has become the hero.
      tl.to(
        photo.hearts,
        {
          keyframes: { "0%": { opacity: 0, y: 0 }, "12%": { opacity: 0.09 }, "88%": { opacity: 0.09 }, "100%": { opacity: 0, y: -220 } },
          duration: 7,
          stagger: 0.8,
          repeat: -1,
          ease: "power1.out",
        },
        9,
      );
      // Depth cue for the photo becoming the hero — opacity only, no filter/blur.
      tl.to([envelope.root, paper.root], { opacity: 0.55, duration: 1, ease: EASE.soft }, 8.6);

      // ---- Phase 8 (9 -> 10s): ending ----
      tl.to(".moment-love-letter-ending-glow", { opacity: 1, duration: 0.9, ease: "power2.inOut" }, 9);
    },
    [data.recipientName, data.message, data.signature, data.photoUrl],
  );

  return (
    <div ref={sceneRef} className="relative h-full w-full">
      <CinematicStage ref={stageBgRef} backgroundColor="#FAF6EF">
        <Envelope ref={envelopeRef} />
        <LetterPaper ref={paperRef} recipientName={data.recipientName} message={data.message} signature={data.signature} />
        <PhotoMemory ref={photoRef} photoUrl={data.photoUrl} caption={data.signature} />
      </CinematicStage>

      <div
        className="moment-love-letter-ending-glow pointer-events-none absolute inset-0 opacity-0"
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(255,250,240,0.95), rgba(255,246,232,0.6) 70%)" }}
      />
    </div>
  );
}
