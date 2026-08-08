import { coverConfig } from "./cover/config";
import { CoverBuilder } from "./cover/builder";
import { CoverRenderer } from "./cover/renderer";
import { timelineConfig } from "./timeline/config";
import { TimelineBuilder } from "./timeline/builder";
import { TimelineRenderer } from "./timeline/renderer";
import { polaroidConfig } from "./polaroid/config";
import { PolaroidBuilder } from "./polaroid/builder";
import { PolaroidRenderer } from "./polaroid/renderer";
import { letterConfig } from "./letter/config";
import { LetterBuilder } from "./letter/builder";
import { LetterRenderer } from "./letter/renderer";
import { journeyConfig } from "./journey/config";
import { JourneyBuilder } from "./journey/builder";
import { JourneyRenderer } from "./journey/renderer";
import { calendarConfig } from "./calendar/config";
import { CalendarBuilder } from "./calendar/builder";
import { CalendarRenderer } from "./calendar/renderer";
import { endingConfig } from "./ending/config";
import { EndingBuilder } from "./ending/builder";
import { EndingRenderer } from "./ending/renderer";
import { textConversationConfig } from "./text-conversation/config";
import { TextConversationBuilder } from "./text-conversation/builder";
import { TextConversationRenderer } from "./text-conversation/renderer";
import { memoryMapConfig } from "./memory-map/config";
import { MemoryMapBuilder } from "./memory-map/builder";
import { MemoryMapRenderer } from "./memory-map/renderer";
import { scrapbookConfig } from "./scrapbook/config";
import { ScrapbookBuilder } from "./scrapbook/builder";
import { ScrapbookRenderer } from "./scrapbook/renderer";
import { musicCassetteConfig } from "./music-cassette/config";
import { MusicCassetteBuilder } from "./music-cassette/builder";
import { MusicCassetteRenderer } from "./music-cassette/renderer";
import { cinemaTicketConfig } from "./cinema-ticket/config";
import { CinemaTicketBuilder } from "./cinema-ticket/builder";
import { CinemaTicketRenderer } from "./cinema-ticket/renderer";
import { memoryBoxConfig } from "./memory-box/config";
import { MemoryBoxBuilder } from "./memory-box/builder";
import { MemoryBoxRenderer } from "./memory-box/renderer";
import { constellationConfig } from "./constellation/config";
import { ConstellationBuilder } from "./constellation/builder";
import { ConstellationRenderer } from "./constellation/renderer";
import { cameraRollConfig } from "./camera-roll/config";
import { CameraRollBuilder } from "./camera-roll/builder";
import { CameraRollRenderer } from "./camera-roll/renderer";
import { boardingTimelineConfig } from "./boarding-timeline/config";
import { BoardingTimelineBuilder } from "./boarding-timeline/builder";
import { BoardingTimelineRenderer } from "./boarding-timeline/renderer";
import { memoryReelConfig } from "./memory-reel/config";
import { MemoryReelBuilder } from "./memory-reel/builder";
import { MemoryReelRenderer } from "./memory-reel/renderer";
import { firstGlanceConfig } from "./first-glance/config";
import { FirstGlanceBuilder } from "./first-glance/builder";
import { FirstGlanceRenderer } from "./first-glance/renderer";
import { firstDateConfig } from "./first-date/config";
import { FirstDateBuilder } from "./first-date/builder";
import { FirstDateRenderer } from "./first-date/renderer";
import { firstConversationConfig } from "./first-conversation/config";
import { FirstConversationBuilder } from "./first-conversation/builder";
import { FirstConversationRenderer } from "./first-conversation/renderer";
import { thePromiseConfig } from "./the-promise/config";
import { ThePromiseBuilder } from "./the-promise/builder";
import { ThePromiseRenderer } from "./the-promise/renderer";
import { heartCollageConfig } from "./heart-collage/config";
import { HeartCollageBuilder } from "./heart-collage/builder";
import { HeartCollageRenderer } from "./heart-collage/renderer";
import { foreverConfig } from "./forever/config";
import { ForeverBuilder } from "./forever/builder";
import { ForeverRenderer } from "./forever/renderer";
import { boardingPassConfig } from "./boarding-pass/config";
import { BoardingPassBuilder } from "./boarding-pass/builder";
import { BoardingPassRenderer } from "./boarding-pass/renderer";
import { routeMapConfig } from "./route-map/config";
import { RouteMapBuilder } from "./route-map/builder";
import { RouteMapRenderer } from "./route-map/renderer";
import { hotelCheckInConfig } from "./hotel-check-in/config";
import { HotelCheckInBuilder } from "./hotel-check-in/builder";
import { HotelCheckInRenderer } from "./hotel-check-in/renderer";
import { landmarkMemoryConfig } from "./landmark-memory/config";
import { LandmarkMemoryBuilder } from "./landmark-memory/builder";
import { LandmarkMemoryRenderer } from "./landmark-memory/renderer";
import { foodMemoryConfig } from "./food-memory/config";
import { FoodMemoryBuilder } from "./food-memory/builder";
import { FoodMemoryRenderer } from "./food-memory/renderer";
import { sunsetMemoryConfig } from "./sunset-memory/config";
import { SunsetMemoryBuilder } from "./sunset-memory/builder";
import { SunsetMemoryRenderer } from "./sunset-memory/renderer";
import { loveLetterConfig } from "./love-letter/config";
import { LoveLetterBuilder } from "./love-letter/builder";
import { LoveLetterRenderer } from "./love-letter/renderer";
import { LoveLetterThumbnail } from "./love-letter/thumbnail";
import type { SceneDefinition } from "./types";
import type { SceneName } from "./schema";

