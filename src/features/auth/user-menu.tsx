"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutGrid, LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth-actions";
import type { AuthUser } from "./types";

const EASE = [0.16, 1, 0.3, 1] as const;

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function UserMenu({ user }: { user: AuthUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="border-border hover:border-foreground/30 flex size-9 items-center justify-center overflow-hidden rounded-full border transition-colors duration-200"
      >
        {user.avatarUrl ? (
          <Image src={user.avatarUrl} alt="" width={36} height={36} className="size-full object-cover" />
        ) : (
          <span className="bg-secondary text-foreground/80 flex size-full items-center justify-center text-sm font-medium">
            {initial(user.name)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="border-border bg-card shadow-soft-lg absolute top-full right-0 mt-2 min-w-52 rounded-xl border p-2"
          >
            <div className="flex flex-col gap-0.5 px-2.5 py-2">
              <span className="text-foreground truncate text-sm font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">{user.email}</span>
            </div>
            <div className="bg-border my-1.5 h-px" />
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="text-foreground/80 hover:bg-secondary flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors duration-200"
            >
              <LayoutGrid className="size-3.5" strokeWidth={1.75} />
              My Creations
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-foreground/80 hover:bg-secondary flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors duration-200"
              >
                <LogOut className="size-3.5" strokeWidth={1.75} />
                Sign out
              </button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
