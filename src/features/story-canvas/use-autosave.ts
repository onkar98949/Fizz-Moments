"use client";

import { useEffect, useRef, useState } from "react";

export type AutosaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

/**
 * Debounced autosave, silent by design — a failed autosave attempt (most
 * commonly: a scene is still mid-edit and doesn't satisfy its own schema
 * yet, which is normal, not exceptional) shouldn't interrupt anyone with a
 * toast every few seconds. The header reflects `status` instead; the
 * explicit Save button keeps its own toast feedback for a deliberate action.
 */
export function useAutosave(save: () => Promise<boolean>, watch: unknown, delayMs = 2500) {
  const [status, setStatus] = useState<AutosaveStatus>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const isFirstRun = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveRef = useRef(save);
  saveRef.current = save;

  const watchKey = JSON.stringify(watch);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    setStatus("pending");
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setStatus("saving");
      saveRef
        .current()
        .then((ok) => {
          if (ok) {
            setStatus("saved");
            setLastSavedAt(Date.now());
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [watchKey, delayMs]);

  return { status, lastSavedAt };
}
