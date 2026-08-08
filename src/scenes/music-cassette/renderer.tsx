"use client";

import { PlayerCassette } from "./variants/player";
import type { MusicCassetteData } from "./config";
import type { SceneRendererProps } from "../types";

export function MusicCassetteRenderer({ data }: SceneRendererProps<MusicCassetteData>) {
  return <PlayerCassette data={data} />;
}
