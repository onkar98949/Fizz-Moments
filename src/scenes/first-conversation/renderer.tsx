"use client";

import { BubblesConversation } from "../text-conversation/variants/bubbles";
import type { FirstConversationData } from "./config";
import type { SceneRendererProps } from "../types";

export function FirstConversationRenderer({ data }: SceneRendererProps<FirstConversationData>) {
  return <BubblesConversation data={data} />;
}
