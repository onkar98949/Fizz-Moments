"use client";

import { PinDropLandmark } from "./variants/pin-drop";
import type { LandmarkMemoryData } from "./config";
import type { SceneRendererProps } from "../types";

export function LandmarkMemoryRenderer({ data }: SceneRendererProps<LandmarkMemoryData>) {
  return <PinDropLandmark data={data} />;
}
