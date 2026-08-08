import type { JourneyData } from "./config";
import type { SceneRendererProps } from "../types";
import { PlaneRouteJourney } from "./variants/plane-route";

export function JourneyRenderer({ data }: SceneRendererProps<JourneyData>) {
  return <PlaneRouteJourney data={data} />;
}
