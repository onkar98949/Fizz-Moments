"use client";

import { ScrollCameraRoll } from "./variants/scroll";
import type { CameraRollData } from "./config";
import type { SceneRendererProps } from "../types";

export function CameraRollRenderer({ data }: SceneRendererProps<CameraRollData>) {
  return <ScrollCameraRoll data={data} />;
}
