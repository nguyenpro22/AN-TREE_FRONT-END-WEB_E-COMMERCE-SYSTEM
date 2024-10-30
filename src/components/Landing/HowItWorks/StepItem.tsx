import { CardContent } from "@/components/ui/card";

import { motion } from "framer-motion";
import { itemVariants, Step } from "./types";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface StepItemProps {
  step: Step;
  index: number;
}

export function StepItem({ step, index }: StepItemProps) {
  return (
    <motion.li variants={itemVariants}>
      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
        <CardContent className="flex items-start p-6">
          <div className="flex-shrink-0 mr-4">
            <motion.div
              className="bg-green-100 rounded-full p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </motion.div>
          </div>
          <div>
            <span className="block text-sm font-medium text-green-600 mb-2">
              Bước {index + 1}
            </span>
            <p className="text-green-800">{step.text}</p>
          </div>
        </CardContent>
      </Card>
    </motion.li>
  );
}
