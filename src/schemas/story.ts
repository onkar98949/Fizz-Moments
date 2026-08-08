import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import { scenesArraySchema } from "@/scenes/schema";

export const reactionTypeSchema = z.enum(["HEART", "TEARY_EYES", "SMILE"]);

export const saveStorySchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your story a title.").max(STORY_LIMITS.TITLE_MAX_LENGTH),
  subtitle: z.string().trim().max(STORY_LIMITS.SUBTITLE_MAX_LENGTH).optional().default(""),
  recipientName: z
    .string()
    .trim()
    .min(1, "Who is this for?")
    .max(STORY_LIMITS.RECIPIENT_NAME_MAX_LENGTH),
  music: z.string().nullable(),
  scenes: scenesArraySchema,
});

export type SaveStoryInput = z.infer<typeof saveStorySchema>;

export const createStoryFromTemplateSchema = z.object({
  templateId: z.string().min(1),
});

export const reactToStorySchema = z.object({
  storyId: z.string().min(1),
  reaction: reactionTypeSchema,
});
