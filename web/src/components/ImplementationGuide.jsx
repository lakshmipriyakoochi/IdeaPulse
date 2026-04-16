import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function ImplementationGuide({ phases, steps }) {
  if (!phases || !steps) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card border rounded-2xl overflow-hidden shadow-sm print:shadow-none print:border-none"
    >
      <Accordion type="single" collapsible className="w-full" defaultValue="phase-1">
        {phases.map((phase) => (
          <AccordionItem key={phase.id} value={`phase-${phase.id}`} className="px-6 print:border-b print:mb-4">
            <AccordionTrigger className="hover:no-underline py-6">
              <div className="flex items-center gap-4 text-left">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {phase.id}
                </span>
                <div>
                  <h4 className="text-lg font-semibold">{phase.name}</h4>
                  <p className="text-sm text-muted-foreground font-normal mt-1 print:hidden">
                    Click to view detailed steps
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="pl-12 space-y-6">
                <p className="text-foreground leading-relaxed">
                  {phase.description}
                </p>
                
                <div className="space-y-4 mt-6">
                  {steps[phase.id]?.map((step, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl bg-muted/40 border border-border/50">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-medium mb-1.5">{step.title}</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}