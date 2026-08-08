"use client";

import { BubblesConversation } from "./variants/bubbles";
import type { TextConversationData } from "./config";
import type { SceneRendererProps } from "../types";

export function TextConversationRenderer({ data }: SceneRendererProps<TextConversationData>) {
  return <BubblesConversation data={data} />;
}
