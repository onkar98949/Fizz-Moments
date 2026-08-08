"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { PhotoReveal } from "../../_shared/photo-reveal";
import type { LandmarkMemoryData } from "../config";

function PinDecoration() {
  return (
    <motion.div
      initial={{ y: -120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 }}
      className="absolute top-[38%] left-1/2 -translate-x-1/2"
    >
      <MapPin className="size-10 fill-primary text-white drop-shadow-lg" strokeWidth={1.5} />
    </motion.div>
  );
}

export function PinDropLandmark({ data }: { data: LandmarkMemoryData }) {
  return <PhotoReveal photoUrl={data.photoUrl} heading={data.landmarkName} caption={data.caption} decoration={<PinDecoration />} />;
}
