import { loveLetterDataSchema, type LoveLetterData } from "./types";
import { z } from "zod";
import type { SceneConfig } from "../types";

export const loveLetterInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("love-letter"),
  variant: z.string().min(1),
  data: loveLetterDataSchema,
});

// Fixed regardless of message length, on purpose — this is a directed
// eight-beat GSAP timeline with its own internal pacing (see
// variants/classic.tsx), not a reader that scales with how much text you
// typed. Matches the architecture's 0-10s timeline exactly.
const TOTAL_DURATION_MS = 10000;

export const loveLetterConfig: SceneConfig<LoveLetterData> = {
  id: "love-letter",
  label: "Love Letter",
  description: "A cinematic wax-sealed letter — envelope, unfolding paper, handwriting, then a photo.",
  category: "love-story",
  tags: ["love letter", "cinematic", "wax seal", "envelope", "romantic", "premium", "polaroid", "handwritten"],
  emoji: "💝",
  variants: [{ id: "classic", label: "Classic" }],
  defaultVariant: "classic",
  dataSchema: loveLetterDataSchema,
  defaultData: () => ({ recipientName: "", message: "", signature: "", photoUrl: "", letterStyle: "classic" }),
  previewData: () => ({
    recipientName: "You",
    message: "From the first hello to right now, every quiet moment with you has been my favorite kind of loud.",
    signature: "Always,",
    photoUrl: "https://picsum.photos/seed/moment-preview-loveletter/900/1400",
    letterStyle: "classic",
  }),
  getDurationMs: () => TOTAL_DURATION_MS,
};
