import type { TemplateCategory as PrismaTemplateCategory } from "@prisma/client";

export type TemplateCategory = PrismaTemplateCategory;

export type ElementFontFamily = "display" | "body" | "script";
export type ElementAlign = "left" | "center" | "right";

/** x/y/width/height are percentages of a fixed 9:16 canvas; rotation in degrees.
 *  Stacking order is array order in Scene.elements (front = last) — there is
 *  no separate z-index field, since there's no layers panel to manage one. */
type ElementBase = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export type TextElement = ElementBase & {
  type: "text";
  content: string;
  fontFamily: ElementFontFamily;
  fontSize: number;
  color: string;
  align: ElementAlign;
};

export type ImageElement = ElementBase & {
  type: "image";
  src: string;
};

export type StickerElement = ElementBase & {
  type: "sticker";
  emoji: string;
};

export type SceneElement = TextElement | ImageElement | StickerElement;

export type SceneBackground =
  | { type: "color"; value: string }
  | { type: "gradient"; value: string }
  | { type: "image"; value: string };

export type Scene = {
  id: string;
  background: SceneBackground;
  elements: SceneElement[];
  durationMs: number;
};

export type TemplateCatalogEntry = {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  seedScenes: Scene[];
  createdAt: string;
};

export type TemplateProjectData = {
  id: string;
  editToken: string;
  userId: string | null;
  title: string;
  music: string | null;
  scenes: Scene[];
  createdAt: string;
  updatedAt: string;
};
