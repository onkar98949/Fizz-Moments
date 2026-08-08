"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { STORY_LIMITS } from "@/constants/story";
import type { LetterData } from "./config";
import type { SceneBuilderProps } from "../types";

export function LetterBuilder({ data, onChange }: SceneBuilderProps<LetterData>) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="letter-message">Your letter</Label>
      <Textarea
        id="letter-message"
        rows={8}
        placeholder="Write from the heart…"
        maxLength={STORY_LIMITS.MESSAGE_MAX_LENGTH}
        value={data.message}
        onChange={(e) => onChange({ message: e.target.value })}
      />
      <span className="text-muted-foreground self-end text-xs">
        {data.message.length}/{STORY_LIMITS.MESSAGE_MAX_LENGTH}
      </span>
    </div>
  );
}
