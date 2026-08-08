"use client";

import { useEffect, useState } from "react";
import { Pause, Play, RefreshCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MusicCard } from "@/components/shared/music-card";
import { MUSIC_TRACKS } from "@/constants/story";
import type { TemplateEditor } from "../use-template-editor";

function useTrackDuration(src: string | undefined) {
  const [duration, setDuration] = useState<number | null>(null);
  useEffect(() => {
    if (!src) {
      setDuration(null);
      return;
    }
    const audio = new Audio(src);
    const onLoaded = () => setDuration(audio.duration);
    audio.addEventListener("loadedmetadata", onLoaded);
    return () => audio.removeEventListener("loadedmetadata", onLoaded);
  }, [src]);
  return duration;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function MusicPanel({ music, setMusic }: TemplateEditor) {
  const [showPicker, setShowPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const activeTrack = MUSIC_TRACKS.find((t) => t.value === music);
  const duration = useTrackDuration(activeTrack?.src);

  function togglePreview() {
    if (!activeTrack) return;
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    const audio = new Audio(activeTrack.src);
    audio.play().catch(() => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    setIsPlaying(true);
  }

  if (activeTrack && !showPicker) {
    return (
      <div className="border-border bg-secondary/40 flex items-center gap-3 rounded-2xl border p-3">
        <button
          type="button"
          onClick={togglePreview}
          aria-label={isPlaying ? "Pause preview" : "Play preview"}
          className="bg-moment-gradient flex size-10 shrink-0 items-center justify-center rounded-full text-white"
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 translate-x-0.5" />}
        </button>
        <div className="flex flex-1 flex-col">
          <span className="font-medium">{activeTrack.label}</span>
          <span className="text-muted-foreground text-xs">{duration ? formatDuration(duration) : activeTrack.mood}</span>
        </div>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Replace track" onClick={() => setShowPicker(true)} className="rounded-full">
          <RefreshCw className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Remove track"
          onClick={() => setMusic(null)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {MUSIC_TRACKS.map((track) => (
        <MusicCard
          key={track.value}
          value={track.value}
          label={track.label}
          mood={track.mood}
          src={track.src}
          selected={music === track.value}
          onSelect={(value) => {
            setMusic(value);
            setShowPicker(false);
          }}
        />
      ))}
    </div>
  );
}
