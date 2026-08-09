"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/** Gates the "Share" action behind sign-in: guests are sent to log in,
 *  landing back on this exact editor afterward (via `next`); signed-in
 *  users see the share dialog immediately. The `share=1` marker left in
 *  the URL after that redirect auto-opens the dialog once, then is
 *  stripped so refreshing the page doesn't reopen it.
 *
 *  `save` is always awaited first — a guest who hasn't hit Save yet only
 *  has their edits in local state, and a redirect to /login would throw
 *  that away. Saving before either opening the dialog or redirecting
 *  means the link (and the "come back here" URL) always reflects what's
 *  actually on screen. If the save fails, we don't redirect or share —
 *  the editor's own toast already told them why, so the fix is to try
 *  again, not to lose the link. */
export function useGatedShare(isSignedIn: boolean, save: () => Promise<boolean>) {
  const [open, setOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("share") === "1") {
      setOpen(true);
      router.replace(pathname);
    }
  }, [pathname, router]);

  async function requestShare() {
    setIsPreparing(true);
    const saved = await save();
    setIsPreparing(false);
    if (!saved) return;

    if (isSignedIn) {
      setOpen(true);
    } else {
      router.push(`/login?next=${encodeURIComponent(`${pathname}?share=1`)}`);
    }
  }

  return { open, setOpen, requestShare, isPreparing };
}
