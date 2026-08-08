"use client";

import { GoldenHourForever } from "./variants/golden-hour";
import type { ForeverData } from "./config";
import type { SceneRendererProps } from "../types";

export function ForeverRenderer({ data }: SceneRendererProps<ForeverData>) {
  return <GoldenHourForever data={data} />;
}
