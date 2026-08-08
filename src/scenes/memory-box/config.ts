import { z } from "zod";
import type { SceneConfig } from "../types";

export const memoryBoxPhotoSchema = z.object({ id: z.string(), photoUrl: z.string().url() });

export const KEEPSAKE_OPTIONS = ["🎁", "💌", "🔑", "📷", "🕯️", "🧸"] as const;

export const memoryBoxDataSchema = z.object({
  photos: z.array(memoryBoxPhotoSchema).min(2, "Add at least 2 photos.").max(6, "Add at most 6 photos."),
  note: z.string().trim().max(160).optional().default(""),
  date: z.string().trim().max(40).optional().default(""),
  keepsakeEmoji: z.string().optional().default("🎁"),
});

export type MemoryBoxPhoto = z.infer<typeof memoryBoxPhotoSchema>;
export type MemoryBoxData = z.infer<typeof memoryBoxDataSchema>;

export const memoryBoxInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("memory-box"),
  variant: z.string().min(1),
  data: memoryBoxDataSchema,
});

export const memoryBoxConfig: SceneConfig<MemoryBoxData> = {
  id: "memory-box",
  label: "Memory Box",
  description: "A keepsake box that opens slowly, and lets everything inside float free.",
  category: "memories",
  tags: ["box", "keepsake", "gift", "treasure", "open", "surprise", "unbox"],
  emoji: "📦",
  variants: [{ id: "unbox", label: "Unbox" }],
  defaultVariant: "unbox",
  dataSchema: memoryBoxDataSchema,
  defaultData: () => ({ photos: [], note: "", date: "", keepsakeEmoji: "🎁" }),
  previewData: () => ({
    photos: [
      { id: "b1", photoUrl: "https://picsum.photos/seed/moment-preview-box1/900/900" },
      { id: "b2", photoUrl: "https://picsum.photos/seed/moment-preview-box2/900/900" },
      { id: "b3", photoUrl: "https://picsum.photos/seed/moment-preview-box3/900/900" },
      { id: "b4", photoUrl: "https://picsum.photos/seed/moment-preview-box4/900/900" },
    ],
    note: "Everything we kept, just because we couldn't bear to throw it away.",
    date: "Opened again, 2026",
    keepsakeEmoji: "🎁",
  }),
  getDurationMs: (data) => 1500 + data.photos.length * 320 + 1400,
};
