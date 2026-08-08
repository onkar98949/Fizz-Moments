"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressDashes } from "@/components/shared/story-player/progress-dashes";
import { AnimatedElement } from "@/features/editor/elements/animated-element";
import { MUSIC_TRACKS } from "@/constants/story";
import type { TemplateProjectData } from "@/types/template";
import { cn } from "@/lib/utils";

type TemplatePlayerProps = {
  project: TemplateProjectData;
  className?: string;
};

export function TemplatePlayer({ project, className }: TemplatePlayerProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scene = project.scenes[sceneIndex];

  useEffect(() => {
    if (!project.music) return;
    const track = MUSIC_TRACKS.find((t) => t.value === project.music);
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
  }, [project.music]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = isMuted;
  }, [isMuted]);

  useEffect(() => {
    if (isDone || !scene) return;
    const timer = setTimeout(() => {
      setSceneIndex((i) => {
        if (i + 1 >= project.scenes.length) {
          setIsDone(true);
          return i;
        }
        return i + 1;
      });
    }, scene.durationMs);
    return () => clearTimeout(timer);
  }, [sceneIndex, scene, isDone, project.scenes.length]);

  function replay() {
    setSceneIndex(0);
    setIsDone(false);
    audioRef.current?.play().catch(() => {});
  }

  return (
    <div
      className={cn(
        "relative aspect-[9/16] w-full max-w-sm overflow-hidden rounded-[2rem] shadow-soft-lg select-none",
        className,
      )}
    >
      {!isDone && (
        <ProgressDashes count={project.scenes.length} activeIndex={sceneIndex} activeDurationMs={scene?.durationMs ?? null} paused={false} />
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
        {isDone ? (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-secondary absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center"
          >
            <p className="font-script text-primary-active text-4xl">The end</p>
            <Button variant="outline" onClick={replay} className="rounded-full">
              <RotateCcw className="size-4" />
              Replay
            </Button>
          </motion.div>
        ) : scene ? (
          <motion.div
            key={sceneIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="@container absolute inset-0"
            style={
              scene.background.type === "image"
                ? { backgroundImage: `url(${scene.background.value})`, backgroundSize: "cover", backgroundPosition: "center" }
                : scene.background.type === "gradient"
                  ? { backgroundImage: scene.background.value }
                  : { backgroundColor: scene.background.value }
            }
          >
            {scene.elements.map((element, index) => (
              <AnimatedElement key={element.id} element={element} index={index} />
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
