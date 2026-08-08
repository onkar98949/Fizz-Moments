import type { TimelineData } from "./config";
import type { SceneRendererProps } from "../types";
import { CascadeTimeline } from "./variants/cascade";

export function TimelineRenderer({ data }: SceneRendererProps<TimelineData>) {
  return <CascadeTimeline data={data} />;
}
