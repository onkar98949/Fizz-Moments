import "server-only";
import { prisma } from "@/database/client";
import { scenesArraySchema } from "@/scenes/schema";
import type { StoryTemplateEntry } from "@/types/story";
import type { StoryTemplate } from "@prisma/client";

function toStoryTemplateEntry(row: StoryTemplate): StoryTemplateEntry {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    seedScenes: scenesArraySchema.parse(row.seedScenes) as StoryTemplateEntry["seedScenes"],
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getStoryTemplateCatalog(): Promise<StoryTemplateEntry[]> {
  const rows = await prisma.storyTemplate.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toStoryTemplateEntry);
}

export async function getStoryTemplateById(id: string): Promise<StoryTemplateEntry | null> {
  const row = await prisma.storyTemplate.findUnique({ where: { id } });
  return row ? toStoryTemplateEntry(row) : null;
}
