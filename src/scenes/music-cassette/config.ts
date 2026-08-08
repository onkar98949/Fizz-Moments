import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const musicCassetteDataSchema = z.object({
  songTitle: z.string().trim().min(1, "What's the song called?").max(80),
  artistName: z.string().trim().min(1, "Who's it by?").max(60),
  caption: z.string().trim().max(STORY_LIMITS.CAPTION_MAX_LENGTH).optional().default(""),
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
});

export type MusicCassetteData = z.infer<typeof musicCassetteDataSchema>;

export const musicCassetteInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("music-cassette"),
  variant: z.string().min(1),
  data: musicCassetteDataSchema,
});

export const musicCassetteConfig: SceneConfig<MusicCassetteData> = {
  id: "music-cassette",
  label: "Music Cassette",
  description: "A nostalgic tape player — the reels turn while your song plays and a memory fades in.",
  category: "music",
  tags: ["music", "cassette", "tape", "song", "mixtape", "our song", "vinyl", "nostalgia"],
  emoji: "🎧",
  variants: [{ id: "player", label: "Player" }],
  defaultVariant: "player",
  dataSchema: musicCassetteDataSchema,
  defaultData: () => ({ songTitle: "", artistName: "", caption: "", photoUrl: "" }),
  previewData: () => ({
    songTitle: "Our Song",
    artistName: "The One We Always Play",
    caption: "Every time this comes on, I think of you",
    photoUrl: "https://picsum.photos/seed/moment-preview-cassette/900/1400",
  }),
  getDurationMs: () => 5400,
};
