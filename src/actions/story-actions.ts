"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addReaction,
  createBlankStory,
  createStoryFromTemplate,
  getStoryById,
  updateStory,
} from "@/database/queries/stories";
import { getCurrentUserId } from "@/lib/supabase/server";
import { createStoryFromTemplateSchema, reactToStorySchema, saveStorySchema } from "@/schemas/story";
import type { StoryData } from "@/types/story";

export type StoryActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function createBlankStoryAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const story = await createBlankStory(userId);
  redirect(`/edit/${story.editToken}`);
}

export async function createStoryFromTemplateAction(input: unknown): Promise<StoryActionResult<null>> {
  const parsed = createStoryFromTemplateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Something looks off." };
  }

  const userId = await getCurrentUserId();
  const story = await createStoryFromTemplate(parsed.data.templateId, userId);
  if (!story) {
    return { success: false, error: "This template couldn't be found." };
  }

  redirect(`/edit/${story.editToken}`);
}

export async function saveStoryAction(input: unknown): Promise<StoryActionResult<StoryData>> {
  const parsed = saveStorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const story = await updateStory(parsed.data);
  revalidatePath(`/edit/${story.editToken}`);
  revalidatePath(`/story/${story.id}`);

  return { success: true, data: story };
}

export async function reactToStoryAction(input: unknown): Promise<StoryActionResult<null>> {
  const parsed = reactToStorySchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Couldn't send that reaction." };
  }

  const story = await getStoryById(parsed.data.storyId);
  if (!story) {
    return { success: false, error: "This story couldn't be found." };
  }

  await addReaction(parsed.data.storyId, parsed.data.reaction);
  return { success: true, data: null };
}
