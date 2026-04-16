import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function TimelinePhase({ phase, index, isLast }) {
  return (
    <div className="relative flex gap-6 pb-12 print:pb-6 print:break-inside-avoid">
      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-[1.125rem] top-10 bottom-0 w-px bg-border print:bg-gray-300" />
      )}
      
      {/* Number Circle */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold shadow-md ring-4 ring-background print:ring-white"
      >
        {phase.id}
      </motion.div>
      
      {/* Content */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 + 0.1, duration: 0.4 }}
        className="flex-1 pt-1.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h3 className="text-xl font-semibold leading-none">{phase.name}</h3>
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md w-fit">
            <Clock className="w-4 h-4" />
            ~{phase.duration} days
          </div>
        </div>
        <p className="text-muted-foreground leading-relaxed max-w-prose">
          {phase.description}
        </p>
      </motion.div>
    </div>
  );
}