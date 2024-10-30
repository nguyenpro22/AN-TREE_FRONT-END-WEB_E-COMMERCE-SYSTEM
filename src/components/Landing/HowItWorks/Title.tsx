import { motion } from "framer-motion";

export function Title() {
  return (
    <motion.h2
      className="text-4xl font-bold text-center text-green-800 mb-12"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Cách Antree Hoạt Động
    </motion.h2>
  );
}
