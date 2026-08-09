"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Clapperboard, Eye, EyeOff, Music2, Share2, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSceneDurationMs } from "@/scenes/schema";
import { countPhotos } from "./scene-media";
import type { StoryCanvas } from "./use-story-canvas";
import type { AutosaveStatus } from "./use-autosave";

function formatRelativeTime(ms: number): string {
  const diff = Date.now() - ms;
  if (diff < 5000) return "just now";
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

function AutosaveIndicator({ status, lastSavedAt }: { status: AutosaveStatus; lastSavedAt: number | null }) {
  // Ticks every few seconds purely to re-render "Xs ago" — no network activity.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => forceTick((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, []);

  if (status === "saving") {
    return (
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <span className="border-muted-foreground/40 border-t-muted-foreground size-3 animate-spin rounded-full border-2" />
        Saving…
      </span>
    );
  }
  if (status === "pending") {
    return <span className="text-muted-foreground text-xs">Unsaved changes</span>;
  }
  if (status === "error") {
    return <span className="text-muted-foreground text-xs">Not saved yet</span>;
  }
  if (status === "saved" && lastSavedAt) {
    return (
      <span className="text-primary-active flex items-center gap-1 text-xs">
        <span className="bg-primary-active size-1.5 rounded-full" />
        Saved {formatRelativeTime(lastSavedAt)}
      </span>
    );
  }
  return null;
}

function StatChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="bg-secondary text-muted-foreground flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
      {icon}
      {children}
    </span>
  );
}

export function EditorHeader({
  canvas,
  onShare,
  shareDisabled,
}: {
  canvas: StoryCanvas;
  onShare: () => void;
  shareDisabled?: boolean;
}) {
  const photoCount = canvas.scenes.reduce((sum, s) => sum + countPhotos(s.data), 0);
  const totalSeconds = Math.round(canvas.scenes.reduce((sum, s) => sum + getSceneDurationMs(s), 0) / 1000);

  return (
    <header className="bg-background/90 shadow-soft sticky top-0 z-30 -mx-5 px-5 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Exit editor"
          nativeButton={false}
          className="shrink-0 rounded-full"
          render={
            <Link href="/">
              <ArrowLeft className="size-4" />
            </Link>
          }
        />

        <input
          value={canvas.title}
          onChange={(e) => canvas.setTitle(e.target.value)}
          placeholder="Untitled Story"
          aria-label="Story title"
          className="font-display placeholder:text-muted-foreground/50 hover:bg-secondary/60 focus:bg-secondary/60 min-w-0 flex-1 rounded-lg bg-transparent px-2 py-1 text-lg font-medium outline-none transition-colors"
        />

        <div className="hidden shrink-0 sm:block">
          <AutosaveIndicator status={canvas.autosaveStatus} lastSavedAt={canvas.lastSavedAt} />
        </div>

        <Button
          variant="outline"
          size="sm"
          aria-label={canvas.isPreviewOpen ? "Hide preview" : "Preview"}
          onClick={() => canvas.setIsPreviewOpen((v) => !v)}
          className="shrink-0 rounded-full"
        >
          {canvas.isPreviewOpen ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          <span className="hidden sm:inline">{canvas.isPreviewOpen ? "Hide" : "Preview"}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-label="Share"
          onClick={onShare}
          disabled={shareDisabled}
          className="shrink-0 rounded-full"
        >
          <Share2 className="size-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button size="sm" onClick={() => canvas.save()} disabled={canvas.isSaving} className="shrink-0 rounded-full">
          {canvas.isSaving ? "Saving…" : "Save"}
        </Button>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-2xl flex-wrap items-center gap-1.5">
        <StatChip icon={<Camera className="size-3" />}>{photoCount} Photo{photoCount === 1 ? "" : "s"}</StatChip>
        <StatChip icon={<Clapperboard className="size-3" />}>{canvas.scenes.length} Scene{canvas.scenes.length === 1 ? "" : "s"}</StatChip>
        <StatChip icon={<Timer className="size-3" />}>{totalSeconds} sec</StatChip>
        {canvas.music ? (
          <StatChip icon={<Music2 className="size-3" />}>1 Music Track</StatChip>
        ) : null}
        <span className="sm:hidden">
          <AutosaveIndicator status={canvas.autosaveStatus} lastSavedAt={canvas.lastSavedAt} />
        </span>
      </div>
    </header>
  );
}
