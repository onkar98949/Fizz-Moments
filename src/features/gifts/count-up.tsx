"use client";

import { useEffect, useState } from "react";

type CountUpProps = {
  value: number;
  duration?: number;
  className?: string;
};

const EASE_OUT_CUBIC = (t: number) => 1 - Math.pow(1 - t, 3);

/** Animates from 0 to `value` once on mount — reused by Love Wrapped's
 *  stat slides and the quiz's score reveal, the two places a number
 *  landing with weight matters. */
export function CountUp({ value, duration = 1200, className }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setDisplay(Math.round(value * EASE_OUT_CUBIC(progress)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
