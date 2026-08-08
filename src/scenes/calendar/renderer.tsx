import type { CalendarData } from "./config";
import type { SceneRendererProps } from "../types";
import { ClassicCalendar } from "./variants/classic";

export function CalendarRenderer({ data }: SceneRendererProps<CalendarData>) {
  return <ClassicCalendar data={data} />;
}
