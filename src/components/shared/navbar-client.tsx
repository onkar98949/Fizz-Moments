"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth-actions";
import { UserMenu } from "@/features/auth/user-menu";
import type { AuthUser } from "@/features/auth/types";

const NAV_LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/gifts", label: "Gifts" },
  { href: "/contact", label: "Contact" },
];

const CREATIONS_LINK = { href: "/dashboard", label: "My Creations" };

const EASE = [0.16, 1, 0.3, 1] as const;

/** A plain, full-width sticky bar — not a floating pill. Transparent over
 *  the hero, gaining a hairline border and a very subtle glass blur once the
 *  page scrolls, so the chrome recedes and the content stays the focus.
 *  Desktop links share a "magic" underline that slides to whichever is
 *  hovered (or the active route, when nothing is hovered); mobile gets a
 *  real slide-down menu instead of losing navigation entirely. */
export function NavbarClient({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = user ? [...NAV_LINKS, CREATIONS_LINK] : NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 w-full">
      <motion.div
        animate={{
          backgroundColor: scrolled || menuOpen ? "color-mix(in oklch, var(--background) 82%, transparent)" : "transparent",
          borderColor: scrolled || menuOpen ? "var(--border)" : "transparent",
        }}
        transition={{ duration: 0.3, ease: EASE }}
        className={cn("w-full border-b backdrop-blur-none", (scrolled || menuOpen) && "backdrop-blur-md")}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6 sm:px-10">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/fizzmoments-mark.png" alt="" width={43} height={32} className="h-8 w-auto" priority />
            <span className="text-lg font-semibold tracking-tight">FizzMoments</span>
          </Link>

          <nav onMouseLeave={() => setHovered(null)} className="hidden items-center gap-8 sm:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isIndicated = hovered ? hovered === link.href : isActive;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHovered(link.href)}
                  className={cn(
                    "relative py-1.5 text-[0.9rem] font-medium transition-colors duration-200",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {link.label}
                  {isIndicated ? (
                    <motion.span
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="bg-foreground absolute inset-x-0 -bottom-0.5 h-px"
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:block">
                <UserMenu user={user} />
              </div>
            ) : null /* Sign in link temporarily disabled — login/signup are
            off. Restore this branch to bring it back:
            (
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground hidden text-[0.9rem] font-medium transition-colors duration-200 sm:inline-block"
              >
                Sign in
              </Link>
            ) */}
            <Button
              size="sm"
              className="hidden sm:inline-flex"
              nativeButton={false}
              render={<Link href="/gifts">Make a Moment</Link>}
            />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="hover:bg-secondary flex size-9 items-center justify-center rounded-full transition-colors duration-200 sm:hidden"
            >
              {menuOpen ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5" strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="border-border bg-background overflow-hidden border-b sm:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-3 py-3 text-base font-medium transition-colors duration-200",
                      pathname === link.href ? "text-foreground bg-secondary/60" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {user ? (
                <div className="border-border mt-2 flex items-center justify-between gap-3 border-t px-3 pt-4">
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-foreground truncate text-sm font-medium">{user.name}</span>
                    <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                  </div>
                  <form action={signOutAction} className="shrink-0">
                    <button
                      type="submit"
                      aria-label="Sign out"
                      className="text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      <LogOut className="size-3.5" strokeWidth={1.75} />
                      Sign out
                    </button>
                  </form>
                </div>
              ) : null /* Sign in link temporarily disabled — login/signup
              are off. Restore this branch to bring it back:
              (
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-foreground block rounded-lg px-3 py-3 text-base font-medium transition-colors duration-200"
                >
                  Sign in
                </Link>
              ) */}

              <Button
                size="lg"
                className="mt-3 w-full"
                nativeButton={false}
                render={<Link href="/gifts">Make a Moment</Link>}
              />
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
