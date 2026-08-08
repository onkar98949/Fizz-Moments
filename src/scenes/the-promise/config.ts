import { z } from "zod";
import type { SceneConfig } from "../types";

export const thePromiseDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  quote: z.string().trim().min(1, "Write a few words.").max(160),
});

export type ThePromiseData = z.infer<typeof thePromiseDataSchema>;

export const thePromiseInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("the-promise"),
  variant: z.string().min(1),
  data: thePromiseDataSchema,
});

export const thePromiseConfig: SceneConfig<ThePromiseData> = {
  id: "the-promise",
  label: "The Promise",
  description: "A velvet ring box opens slowly, in a soft glow, to reveal a memory and a quote.",
  category: "love-story",
  tags: ["love story", "promise", "ring", "proposal", "engagement", "quote"],
  emoji: "💍",
  variants: [{ id: "ring-box", label: "Ring Box" }],
  defaultVariant: "ring-box",
  dataSchema: thePromiseDataSchema,
  defaultData: () => ({ photoUrl: "", quote: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-promise/900/1400",
    quote: "Every promise starts with a single yes.",
  }),
  getDurationMs: () => 4400,
};
