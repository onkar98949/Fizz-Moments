"use client";

import Image from "next/image";
import { AlertTriangle, ArrowDown, ArrowUp, Check, CircleDashed, Copy, Eye, GripVertical, Timer, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getSceneDefinition } from "@/scenes/registry";
import { getSceneDurationMs } from "@/scenes/schema";
import { cn } from "@/lib/utils";
import { countPhotos, firstPhotoUrl } from "./scene-media";
import { getSceneStatus } from "./scene-status";
import type { SceneInstance } from "@/types/story";

type SceneRowProps = {
  scene: SceneInstance;
  index: number;
  total: number;
  isDragging: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDragPointerDown: (e: React.PointerEvent) => void;
};

function summarize(scene: SceneInstance): string {
  switch (scene.scene) {
    case "cover":
      return "Opening title card";
    case "timeline":
      return `${scene.data.moments.length} moment${scene.data.moments.length === 1 ? "" : "s"}`;
    case "polaroid":
      return scene.data.caption || "One featured photo";
    case "letter":
      return scene.data.message ? `${scene.data.message.slice(0, 40)}…` : "Not written yet";
    case "journey":
      return scene.data.from && scene.data.to ? `${scene.data.from} → ${scene.data.to}` : "Not set yet";
    case "calendar":
      return scene.data.title || "Not set yet";
    case "ending":
      return scene.data.closingMessage ? `${scene.data.closingMessage.slice(0, 40)}…` : "Not written yet";
    case "text-conversation":
      return `${scene.data.messages.length} message${scene.data.messages.length === 1 ? "" : "s"}`;
    case "memory-map":
      return `${scene.data.stops.length} stop${scene.data.stops.length === 1 ? "" : "s"}`;
    case "scrapbook":
      return `${scene.data.photos.length} photo${scene.data.photos.length === 1 ? "" : "s"}`;
    case "music-cassette":
      return scene.data.songTitle || "Not set yet";
    case "cinema-ticket":
      return scene.data.movieTitle || "Not set yet";
    case "memory-box":
      return `${scene.data.photos.length} keepsake${scene.data.photos.length === 1 ? "" : "s"}`;
    case "constellation":
      return scene.data.title || "Not set yet";
    case "camera-roll":
      return `${scene.data.photos.length} photo${scene.data.photos.length === 1 ? "" : "s"}`;
    case "boarding-timeline":
      return `${scene.data.legs.length} destination${scene.data.legs.length === 1 ? "" : "s"}`;
    case "memory-reel":
      return scene.data.caption || "One featured photo";
    case "first-glance":
      return scene.data.nameA && scene.data.nameB ? `${scene.data.nameA} & ${scene.data.nameB}` : "Not set yet";
    case "first-date":
      return scene.data.caption || scene.data.location || "One featured photo";
    case "first-conversation":
      return `${scene.data.messages.length} message${scene.data.messages.length === 1 ? "" : "s"}`;
    case "the-promise":
      return scene.data.quote ? `${scene.data.quote.slice(0, 40)}…` : "Not written yet";
    case "heart-collage":
      return `${scene.data.photos.length} photo${scene.data.photos.length === 1 ? "" : "s"}`;
    case "forever":
      return scene.data.endingMessage ? `${scene.data.endingMessage.slice(0, 40)}…` : "Not written yet";
    case "boarding-pass":
      return scene.data.departure && scene.data.destination ? `${scene.data.departure} → ${scene.data.destination}` : "Not set yet";
    case "route-map":
      return `${scene.data.stops.length} stop${scene.data.stops.length === 1 ? "" : "s"}`;
    case "hotel-check-in":
      return scene.data.hotelName || "Not set yet";
    case "landmark-memory":
      return scene.data.landmarkName || "Not set yet";
    case "food-memory":
      return scene.data.restaurant || "Not set yet";
    case "sunset-memory":
      return scene.data.caption || "One featured photo";
    case "love-letter":
      return scene.data.recipientName ? `To ${scene.data.recipientName}` : "Not set yet";
    default:
      return "";
  }
}

function StatusBadge({ scene }: { scene: SceneInstance }) {
  const status = getSceneStatus(scene);
  if (status.kind === "complete") {
    return (
      <Badge className="bg-accent text-accent-foreground gap-1 border-0">
        <Check className="size-3" />
        Ready
      </Badge>
    );
  }
  if (status.kind === "empty") {
    return (
      <Badge variant="secondary" className="gap-1">
        <CircleDashed className="size-3" />
        Empty scene
      </Badge>
    );
  }
  return (
    <Badge className="border-0 bg-[color-mix(in_oklch,var(--warm-yellow)_35%,transparent)] text-[#7a5b12] gap-1">
      <AlertTriangle className="size-3" />
      {status.message}
    </Badge>
  );
}

export function SceneRow({
  scene,
  index,
  total,
  isDragging,
  onSelect,
  onPreview,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragPointerDown,
}: SceneRowProps) {
  const definition = getSceneDefinition(scene.scene);
  const thumbnail = firstPhotoUrl(scene.data);
  const photoCount = countPhotos(scene.data);
  const durationSec = Math.round(getSceneDurationMs(scene) / 1000);
  const variantLabel = definition?.config.variants.find((v) => v.id === scene.variant)?.label;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ layout: { type: "spring", stiffness: 380, damping: 32 }, default: { duration: 0.2 } }}
      className={cn(
        "bg-card shadow-soft hover:shadow-soft-lg overflow-hidden rounded-2xl transition-shadow duration-300",
        isDragging && "shadow-glow-primary opacity-60",
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <button
          type="button"
          aria-label="Drag to reorder"
          onPointerDown={onDragPointerDown}
          className="text-muted-foreground mt-1 flex size-6 shrink-0 touch-none items-center justify-center rounded-lg active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={onSelect}
          aria-label={`Edit ${definition?.config.label ?? "scene"}`}
          className="bg-secondary relative size-16 shrink-0 overflow-hidden rounded-xl"
        >
          {thumbnail ? (
            <Image src={thumbnail} alt="" fill sizes="64px" className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl">{definition?.config.emoji ?? "✨"}</span>
          )}
        </button>

        <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 flex-col gap-1.5 text-left">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium">
              {definition?.config.emoji} {definition?.config.label ?? scene.scene}
            </span>
            <StatusBadge scene={scene} />
          </div>
          <p className="text-muted-foreground line-clamp-1 text-xs">{summarize(scene)}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="gap-1">
              <Timer className="size-3" />
              {durationSec} sec
            </Badge>
            {variantLabel ? <Badge variant="secondary">{variantLabel}</Badge> : null}
            {photoCount > 0 ? (
              <Badge variant="secondary">
                {photoCount} Photo{photoCount === 1 ? "" : "s"}
              </Badge>
            ) : null}
          </div>
        </button>
      </div>

      <div className="bg-secondary/40 flex items-center justify-end gap-0.5 px-2 py-1.5">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Preview story" onClick={onPreview} className="rounded-full">
          <Eye className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move up"
          disabled={index === 0}
          onClick={onMoveUp}
          className="rounded-full"
        >
          <ArrowUp className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move down"
          disabled={index === total - 1}
          onClick={onMoveDown}
          className="rounded-full"
        >
          <ArrowDown className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Duplicate scene" onClick={onDuplicate} className="rounded-full">
          <Copy className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Delete scene"
          onClick={onDelete}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
