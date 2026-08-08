import { z } from "zod";
import type { SceneConfig } from "../types";

export const polaroidDataSchema = z.object({
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  caption: z.string().trim().max(120).optional().default(""),
});

export type PolaroidData = z.infer<typeof polaroidDataSchema>;

export const polaroidInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("polaroid"),
  variant: z.string().min(1),
  data: polaroidDataSchema,
});

export const polaroidConfig: SceneConfig<PolaroidData> = {
  id: "polaroid",
  label: "Polaroid",
  description: "One featured photo, framed like an instant print.",
  category: "memories",
  tags: ["photo", "polaroid", "snapshot", "picture", "memory", "instant"],
  emoji: "📸",
  variants: [{ id: "tape", label: "Taped" }],
  defaultVariant: "tape",
  dataSchema: polaroidDataSchema,
  defaultData: () => ({ photoUrl: "", caption: "" }),
  previewData: () => ({
    photoUrl: "https://picsum.photos/seed/moment-preview-polaroid/900/1400",
    caption: "You, me, and this exact moment",
  }),
  getDurationMs: () => 4500,
};
