import { z } from "zod";
import { coverConfig, coverInstanceSchema } from "./cover/config";
import { timelineConfig, timelineInstanceSchema } from "./timeline/config";
import { polaroidConfig, polaroidInstanceSchema } from "./polaroid/config";
import { letterConfig, letterInstanceSchema } from "./letter/config";
import { journeyConfig, journeyInstanceSchema } from "./journey/config";
import { calendarConfig, calendarInstanceSchema } from "./calendar/config";
import { endingConfig, endingInstanceSchema } from "./ending/config";
import { textConversationConfig, textConversationInstanceSchema } from "./text-conversation/config";
import { memoryMapConfig, memoryMapInstanceSchema } from "./memory-map/config";
import { scrapbookConfig, scrapbookInstanceSchema } from "./scrapbook/config";
import { musicCassetteConfig, musicCassetteInstanceSchema } from "./music-cassette/config";
import { cinemaTicketConfig, cinemaTicketInstanceSchema } from "./cinema-ticket/config";
import { memoryBoxConfig, memoryBoxInstanceSchema } from "./memory-box/config";
import { constellationConfig, constellationInstanceSchema } from "./constellation/config";
import { cameraRollConfig, cameraRollInstanceSchema } from "./camera-roll/config";
import { boardingTimelineConfig, boardingTimelineInstanceSchema } from "./boarding-timeline/config";
import { memoryReelConfig, memoryReelInstanceSchema } from "./memory-reel/config";
import { firstGlanceConfig, firstGlanceInstanceSchema } from "./first-glance/config";
import { firstDateConfig, firstDateInstanceSchema } from "./first-date/config";
import { firstConversationConfig, firstConversationInstanceSchema } from "./first-conversation/config";
import { thePromiseConfig, thePromiseInstanceSchema } from "./the-promise/config";
import { heartCollageConfig, heartCollageInstanceSchema } from "./heart-collage/config";
import { foreverConfig, foreverInstanceSchema } from "./forever/config";
import { boardingPassConfig, boardingPassInstanceSchema } from "./boarding-pass/config";
import { routeMapConfig, routeMapInstanceSchema } from "./route-map/config";
import { hotelCheckInConfig, hotelCheckInInstanceSchema } from "./hotel-check-in/config";
import { landmarkMemoryConfig, landmarkMemoryInstanceSchema } from "./landmark-memory/config";
import { foodMemoryConfig, foodMemoryInstanceSchema } from "./food-memory/config";
import { sunsetMemoryConfig, sunsetMemoryInstanceSchema } from "./sunset-memory/config";
import { loveLetterConfig, loveLetterInstanceSchema } from "./love-letter/config";
import type { SceneConfig } from "./types";

/** Plain data only (no components) — safe for server code to import. Each
 *  entry's TData differs, and React/TS have no existential type to express
 *  that heterogeneity precisely — `any` here is the documented, narrow
 *  boundary where that precision is deliberately dropped. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENE_CONFIGS: SceneConfig<any>[] = [
  coverConfig,
  timelineConfig,
  polaroidConfig,
  letterConfig,
  journeyConfig,
  calendarConfig,
  endingConfig,
  textConversationConfig,
  memoryMapConfig,
  scrapbookConfig,
  musicCassetteConfig,
  cinemaTicketConfig,
  memoryBoxConfig,
  constellationConfig,
  cameraRollConfig,
  boardingTimelineConfig,
  memoryReelConfig,
  firstGlanceConfig,
  firstDateConfig,
  firstConversationConfig,
  thePromiseConfig,
  heartCollageConfig,
  foreverConfig,
  boardingPassConfig,
  routeMapConfig,
  hotelCheckInConfig,
  landmarkMemoryConfig,
  foodMemoryConfig,
  sunsetMemoryConfig,
  loveLetterConfig,
];

export type SceneName =
  | "cover"
  | "timeline"
  | "polaroid"
  | "letter"
  | "journey"
  | "calendar"
  | "ending"
  | "text-conversation"
  | "memory-map"
  | "scrapbook"
  | "music-cassette"
  | "cinema-ticket"
  | "memory-box"
  | "constellation"
  | "camera-roll"
  | "boarding-timeline"
  | "memory-reel"
  | "first-glance"
  | "first-date"
  | "first-conversation"
  | "the-promise"
  | "heart-collage"
  | "forever"
  | "boarding-pass"
  | "route-map"
  | "hotel-check-in"
  | "landmark-memory"
  | "food-memory"
  | "sunset-memory"
  | "love-letter";

/**
 * The single source of truth for a story's `scenes` shape. Each branch's
 * `scene` literal is declared directly in that scene's own config.ts (not
 * derived from `config.id: string`, which would widen the literal and
 * defeat discriminated-union narrowing) — see coverInstanceSchema etc.
 */
export const sceneInstanceSchema = z.discriminatedUnion("scene", [
  coverInstanceSchema,
  timelineInstanceSchema,
  polaroidInstanceSchema,
  letterInstanceSchema,
  journeyInstanceSchema,
  calendarInstanceSchema,
  endingInstanceSchema,
  textConversationInstanceSchema,
  memoryMapInstanceSchema,
  scrapbookInstanceSchema,
  musicCassetteInstanceSchema,
  cinemaTicketInstanceSchema,
  memoryBoxInstanceSchema,
  constellationInstanceSchema,
  cameraRollInstanceSchema,
  boardingTimelineInstanceSchema,
  memoryReelInstanceSchema,
  firstGlanceInstanceSchema,
  firstDateInstanceSchema,
  firstConversationInstanceSchema,
  thePromiseInstanceSchema,
  heartCollageInstanceSchema,
  foreverInstanceSchema,
  boardingPassInstanceSchema,
  routeMapInstanceSchema,
  hotelCheckInInstanceSchema,
  landmarkMemoryInstanceSchema,
  foodMemoryInstanceSchema,
  sunsetMemoryInstanceSchema,
  loveLetterInstanceSchema,
]);

export type SceneInstance = z.infer<typeof sceneInstanceSchema>;

export const scenesArraySchema = z.array(sceneInstanceSchema).min(1).max(20);

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see SCENE_CONFIGS above
export function getSceneConfig(sceneId: string): SceneConfig<any> | undefined {
  return SCENE_CONFIGS.find((c) => c.id === sceneId);
}

export function getSceneDurationMs(instance: SceneInstance): number {
  const config = getSceneConfig(instance.scene);
  return config ? config.getDurationMs(instance.data) : 4000;
}

export function isTerminalScene(instance: SceneInstance): boolean {
  return getSceneConfig(instance.scene)?.isTerminal ?? false;
}
