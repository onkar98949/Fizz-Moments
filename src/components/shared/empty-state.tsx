"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "border-border/60 bg-secondary/30 flex flex-col items-center gap-4 rounded-xl border border-dashed px-8 py-16 text-center",
        className,
      )}
    >
      {icon ? (
        <motion.div
          className="text-primary text-4xl"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {icon}
        </motion.div>
      ) : null}
      <div className="flex flex-col gap-1.5">
        <p className="font-display text-card-title">{title}</p>
        {description ? <p className="text-muted-foreground text-caption max-w-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
