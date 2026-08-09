"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

type ShareLinksProps = {
  publicPath: string;
  editPath: string;
};

function useCopyState() {
  const [copied, setCopied] = useState(false);

  async function copy(path: string) {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return { copied, copy };
}

/** The public link is the whole point of this dialog, so it gets the
 *  primary treatment — one integrated field-and-button control, the full
 *  URL filled in client-side after mount (safe against hydration, and the
 *  dialog only ever mounts client-side anyway). The edit link is real but
 *  secondary — a quiet text action underneath, not a second identical row
 *  competing for the same attention. */
export function ShareLinks({ publicPath, editPath }: ShareLinksProps) {
  const [origin, setOrigin] = useState("");
  const share = useCopyState();
  const edit = useCopyState();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="flex min-w-0 flex-col gap-2">
        <span className="text-muted-foreground text-eyebrow font-medium uppercase">Share with them</span>
        <div className="border-border bg-secondary/40 flex min-w-0 items-center gap-2 rounded-full border py-1.5 pr-1.5 pl-4">
          <span className="text-foreground/80 min-w-0 flex-1 truncate text-sm">
            {origin.replace(/^https?:\/\//, "")}
            {publicPath}
          </span>
          <button
            type="button"
            onClick={() => share.copy(publicPath)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
              share.copied
                ? "bg-accent text-primary-active"
                : "bg-primary text-primary-foreground hover:bg-primary-hover",
            )}
          >
            <AnimatePresence mode="wait" initial={false}>
              {share.copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="size-3.5" />
                  Copied
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="size-3.5" />
                  Copy
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => edit.copy(editPath)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start text-sm font-medium transition-colors duration-200"
      >
        <Lock className="size-3.5" strokeWidth={1.75} />
        {edit.copied ? "Edit link copied" : "Copy your private edit link"}
      </button>
    </div>
  );
}
