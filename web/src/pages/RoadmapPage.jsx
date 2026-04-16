import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Layers, Server, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import RoadmapToolCard from '@/components/RoadmapToolCard.jsx';
import TimelinePhase from '@/components/TimelinePhase.jsx';
import ImplementationGuide from '@/components/ImplementationGuide.jsx';
import RoadmapPDFExport from '@/components/RoadmapPDFExport.jsx';
import RoadmapShare from '@/components/RoadmapShare.jsx';
import FloatingChat from '@/components/FloatingChat.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from '@/hooks/use-toast';
import { staggerContainer, slideUp, hoverButton, fadeIn } from '@/lib/AnimationVariants.js';

export default function RoadmapPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const projectData = await pb.collection('projects').getOne(projectId, { $autoCancel: false });
        setProject(projectData);

        const roadmaps = await pb.collection('roadmaps').getFullList({
          filter: `project_id = "${projectId}"`,
          $autoCancel: false
        });

        if (roadmaps.length > 0) {
          setRoadmap(roadmaps[0]);
        } else {
          toast({
            variant: 'destructive',
            title: 'Roadmap not found',
            description: 'No roadmap has been generated for this project yet.'
          });
          navigate(`/dashboard`);
        }
      } catch (error) {
        console.error('Failed to load roadmap:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load project roadmap'
        });
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [projectId, navigate]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground font-medium">Loading your personalized roadmap...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!roadmap || !project) return null;

  const { tech_stack, phases, steps } = roadmap;

  return (
    <>
      <Helmet>
        <title>{`${project.title} Roadmap - Idea Pulse`}</title>
        <meta name="description" content="Your personalized project implementation roadmap and tech stack." />
      </Helmet>

      <div className="min-h-screen flex flex-col print:bg-white print:text-black print:p-0">
        <div className="print:hidden">
          <Header />
        </div>

        <main className="flex-1 py-12 print:py-0 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            
            {/* Action Bar */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 print:hidden"
            >
              <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                <Button variant="ghost" asChild className="gap-2 w-fit -ml-4">
                  <Link to="/dashboard">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </motion.div>
              <div className="flex items-center gap-3">
                <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                  <Button variant="outline" asChild className="gap-2">
                    <Link to={`/brief-builder?edit=${project.id}`}>
                      Edit Brief
                    </Link>
                  </Button>
                </motion.div>
                <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                  <RoadmapShare projectName={project.title} />
                </motion.div>
                <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                  <RoadmapPDFExport projectName={project.title} />
                </motion.div>
              </div>
            </motion.div>

            {/* Header Section */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-16 print:mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 print:hidden">
                Project Roadmap
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                {project.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl print:text-gray-700">
                {project.description || "Implementation roadmap and personalized technology stack recommendations."}
              </p>
            </motion.div>

            {/* Tech Stack Summary */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-20 print:mb-12"
            >
              <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-8">Technology Stack Summary</motion.h2>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Frontend Card */}
                <motion.div variants={slideUp}>
                  <Card className="border-t-4 border-t-frontend bg-frontend/5 print:border-gray-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-frontend/20 rounded-lg text-frontend print:bg-transparent">
                          <Layers className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg">Frontend</h3>
                      </div>
                      <ul className="space-y-3">
                        {tech_stack?.frontend?.map(tool => (
                          <li key={tool.id} className="font-medium text-foreground">{tool.name}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Backend Card */}
                <motion.div variants={slideUp}>
                  <Card className="border-t-4 border-t-backend bg-backend/5 print:border-gray-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-backend/20 rounded-lg text-backend print:bg-transparent">
                          <Server className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg">Backend & API</h3>
                      </div>
                      <ul className="space-y-3">
                        {tech_stack?.backend?.map(tool => (
                          <li key={tool.id} className="font-medium text-foreground">{tool.name}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Database Card */}
                <motion.div variants={slideUp}>
                  <Card className="border-t-4 border-t-database bg-database/5 print:border-gray-300 h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-database/20 rounded-lg text-database print:bg-transparent">
                          <Database className="w-6 h-6" />
                        </div>
                        <h3 className="font-semibold text-lg">Database</h3>
                      </div>
                      <ul className="space-y-3">
                        {tech_stack?.database?.map(tool => (
                          <li key={tool.id} className="font-medium text-foreground">{tool.name}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.section>

            {/* Recommended Tools List */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-20 print:mb-12 print:break-before-page"
            >
              <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-8">Recommended Tools Directory</motion.h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {tech_stack?.frontend?.map(tool => (
                  <motion.div key={tool.id} variants={slideUp} className="h-full">
                    <RoadmapToolCard tool={tool} />
                  </motion.div>
                ))}
                {tech_stack?.backend?.map(tool => (
                  <motion.div key={tool.id} variants={slideUp} className="h-full">
                    <RoadmapToolCard tool={tool} />
                  </motion.div>
                ))}
                {tech_stack?.database?.map(tool => (
                  <motion.div key={tool.id} variants={slideUp} className="h-full">
                    <RoadmapToolCard tool={tool} />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Implementation Timeline */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="mb-20 print:mb-12 print:break-before-page"
            >
              <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-8">Implementation Timeline</motion.h2>
              <div className="max-w-3xl ml-4 sm:ml-8">
                {phases?.map((phase, index) => (
                  <motion.div key={phase.id} variants={slideUp}>
                    <TimelinePhase 
                      phase={phase} 
                      index={index} 
                      isLast={index === phases.length - 1} 
                    />
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Step-by-Step Guide */}
            <motion.section 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="mb-20 print:mb-12 print:break-before-page"
            >
              <h2 className="text-2xl font-bold mb-8">Step-by-Step Implementation Guide</h2>
              <ImplementationGuide phases={phases} steps={steps} />
            </motion.section>

            <FloatingChat />
          </div>
        </main>

        <div className="print:hidden">
          <Footer />
        </div>
      </div>
    </>
  );
}