import "server-only";
import { prisma } from "@/database/client";
import { scenesArraySchema } from "@/scenes/schema";
import { coverConfig } from "@/scenes/cover/config";
import type { SceneInstance, StoryData } from "@/types/story";
import type { SaveStoryInput } from "@/schemas/story";
import type { Prisma, Story } from "@prisma/client";

function parseScenes(raw: unknown): SceneInstance[] {
  return scenesArraySchema.parse(raw) as SceneInstance[];
}

function toStoryData(row: Story): StoryData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    subtitle: row.subtitle,
    recipientName: row.recipientName,
    music: row.music,
    scenes: parseScenes(row.scenes),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function defaultScenes(): SceneInstance[] {
  return [
    {
      id: crypto.randomUUID(),
      scene: "cover",
      variant: coverConfig.defaultVariant,
      data: coverConfig.defaultData(),
    } as SceneInstance,
  ];
}

export async function createBlankStory(userId: string | null = null): Promise<StoryData> {
  const row = await prisma.story.create({
    data: {
      title: "Untitled Story",
      recipientName: "",
      scenes: defaultScenes(),
      userId,
    },
  });
  return toStoryData(row);
}

export async function createStoryFromTemplate(templateId: string, userId: string | null = null): Promise<StoryData | null> {
  const template = await prisma.storyTemplate.findUnique({ where: { id: templateId } });
  if (!template) return null;

  const row = await prisma.story.create({
    data: {
      title: template.name,
      recipientName: "",
      scenes: parseScenes(template.seedScenes),
      userId,
    },
  });
  return toStoryData(row);
}

export async function getStoryById(id: string): Promise<StoryData | null> {
  const row = await prisma.story.findUnique({ where: { id } });
  return row ? toStoryData(row) : null;
}

export async function getStoryByEditToken(editToken: string): Promise<StoryData | null> {
  const row = await prisma.story.findUnique({ where: { editToken } });
  return row ? toStoryData(row) : null;
}

export async function updateStory(input: SaveStoryInput): Promise<StoryData> {
  const row = await prisma.story.update({
    where: { editToken: input.editToken },
    data: {
      title: input.title,
      subtitle: input.subtitle || null,
      recipientName: input.recipientName,
      music: input.music,
      scenes: input.scenes,
    },
  });
  return toStoryData(row);
}

export async function addReaction(storyId: string, reaction: Prisma.ReactionCreateInput["reaction"]) {
  await prisma.reaction.create({ data: { storyId, reaction } });
}
