import { motion, AnimationControls } from "framer-motion";
import { StepItem } from "./StepItem";
import { steps, containerVariants } from "./types";

interface StepsListProps {
  controls: AnimationControls;
}

export function StepsList({ controls }: StepsListProps) {
  return (
    <motion.ul
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {steps.map((step, index) => (
        <StepItem key={index} step={step} index={index} />
      ))}
    </motion.ul>
  );
}
