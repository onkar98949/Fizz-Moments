import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const letterDataSchema = z.object({
  message: z.string().trim().min(1, "Write your letter.").max(STORY_LIMITS.MESSAGE_MAX_LENGTH),
});

export type LetterData = z.infer<typeof letterDataSchema>;

export const letterInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("letter"),
  variant: z.string().min(1),
  data: letterDataSchema,
});

const MAX_TYPING_DURATION_MS = 9000;
const MIN_CHAR_DELAY_MS = 8;
const MAX_CHAR_DELAY_MS = 40;
const PAUSE_AFTER_TYPING_MS = 1000;

export function getLetterCharDelay(messageLength: number): number {
  return Math.min(Math.max(MAX_TYPING_DURATION_MS / Math.max(messageLength, 1), MIN_CHAR_DELAY_MS), MAX_CHAR_DELAY_MS);
}

export const letterConfig: SceneConfig<LetterData> = {
  id: "letter",
  label: "Letter",
  description: "A heartfelt, typewritten letter to your recipient.",
  category: "emotional",
  tags: ["letter", "love", "message", "words", "note", "emotional", "write"],
  emoji: "💌",
  variants: [{ id: "classic", label: "Classic" }],
  defaultVariant: "classic",
  dataSchema: letterDataSchema,
  defaultData: () => ({ message: "" }),
  previewData: () => ({
    message: "Every little moment with you feels like something worth keeping forever.",
  }),
  getDurationMs: (data) => getLetterCharDelay(data.message.length) * data.message.length + PAUSE_AFTER_TYPING_MS,
};
