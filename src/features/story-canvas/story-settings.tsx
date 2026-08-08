"use client";

import { useEffect, useState } from "react";
import { ChevronDown, Music, Pause, Play, RefreshCw, Settings2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MusicCard } from "@/components/shared/music-card";
import { MUSIC_TRACKS, STORY_LIMITS } from "@/constants/story";
import { cn } from "@/lib/utils";
import type { StoryCanvas } from "./use-story-canvas";

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

function SelectedTrack({ label, src, onReplace, onRemove }: { label: string; src: string; onReplace: () => void; onRemove: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const duration = useTrackDuration(src);

  function togglePreview() {
    const audio = new Audio(src);
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    audio.play().catch(() => setIsPlaying(false));
    audio.addEventListener("ended", () => setIsPlaying(false));
    setIsPlaying(true);
  }

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
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{duration ? formatDuration(duration) : "…"}</span>
      </div>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Replace track" onClick={onReplace} className="rounded-full">
        <RefreshCw className="size-3.5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Remove track"
        onClick={onRemove}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
      >
        <X className="size-3.5" />
      </Button>
    </div>
  );
}

export function StorySettings({ canvas }: { canvas: StoryCanvas }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showMusicPicker, setShowMusicPicker] = useState(false);
  const activeTrack = MUSIC_TRACKS.find((t) => t.value === canvas.music);

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border shadow-soft">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-center gap-2.5">
          <span className="bg-secondary flex size-9 items-center justify-center rounded-xl">
            <Settings2 className="text-muted-foreground size-4" />
          </span>
          <div className="flex flex-col">
            <span className="font-medium">Story Settings</span>
            <span className="text-muted-foreground truncate text-xs">
              {canvas.recipientName ? `For ${canvas.recipientName}` : "Title, recipient, and music"}
            </span>
          </div>
        </div>
        <ChevronDown className={cn("text-muted-foreground size-4 shrink-0 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen ? (
        <div className="flex flex-col gap-4 px-5 pb-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-title">Title</Label>
            <Input
              id="story-title"
              maxLength={STORY_LIMITS.TITLE_MAX_LENGTH}
              value={canvas.title}
              onChange={(e) => canvas.setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-subtitle">Subtitle (optional)</Label>
            <Input
              id="story-subtitle"
              maxLength={STORY_LIMITS.SUBTITLE_MAX_LENGTH}
              value={canvas.subtitle}
              onChange={(e) => canvas.setSubtitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="story-recipient">Recipient&apos;s name</Label>
            <Input
              id="story-recipient"
              maxLength={STORY_LIMITS.RECIPIENT_NAME_MAX_LENGTH}
              value={canvas.recipientName}
              onChange={(e) => canvas.setRecipientName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Music</Label>
            {activeTrack && !showMusicPicker ? (
              <SelectedTrack
                label={activeTrack.label}
                src={activeTrack.src}
                onReplace={() => setShowMusicPicker(true)}
                onRemove={() => canvas.setMusic(null)}
              />
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowMusicPicker((v) => !v)}
                className="w-full justify-start rounded-lg font-normal"
              >
                <Music className="size-4" />
                Choose a track
              </Button>
            )}
            {showMusicPicker ? (
              <div className="flex flex-col gap-2 pt-1">
                {MUSIC_TRACKS.map((track) => (
                  <MusicCard
                    key={track.value}
                    value={track.value}
                    label={track.label}
                    mood={track.mood}
                    src={track.src}
                    selected={canvas.music === track.value}
                    onSelect={(value) => {
                      canvas.setMusic(value);
                      setShowMusicPicker(false);
                    }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
