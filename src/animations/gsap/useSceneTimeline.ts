"use client";

import { useLayoutEffect, useRef, type DependencyList, type RefObject } from "react";
import gsap from "gsap";

/**
 * The one GSAP timeline a cinematic scene gets. `build` receives that
 * timeline and adds every phase to it — nothing else in the scene should
 * create its own timeline or reach for `setTimeout`. Scoped to `scope` via
 * `gsap.context()`, so every tween/selector `build` creates is torn down in
 * one call on unmount or re-run — this is what "kill timelines on unmount"
 * means in practice, not a manual `tl.kill()` you have to remember.
 */
export function useSceneTimeline(
  scope: RefObject<HTMLElement | null>,
  build: (tl: gsap.core.Timeline) => void,
  deps: DependencyList = [],
) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!scope.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      timelineRef.current = tl;
      build(tl);
    }, scope);

    return () => {
      ctx.revert();
      timelineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return timelineRef;
}
