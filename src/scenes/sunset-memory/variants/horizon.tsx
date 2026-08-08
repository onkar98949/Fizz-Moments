"use client";

import { motion } from "framer-motion";
import { PhotoReveal } from "../../_shared/photo-reveal";
import type { SunsetMemoryData } from "../config";

function SunDecoration() {
  return (
    <motion.div
      initial={{ top: "22%", opacity: 0 }}
      animate={{ top: "62%", opacity: 0.85 }}
      transition={{ duration: 4, ease: "easeInOut" }}
      className="pointer-events-none absolute left-1/2 size-24 -translate-x-1/2 rounded-full"
      style={{ background: "radial-gradient(circle, rgba(255,209,102,0.95), rgba(255,138,101,0.35) 60%, transparent 75%)" }}
    />
  );
}

export function HorizonSunset({ data }: { data: SunsetMemoryData }) {
  return (
    <PhotoReveal
      photoUrl={data.photoUrl}
      caption={data.caption}
      decoration={<SunDecoration />}
      overlayClassName="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-[#ff8a65]/10"
    />
  );
}
