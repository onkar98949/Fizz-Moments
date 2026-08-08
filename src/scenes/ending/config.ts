import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const endingDataSchema = z.object({
  closingMessage: z.string().trim().min(1, "Write a closing message.").max(STORY_LIMITS.MESSAGE_MAX_LENGTH),
});

export type EndingData = z.infer<typeof endingDataSchema>;

export const endingInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("ending"),
  variant: z.string().min(1),
  data: endingDataSchema,
});

export const endingConfig: SceneConfig<EndingData> = {
  id: "ending",
  label: "Ending",
  description: "The closing note — where your recipient can react.",
  category: "structure",
  tags: ["ending", "closing", "finale", "goodbye", "thank you", "sign off"],
  emoji: "🎁",
  variants: [{ id: "classic", label: "Classic" }],
  defaultVariant: "classic",
  dataSchema: endingDataSchema,
  defaultData: () => ({ closingMessage: "" }),
  previewData: () => ({ closingMessage: "With all my love, today and always." }),
  getDurationMs: () => 0,
  isTerminal: true,
};
