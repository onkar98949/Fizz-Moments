import type {
  ReactionType as PrismaReactionType,
  StoryTemplateCategory as PrismaStoryTemplateCategory,
} from "@prisma/client";
import type { SceneInstance } from "@/scenes/schema";

export type ReactionType = PrismaReactionType;
export type StoryTemplateCategory = PrismaStoryTemplateCategory;
export type { SceneInstance } from "@/scenes/schema";

/**
 * A Story is a title/subtitle/recipient/music envelope around an ordered
 * array of scenes. Never store HTML/video/pre-baked output — the player
 * renders `scenes` dynamically via the scene registry.
 */
export type StoryData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  subtitle: string | null;
  recipientName: string;
  music: string | null;
  scenes: SceneInstance[];
  createdAt: string;
  updatedAt: string;
};

export type StoryTemplateEntry = {
  id: string;
  name: string;
  category: StoryTemplateCategory;
  description: string;
  seedScenes: SceneInstance[];
  createdAt: string;
};
