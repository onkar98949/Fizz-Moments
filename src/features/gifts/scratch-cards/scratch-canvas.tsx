"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const REVEAL_THRESHOLD = 0.55;
const BRUSH_RADIUS = 24;
const GRID_COLS = 24;
const GRID_ROWS = 32;

type Dust = { id: number; x: number; y: number; angle: number; color: string };
const DUST_COLORS = ["#ffffff", "#FFE9D6", "#F3E8FF"];

function drawHeart(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, rotation: number, opacity: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.scale(size, size);
  ctx.beginPath();
  ctx.moveTo(0, 0.32);
  ctx.bezierCurveTo(0, 0.12, -0.16, -0.04, -0.32, -0.04);
  ctx.bezierCurveTo(-0.52, -0.04, -0.52, 0.2, -0.52, 0.2);
  ctx.bezierCurveTo(-0.52, 0.36, -0.36, 0.52, 0, 0.72);
  ctx.bezierCurveTo(0.36, 0.52, 0.52, 0.36, 0.52, 0.2);
  ctx.bezierCurveTo(0.52, 0.2, 0.52, -0.04, 0.32, -0.04);
  ctx.bezierCurveTo(0.16, -0.04, 0, 0.12, 0, 0.32);
  ctx.closePath();
  ctx.fillStyle = `rgba(255,255,255,${opacity})`;
  ctx.fill();
  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, opacity: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.quadraticCurveTo(size * 0.18, -size * 0.18, size, 0);
  ctx.quadraticCurveTo(size * 0.18, size * 0.18, 0, size);
  ctx.quadraticCurveTo(-size * 0.18, size * 0.18, -size, 0);
  ctx.quadraticCurveTo(-size * 0.18, -size * 0.18, 0, -size);
  ctx.closePath();
  ctx.fillStyle = `rgba(255,255,255,${opacity})`;
  ctx.fill();
  ctx.restore();
}

type ScratchCanvasProps = {
  onRevealed: () => void;
  className?: string;
};

/** The actual scratch-off mechanic: a canvas "foil" layer erased along the
 *  pointer path via destination-out compositing. Scratched coverage is
 *  tracked on a coarse grid in a ref (not React state) so dragging never
 *  triggers a re-render — only crossing the reveal threshold does. */
