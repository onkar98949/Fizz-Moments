"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

/** Gates the "Share" action behind sign-in: guests are sent to log in,
 *  landing back on this exact editor afterward (via `next`); signed-in
 *  users see the share dialog immediately. The `share=1` marker left in
 *  the URL after that redirect auto-opens the dialog once, then is
 *  stripped so refreshing the page doesn't reopen it. */
export function useGatedShare(isSignedIn: boolean) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("share") === "1") {
      setOpen(true);
      router.replace(pathname);
    }
  }, [pathname, router]);

  function requestShare() {
    if (isSignedIn) {
      setOpen(true);
    } else {
      router.push(`/login?next=${encodeURIComponent(`${pathname}?share=1`)}`);
    }
  }

  return { open, setOpen, requestShare };
}