/**
 * `Record<SceneName, ...>` (not a plain array) is deliberate: it makes a
 * missing or misnamed scene entry a compile error instead of a silent
 * runtime lookup failure — "add a scene" = new folder + one entry here.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- see scenes/schema.ts SCENE_CONFIGS
const REGISTRY: Record<SceneName, SceneDefinition<any>> = {
  cover: { config: coverConfig, Builder: CoverBuilder, Renderer: CoverRenderer },
  timeline: { config: timelineConfig, Builder: TimelineBuilder, Renderer: TimelineRenderer },
  polaroid: { config: polaroidConfig, Builder: PolaroidBuilder, Renderer: PolaroidRenderer },
  letter: { config: letterConfig, Builder: LetterBuilder, Renderer: LetterRenderer },
  journey: { config: journeyConfig, Builder: JourneyBuilder, Renderer: JourneyRenderer },
  calendar: { config: calendarConfig, Builder: CalendarBuilder, Renderer: CalendarRenderer },
  ending: { config: endingConfig, Builder: EndingBuilder, Renderer: EndingRenderer },
  "text-conversation": { config: textConversationConfig, Builder: TextConversationBuilder, Renderer: TextConversationRenderer },
  "memory-map": { config: memoryMapConfig, Builder: MemoryMapBuilder, Renderer: MemoryMapRenderer },
  scrapbook: { config: scrapbookConfig, Builder: ScrapbookBuilder, Renderer: ScrapbookRenderer },
  "music-cassette": { config: musicCassetteConfig, Builder: MusicCassetteBuilder, Renderer: MusicCassetteRenderer },
  "cinema-ticket": { config: cinemaTicketConfig, Builder: CinemaTicketBuilder, Renderer: CinemaTicketRenderer },
  "memory-box": { config: memoryBoxConfig, Builder: MemoryBoxBuilder, Renderer: MemoryBoxRenderer },
  constellation: { config: constellationConfig, Builder: ConstellationBuilder, Renderer: ConstellationRenderer },
  "camera-roll": { config: cameraRollConfig, Builder: CameraRollBuilder, Renderer: CameraRollRenderer },
  "boarding-timeline": { config: boardingTimelineConfig, Builder: BoardingTimelineBuilder, Renderer: BoardingTimelineRenderer },
  "memory-reel": { config: memoryReelConfig, Builder: MemoryReelBuilder, Renderer: MemoryReelRenderer },
  "first-glance": { config: firstGlanceConfig, Builder: FirstGlanceBuilder, Renderer: FirstGlanceRenderer },
  "first-date": { config: firstDateConfig, Builder: FirstDateBuilder, Renderer: FirstDateRenderer },
  "first-conversation": { config: firstConversationConfig, Builder: FirstConversationBuilder, Renderer: FirstConversationRenderer },
  "the-promise": { config: thePromiseConfig, Builder: ThePromiseBuilder, Renderer: ThePromiseRenderer },
  "heart-collage": { config: heartCollageConfig, Builder: HeartCollageBuilder, Renderer: HeartCollageRenderer },
  forever: { config: foreverConfig, Builder: ForeverBuilder, Renderer: ForeverRenderer },
  "boarding-pass": { config: boardingPassConfig, Builder: BoardingPassBuilder, Renderer: BoardingPassRenderer },
  "route-map": { config: routeMapConfig, Builder: RouteMapBuilder, Renderer: RouteMapRenderer },
  "hotel-check-in": { config: hotelCheckInConfig, Builder: HotelCheckInBuilder, Renderer: HotelCheckInRenderer },
  "landmark-memory": { config: landmarkMemoryConfig, Builder: LandmarkMemoryBuilder, Renderer: LandmarkMemoryRenderer },
  "food-memory": { config: foodMemoryConfig, Builder: FoodMemoryBuilder, Renderer: FoodMemoryRenderer },
  "sunset-memory": { config: sunsetMemoryConfig, Builder: SunsetMemoryBuilder, Renderer: SunsetMemoryRenderer },
  "love-letter": {
    config: loveLetterConfig,
    Builder: LoveLetterBuilder,
    Renderer: LoveLetterRenderer,
    Thumbnail: LoveLetterThumbnail,
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SCENE_REGISTRY: SceneDefinition<any>[] = Object.values(REGISTRY);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSceneDefinition(sceneId: string): SceneDefinition<any> | undefined {
  return REGISTRY[sceneId as SceneName];
}
