import { z } from "zod";
import type { SceneConfig } from "../types";

export const scrapbookPhotoSchema = z.object({
  id: z.string(),
  photoUrl: z.string().url(),
  rotation: z.number().min(-10).max(10),
});

export const STICKER_OPTIONS = ["✨", "💕", "🌸", "⭐", "🎀", "📌", "🍀", "☀️"] as const;

export const scrapbookDataSchema = z.object({
  photos: z.array(scrapbookPhotoSchema).min(2, "Add at least 2 photos.").max(5, "Add at most 5 photos."),
  note: z.string().trim().min(1, "Write a little note.").max(160),
  date: z.string().trim().max(40).optional().default(""),
  stickers: z.array(z.string()).max(4).optional().default([]),
});

export type ScrapbookPhoto = z.infer<typeof scrapbookPhotoSchema>;
export type ScrapbookData = z.infer<typeof scrapbookDataSchema>;

export const scrapbookInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("scrapbook"),
  variant: z.string().min(1),
  data: scrapbookDataSchema,
});

const MAX_TYPING_MS = 3200;
const MIN_CHAR_DELAY_MS = 18;
const MAX_CHAR_DELAY_MS = 55;

export function getScrapbookCharDelay(noteLength: number): number {
  return Math.min(Math.max(MAX_TYPING_MS / Math.max(noteLength, 1), MIN_CHAR_DELAY_MS), MAX_CHAR_DELAY_MS);
}

export const scrapbookConfig: SceneConfig<ScrapbookData> = {
  id: "scrapbook",
  label: "Scrapbook Page",
  description: "A handcrafted page where photos, tape, and a handwritten note assemble themselves.",
  category: "memories",
  tags: ["scrapbook", "journal", "craft", "handmade", "collage", "sticker", "tape", "paper"],
  emoji: "📖",
  variants: [{ id: "handmade", label: "Handmade" }],
  defaultVariant: "handmade",
  dataSchema: scrapbookDataSchema,
  defaultData: () => ({ photos: [], note: "", date: "", stickers: [] }),
  previewData: () => ({
    photos: [
      { id: "p1", photoUrl: "https://picsum.photos/seed/moment-preview-scrap1/900/900", rotation: -6 },
      { id: "p2", photoUrl: "https://picsum.photos/seed/moment-preview-scrap2/900/900", rotation: 5 },
      { id: "p3", photoUrl: "https://picsum.photos/seed/moment-preview-scrap3/900/900", rotation: -3 },
    ],
    note: "This page is basically just us being ridiculous, and I wouldn't have it any other way.",
    date: "Spring 2024",
    stickers: ["✨", "💕", "🌸"],
  }),
  getDurationMs: (data) => 1200 + data.photos.length * 350 + getScrapbookCharDelay(data.note.length) * data.note.length + 900,
};
