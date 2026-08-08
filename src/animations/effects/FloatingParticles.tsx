"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";

/** Deterministic pseudo-random, not `Math.random()` — this can render inside
 *  a server-rendered client component (the public story page SSRs the
 *  player), so the particle field must compute identically on the server
 *  and the client or React throws a hydration mismatch. Seeded per-particle. */
function seeded(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Particle = {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  peakOpacity: number;
  rotation: number;
};

function buildParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: seeded(i * 3.1 + 1) * 100,
    top: seeded(i * 5.7 + 2) * 100,
    size: 1.2 + seeded(i * 2.3 + 3) * 2.6,
    duration: 9 + seeded(i * 7.9 + 4) * 12,
    delay: seeded(i * 4.4 + 5) * 6,
    driftX: (seeded(i * 6.6 + 6) - 0.5) * 46,
    peakOpacity: 0.14 + seeded(i * 8.8 + 7) * 0.34,
    rotation: (seeded(i * 1.7 + 8) - 0.5) * 60,
  }));
}

type FloatingParticlesProps = {
  /** Generated once (`useMemo`), never re-rolled — "do not use identical
   *  particles" is satisfied by the seeded spread, not by re-randomizing. */
  count?: number;
  color?: string;
  className?: string;
};

export function FloatingParticles({ count = 20, color = "#FFE9C7", className }: FloatingParticlesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particles = useMemo(() => buildParticles(count), [count]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>(".moment-particle", containerRef.current);
      nodes.forEach((node, i) => {
        const p = particles[i];
        if (!p) return;
        gsap.set(node, { opacity: 0, x: 0, y: 0, rotation: 0 });
        const fadeSlice = p.duration * 0.22;
        gsap
          .timeline({ repeat: -1, delay: p.delay, defaults: { ease: "sine.inOut" } })
          .to(node, { opacity: p.peakOpacity, duration: fadeSlice }, 0)
          .to(node, { y: -180, x: p.driftX, rotation: p.rotation, duration: p.duration, ease: "sine.inOut" }, 0)
          .to(node, { opacity: 0, duration: fadeSlice }, p.duration - fadeSlice);
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particles]);

  return (
    <div ref={containerRef} className={className ?? "pointer-events-none absolute inset-0 overflow-hidden"}>
      {particles.map((p) => (
        <span
          key={p.id}
          className="moment-particle absolute rounded-full"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size, backgroundColor: color }}
        />
      ))}
    </div>
  );
}
