"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  const letters = "ALLIN1".split("");

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
      <div className="flex mb-4">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            className="text-4xl font-bold text-primary mx-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              delay: index * 0.1,
              repeat: Infinity,
              repeatDelay: 2.4,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {letter}
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-medium text-primary/80">
          Loading your Playground
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >
            .
          </motion.span>
        </div>

        <div className="relative h-1 w-full max-w-[200px] bg-primary/20 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ width: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}
