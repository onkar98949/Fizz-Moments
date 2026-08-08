"use client";

import { DepartureBoard } from "./variants/departure-board";
import type { BoardingTimelineData } from "./config";
import type { SceneRendererProps } from "../types";

export function BoardingTimelineRenderer({ data }: SceneRendererProps<BoardingTimelineData>) {
  return <DepartureBoard data={data} />;
}
