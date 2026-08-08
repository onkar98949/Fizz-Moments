"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactionBar } from "@/components/shared/reaction-bar";
import { MUSIC_TRACKS } from "@/constants/story";
import { getSceneDurationMs, isTerminalScene } from "@/scenes/schema";
import { getSceneDefinition } from "@/scenes/registry";
import type { ReactionType, StoryData } from "@/types/story";
import { ProgressDashes } from "./progress-dashes";
import { cn } from "@/lib/utils";

type StoryPlayerProps = {
  story: StoryData;
  onReact?: (reaction: ReactionType) => void | Promise<void>;
  className?: string;
};

export function StoryPlayer({ story, onReact, className }: StoryPlayerProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scene = story.scenes[sceneIndex];
  const definition = scene ? getSceneDefinition(scene.scene) : undefined;
  const isTerminal = scene ? isTerminalScene(scene) : true;
  const durationMs = scene ? getSceneDurationMs(scene) : 0;

  const storyContext = {
    title: story.title,
    subtitle: story.subtitle,
    recipientName: story.recipientName,
  };

  useEffect(() => {
    if (!story.music) return;
    const track = MUSIC_TRACKS.find((t) => t.value === story.music);
    if (!track) return;
    const audio = new Audio(track.src);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [story.music]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  function goNext() {
    setSceneIndex((i) => Math.min(i + 1, story.scenes.length - 1));
  }

  function goPrev() {
    setSceneIndex((i) => Math.max(i - 1, 0));
  }

  function replay() {
    setSceneIndex(0);
    audioRef.current?.play().catch(() => {});
  }

  useEffect(() => {
    if (isTerminal || durationMs <= 0) return;
    const timer = setTimeout(goNext, durationMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneIndex, isTerminal, durationMs]);

  if (!scene) {
    return (
      <div
        className={cn(
          "bg-secondary flex aspect-[9/16] w-full max-w-sm items-center justify-center rounded-[2rem]",
          className,
        )}
      >
        <p className="text-muted-foreground text-sm">This story has no scenes yet.</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-soft-lg select-none",
        className,
      )}
    >
      {!isTerminal && (
        <ProgressDashes
          count={story.scenes.length}
          activeIndex={sceneIndex}
          activeDurationMs={durationMs}
          paused={false}
        />
      )}

      <button
        type="button"
        aria-label="Toggle sound"
        onClick={() => setIsMuted((m) => !m)}
        className="absolute top-8 right-3 z-20 flex size-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm"
      >
        {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>

      <AnimatePresence mode="wait">
        {(definition?.config.transitionIn ?? "cut") === "fade" ? (
          <motion.div
            key={sceneIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0"
          >
            {definition ? (
              <definition.Renderer data={scene.data} variant={scene.variant} story={storyContext} />
            ) : (
              <div className="bg-secondary h-full w-full" />
            )}
          </motion.div>
        ) : (
          // Hard cut: no player-level fade — the scene's own entrance choreography is the transition.
          <div key={sceneIndex} className="absolute inset-0">
            {definition ? (
              <definition.Renderer data={scene.data} variant={scene.variant} story={storyContext} />
            ) : (
              <div className="bg-secondary h-full w-full" />
            )}
          </div>
        )}
      </AnimatePresence>

      {isTerminal && (
        <div className="absolute inset-x-0 bottom-10 z-20 flex flex-col items-center gap-4 px-6">
          {onReact ? <ReactionBar onReact={onReact} /> : null}
          <Button variant="outline" onClick={replay} className="rounded-full bg-white/90">
            <RotateCcw className="size-4" />
            Replay
          </Button>
        </div>
      )}

      {!isTerminal && (
        <div className="absolute inset-0 z-10 flex">
          <button type="button" aria-label="Previous" className="h-full w-1/3" onClick={goPrev} />
          <button type="button" aria-label="Next" className="h-full w-2/3" onClick={goNext} />
        </div>
      )}
    </div>
  );
}
