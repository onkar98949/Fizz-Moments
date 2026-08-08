"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is currently visible in the viewport, via
 * IntersectionObserver. Used by the Scene Library's preview cards so a
 * scene's animation only plays while its card is actually on screen.
 */
export function useInViewport<T extends Element>(threshold = 0.5) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
