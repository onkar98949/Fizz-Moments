"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StepperProps = {
  currentStep: number;
  totalSteps: number;
  label?: string;
  className?: string;
};

export function Stepper({ currentStep, totalSteps, label, className }: StepperProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className={cn("flex w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">
          Step {currentStep} of {totalSteps}
        </span>
        {label ? <span className="text-foreground font-medium">{label}</span> : null}
      </div>
      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
        <motion.div
          className="bg-moment-gradient h-full rounded-full"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
        />
      </div>
    </div>
  );
}
