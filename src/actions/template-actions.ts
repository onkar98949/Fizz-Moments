"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBlankProject,
  createProjectFromTemplate,
  getTemplateProjectByEditToken,
  updateTemplateProject,
} from "@/database/queries/templates";
import { getCurrentUserId } from "@/lib/supabase/server";
import { saveTemplateProjectSchema } from "@/schemas/template";
import type { TemplateProjectData } from "@/types/template";

export type TemplateActionResult<T> = { success: true; data: T } | { success: false; error: string };

export async function createBlankProjectAction(): Promise<never> {
  const userId = await getCurrentUserId();
  const project = await createBlankProject(userId);
  redirect(`/templates/edit/${project.editToken}`);
}

export async function createFromTemplateAction(templateId: string): Promise<TemplateActionResult<null>> {
  const userId = await getCurrentUserId();
  const project = await createProjectFromTemplate(templateId, userId);
  if (!project) {
    return { success: false, error: "This template couldn't be found." };
  }
  redirect(`/templates/edit/${project.editToken}`);
}

export async function saveTemplateProjectAction(
  input: unknown,
): Promise<TemplateActionResult<TemplateProjectData>> {
  const parsed = saveTemplateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something looks off." };
  }

  const existing = await getTemplateProjectByEditToken(parsed.data.editToken);
  if (!existing) {
    return { success: false, error: "This edit link has expired." };
  }

  const project = await updateTemplateProject(parsed.data.editToken, {
    title: parsed.data.title,
    music: parsed.data.music,
    scenes: parsed.data.scenes,
  });

  revalidatePath(`/templates/edit/${project.editToken}`);
  revalidatePath(`/templates/story/${project.id}`);

  return { success: true, data: project };
}
