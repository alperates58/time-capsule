"use client";

import { motion } from "framer-motion";

export function TimelinePreview() {
  const decades = [1800, 1850, 1900, 1950, 2000, 2024];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 relative select-none">
      <div className="absolute left-0 right-0 top-1/2 h-px bg-border/50 -translate-y-1/2 z-0" />
      
      <div className="relative z-10 flex justify-between items-center">
        {decades.map((year, index) => (
          <motion.div
            key={year}
            className="flex flex-col items-center gap-4 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="w-3 h-3 rounded-full bg-muted border-2 border-background group-hover:bg-primary transition-colors duration-300 shadow-sm" />
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              {year}
            </span>
          </motion.div>
        ))}
      </div>
      
      {/* Subtle glow effect behind the timeline */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 bg-primary/5 blur-[100px] pointer-events-none rounded-full" />
    </div>
  );
}