export function ScratchCanvas({ onRevealed, className }: ScratchCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const gridRef = useRef<Uint8Array>(new Uint8Array(GRID_COLS * GRID_ROWS));
  const scratchedCountRef = useRef(0);
  const isScratchingRef = useRef(false);
  const revealedRef = useRef(false);

  const [revealed, setRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [dust, setDust] = useState<Dust[]>([]);
  const nextDustId = useRef(0);
  const lastDustAt = useRef(0);

  function paintFoil(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, width, height);

    // Base — a richer, more saturated diagonal than a flat two-stop fade,
    // so the foil reads as a designed material rather than a CSS gradient.
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#FF6B8B");
    gradient.addColorStop(0.32, "#FF8FA8");
    gradient.addColorStop(0.62, "#D89AE8");
    gradient.addColorStop(1, "#A47CE8");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // A soft diagonal shimmer band, like light catching foil.
    const shimmer = ctx.createLinearGradient(0, 0, width * 0.6, height * 0.6);
    shimmer.addColorStop(0, "rgba(255,255,255,0)");
    shimmer.addColorStop(0.5, "rgba(255,255,255,0.16)");
    shimmer.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = shimmer;
    ctx.fillRect(0, 0, width, height);

    // Scattered hearts + sparkles on a jittered grid — even coverage
    // without looking like a mechanical repeat.
    const cell = Math.max(34, Math.min(width, height) / 7);
    let seed = 42;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let y = -cell / 2; y < height + cell; y += cell) {
      for (let x = -cell / 2; x < width + cell; x += cell) {
        const jx = x + (rand() - 0.5) * cell * 0.7;
        const jy = y + (rand() - 0.5) * cell * 0.7;
        const rotation = (rand() - 0.5) * 0.9;
        const opacity = 0.08 + rand() * 0.1;
        if (rand() > 0.4) {
          drawHeart(ctx, jx, jy, 9 + rand() * 6, rotation, opacity);
        } else {
          drawSparkle(ctx, jx, jy, 4 + rand() * 3, opacity + 0.05);
        }
      }
    }

    // A gentle vignette for depth, and a thin inset frame so the card reads
    // as one designed object rather than an edge-to-edge color fill.
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, Math.min(width, height) * 0.2,
      width / 2, height / 2, Math.max(width, height) * 0.75,
    );
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,0.14)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(6, 6, width - 12, height - 12);
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      sizeRef.current = { width: rect.width, height: rect.height };
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      ctxRef.current = ctx;
      if (!revealedRef.current) paintFoil(ctx, rect.width, rect.height);
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  function markGrid(x: number, y: number, width: number, height: number) {
    const col = Math.floor((x / width) * GRID_COLS);
    const row = Math.floor((y / height) * GRID_ROWS);
    const cellRadius = Math.ceil((BRUSH_RADIUS / width) * GRID_COLS);
    for (let dy = -cellRadius; dy <= cellRadius; dy++) {
      for (let dx = -cellRadius; dx <= cellRadius; dx++) {
        const c = col + dx;
        const r = row + dy;
        if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) continue;
        const idx = r * GRID_COLS + c;
        if (gridRef.current[idx] === 0) {
          gridRef.current[idx] = 1;
          scratchedCountRef.current += 1;
        }
      }
    }
  }

  function scratchAt(x: number, y: number) {
    const ctx = ctxRef.current;
    const { width, height } = sizeRef.current;
    if (!ctx || width === 0) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
    ctx.fill();

    markGrid(x, y, width, height);

    const now = performance.now();
    if (now - lastDustAt.current > 45) {
      lastDustAt.current = now;
      const id = nextDustId.current++;
      setDust((prev) => [
        ...prev.slice(-14),
        { id, x, y, angle: Math.random() * 360, color: DUST_COLORS[id % DUST_COLORS.length] },
      ]);
      window.setTimeout(() => setDust((prev) => prev.filter((d) => d.id !== id)), 550);
    }

    const coverage = scratchedCountRef.current / (GRID_COLS * GRID_ROWS);
    if (coverage >= REVEAL_THRESHOLD && !revealedRef.current) {
      revealedRef.current = true;
      setRevealed(true);
      onRevealed();
    }
  }

  function pointerPos(e: React.PointerEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (revealedRef.current) return;
    isScratchingRef.current = true;
    setHasStarted(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const { x, y } = pointerPos(e);
    scratchAt(x, y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isScratchingRef.current || revealedRef.current) return;
    const { x, y } = pointerPos(e);
    scratchAt(x, y);
  }

  function stopScratching() {
    isScratchingRef.current = false;
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopScratching}
      onPointerLeave={stopScratching}
      onPointerCancel={stopScratching}
      className={cn("absolute inset-0 touch-none select-none", className)}
    >
      {!revealed && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ touchAction: "none" }} />
      )}

      {!revealed &&
        dust.map((d) => (
          <motion.span
            key={d.id}
            className="pointer-events-none absolute z-10 rounded-full"
            style={{ left: d.x, top: d.y, width: 4, height: 4, backgroundColor: d.color }}
            initial={{ opacity: 0.9, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: Math.cos((d.angle * Math.PI) / 180) * 22,
              y: Math.sin((d.angle * Math.PI) / 180) * 22 + 10,
              scale: 0.4,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        ))}

      {!revealed && !hasStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 text-white"
        >
          <div className="relative h-9 w-28">
            <div className="absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rounded-full bg-white/35" />
            <motion.span
              className="absolute top-1/2 size-7 -translate-y-1/2 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
              animate={{ x: [6, 82, 6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-base font-semibold drop-shadow-sm">Scratch to reveal</span>
            <span className="text-xs text-white/80">Drag your finger or mouse across the card</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
