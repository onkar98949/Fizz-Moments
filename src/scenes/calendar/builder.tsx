"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { STORY_LIMITS } from "@/constants/story";
import type { CalendarData } from "./config";
import type { SceneBuilderProps } from "../types";

export function CalendarBuilder({ data, onChange }: SceneBuilderProps<CalendarData>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="calendar-date">Date</Label>
        <Input
          id="calendar-date"
          type="date"
          value={data.date}
          onChange={(e) => onChange({ ...data, date: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="calendar-title">Title</Label>
        <Input
          id="calendar-title"
          placeholder="e.g. The day we said yes"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="calendar-caption">Caption (optional)</Label>
        <Input
          id="calendar-caption"
          maxLength={STORY_LIMITS.CAPTION_MAX_LENGTH}
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </div>
    </div>
  );
}
