"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

type MusicCardProps = {
  value: string;
  label: string;
  mood: string;
  src: string;
  selected: boolean;
  onSelect: (value: string) => void;
};

export function MusicCard({ value, label, mood, src, selected, onSelect }: MusicCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  function togglePreview(event: React.MouseEvent) {
    event.stopPropagation();

    if (!audioRef.current) {
      audioRef.current = new Audio(src);
      audioRef.current.addEventListener("ended", () => setIsPlaying(false));
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(value)}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors",
        selected ? "border-primary bg-accent/40 shadow-soft" : "border-border hover:border-primary/40",
      )}
    >
      <span
        onClick={togglePreview}
        role="button"
        aria-label={isPlaying ? "Pause preview" : "Play preview"}
        className="bg-moment-gradient flex size-10 shrink-0 items-center justify-center rounded-full text-white"
      >
        {isPlaying ? <Pause className="size-4" /> : <Play className="size-4 translate-x-0.5" />}
      </span>
      <span className="flex flex-1 flex-col">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">{mood}</span>
      </span>
      {selected ? (
        <span className="bg-primary text-primary-foreground flex size-5 shrink-0 items-center justify-center rounded-full">
          <Check className="size-3" />
        </span>
      ) : null}
    </motion.button>
  );
}
