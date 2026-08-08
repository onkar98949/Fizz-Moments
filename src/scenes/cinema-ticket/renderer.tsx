"use client";

import { CurtainsTicket } from "./variants/curtains";
import type { CinemaTicketData } from "./config";
import type { SceneRendererProps } from "../types";

export function CinemaTicketRenderer({ data }: SceneRendererProps<CinemaTicketData>) {
  return <CurtainsTicket data={data} />;
}
