"use client";

import { MenuFoodMemory } from "./variants/menu";
import type { FoodMemoryData } from "./config";
import type { SceneRendererProps } from "../types";

export function FoodMemoryRenderer({ data }: SceneRendererProps<FoodMemoryData>) {
  return <MenuFoodMemory data={data} />;
}
