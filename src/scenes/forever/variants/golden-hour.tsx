"use client";

import { motion } from "framer-motion";
import { PhotoReveal } from "../../_shared/photo-reveal";
import type { ForeverData } from "../config";

function GoldenHourDecoration() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 0.55, y: 0 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
      style={{ background: "radial-gradient(circle at 50% 100%, rgba(255,209,102,0.55), transparent 65%)" }}
    />
  );
}

export function GoldenHourForever({ data }: { data: ForeverData }) {
  return (
    <PhotoReveal
      photoUrl={data.photoUrl}
      caption={data.endingMessage}
      decoration={<GoldenHourDecoration />}
      overlayClassName="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
    />
  );
}
