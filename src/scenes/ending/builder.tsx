"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { STORY_LIMITS } from "@/constants/story";
import type { EndingData } from "./config";
import type { SceneBuilderProps } from "../types";

export function EndingBuilder({ data, onChange }: SceneBuilderProps<EndingData>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="ending-message">Closing message</Label>
      <Textarea
        id="ending-message"
        rows={5}
        placeholder="With love, always."
        maxLength={STORY_LIMITS.MESSAGE_MAX_LENGTH}
        value={data.closingMessage}
        onChange={(e) => onChange({ closingMessage: e.target.value })}
      />
    </div>
  );
}
