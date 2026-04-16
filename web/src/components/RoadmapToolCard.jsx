import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RoadmapToolCard({ tool }) {
  if (!tool) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col border border-border shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                {tool.logo_url ? (
                  <img src={tool.logo_url} alt={tool.name} className="w-8 h-8 object-contain" />
                ) : (
                  tool.name.charAt(0)
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg leading-none mb-1.5">{tool.name}</h3>
                <Badge variant="secondary" className="font-normal">{tool.category}</Badge>
              </div>
            </div>
            <Badge variant="outline" className="bg-background">{tool.pricing}</Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4 flex-1">
            {tool.description}
          </p>

          <div className="space-y-4 mt-auto">
            {tool.features && tool.features.length > 0 && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Key Features</span>
                <ul className="space-y-1">
                  {tool.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Learning Curve:</span>
                <div className="flex gap-1">
                  <div className={`w-2 h-2 rounded-full ${tool.rating > 4.5 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <div className={`w-2 h-2 rounded-full ${tool.rating > 4.0 ? 'bg-green-500' : tool.rating > 3.0 ? 'bg-yellow-500' : 'bg-muted'}`} />
                  <div className={`w-2 h-2 rounded-full ${tool.rating > 4.8 ? 'bg-green-500' : 'bg-muted'}`} />
                </div>
              </div>
              <Button variant="ghost" size="sm" asChild className="h-8 gap-1.5 px-2">
                <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                  Visit <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
