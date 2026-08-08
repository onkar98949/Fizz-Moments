"use client";

import { KeyCardCheckIn } from "./variants/key-card";
import type { HotelCheckInData } from "./config";
import type { SceneRendererProps } from "../types";

export function HotelCheckInRenderer({ data }: SceneRendererProps<HotelCheckInData>) {
  return <KeyCardCheckIn data={data} />;
}
