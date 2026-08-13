"use client";

import { useState } from "react";

/** Opens the "Share" dialog once the current edits are saved — guests and
 *  signed-in users alike, no sign-in gate. (Login/signup are disabled;
 *  see src/app/login/page.tsx. This used to redirect guests to /login
 *  first, which would now silently dead-end at the homepage, so the gate
 *  was removed rather than left broken.) `isSignedIn` is accepted for
 *  call-site compatibility but no longer changes this behavior.
 *
 *  `save` is always awaited first — a guest who hasn't hit Save yet only
 *  has their edits in local state, and the share link needs to reflect
 *  what's actually on screen. If the save fails, we don't open the
 *  dialog — the editor's own toast already told them why, so the fix is
 *  to try again, not to share a stale link. */
export function useGatedShare(_isSignedIn: boolean, save: () => Promise<boolean>) {
  const [open, setOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);

  async function requestShare() {
    setIsPreparing(true);
    const saved = await save();
    setIsPreparing(false);
    if (!saved) return;

    setOpen(true);
  }

  return { open, setOpen, requestShare, isPreparing };
}
