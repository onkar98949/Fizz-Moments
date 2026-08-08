import { z } from "zod";

const percentage = z.number().min(-20).max(120);

const elementBaseSchema = z.object({
  id: z.string().min(1),
  x: percentage,
  y: percentage,
  width: z.number().min(2).max(150),
  height: z.number().min(2).max(150),
  rotation: z.number().min(-180).max(180),
});

export const textElementSchema = elementBaseSchema.extend({
  type: z.literal("text"),
  content: z.string().max(400),
  fontFamily: z.enum(["display", "body", "script"]),
  fontSize: z.number().min(8).max(120),
  color: z.string().min(1),
  align: z.enum(["left", "center", "right"]),
});

export const imageElementSchema = elementBaseSchema.extend({
  type: z.literal("image"),
  src: z.string().min(1),
});

export const stickerElementSchema = elementBaseSchema.extend({
  type: z.literal("sticker"),
  emoji: z.string().min(1).max(8),
});

export const sceneElementSchema = z.discriminatedUnion("type", [
  textElementSchema,
  imageElementSchema,
  stickerElementSchema,
]);

export const sceneBackgroundSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("color"), value: z.string().min(1) }),
  z.object({ type: z.literal("gradient"), value: z.string().min(1) }),
  z.object({ type: z.literal("image"), value: z.string().min(1) }),
]);

export const sceneSchema = z.object({
  id: z.string().min(1),
  background: sceneBackgroundSchema,
  elements: z.array(sceneElementSchema).max(20),
  durationMs: z.number().min(1000).max(15000),
});

export const scenesSchema = z.array(sceneSchema).min(1).max(12);

export const saveTemplateProjectSchema = z.object({
  editToken: z.string().min(1),
  title: z.string().trim().min(1, "Give your project a title.").max(80),
  music: z.string().nullable(),
  scenes: scenesSchema,
});

export type SaveTemplateProjectInput = z.infer<typeof saveTemplateProjectSchema>;
