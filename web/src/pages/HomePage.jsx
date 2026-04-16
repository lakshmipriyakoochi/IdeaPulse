import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

import pb from '@/lib/pocketbaseClient';
import { staggerContainer, slideUp, hoverButton, hoverCard } from '@/lib/AnimationVariants.js';

export default function HomePage() {
  const [featuredTools, setFeaturedTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedTools() {
      try {
        const tools = await pb.collection('tools').getList(1, 6, {
          sort: '-rating',
          $autoCancel: false
        });
        setFeaturedTools(tools.items);
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setLoading(false);
      }
    }
    loadFeaturedTools();
  }, []);

  const steps = [
    {
      number: '01',
      title: 'Describe your project',
      description: 'Tell us about your project type, budget, timeline, and requirements'
    },
    {
      number: '02',
      title: 'Get AI recommendations',
      description: 'Our AI analyzes your needs and suggests the perfect tools from our database'
    },
    {
      number: '03',
      title: 'Build with confidence',
      description: 'Start your project with the right stack and save time on research'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Idea Pulse - Build Better Projects with the Right Tools</title>
        <meta name="description" content="Discover the perfect development tools for your projects. Get AI-powered recommendations tailored to your needs, budget, and timeline." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative min-h-[100dvh] flex items-center overflow-hidden">
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: 'url(https://images.unsplash.com/photo-1699100329878-7f28bb780787)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="max-w-3xl">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {/* 🟡 Yellow/Gold Badge */}
                  <motion.div variants={slideUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-500 text-sm font-medium mb-6 border border-yellow-400/30">
                    <Sparkles className="w-4 h-4" />
                    AI-Powered Tool Discovery
                  </motion.div>

                  <motion.h1 variants={slideUp} className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                    Build Better Projects with the Right Tools
                  </motion.h1>
                  <motion.p variants={slideUp} className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-prose">
                    Stop wasting time researching development tools. Get instant, AI-powered recommendations tailored to your project needs, budget, and timeline.
                  </motion.p>
                  <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-4">
                    <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block">
                      <Button size="lg" asChild className="gap-2 w-full sm:w-auto">
                        <Link to="/brief-builder">
                          Start Building
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>
                    <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block">
                      <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                        <Link to="/tools">Browse Tools</Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Featured Tools Section */}
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideUp}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  Popular development tools
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore top-rated tools trusted by developers worldwide
                </p>
              </motion.div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="h-48">
                      <CardContent className="p-6">
                        <div className="animate-pulse space-y-4">
                          <div className="h-12 w-12 bg-muted rounded-lg"></div>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-full"></div>
                          <div className="h-3 bg-muted rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {featuredTools.map((tool) => (
                    <motion.div key={tool.id} variants={slideUp}>
                      <motion.div variants={hoverCard} initial="rest" whileHover="hover" className="h-full">
                        <Card className="h-full transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                                {tool.logo_url ? (
                                  <img src={tool.logo_url} alt={tool.name} className="w-8 h-8 object-contain" />
                                ) : (
                                  tool.name.charAt(0)
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{tool.rating}</span>
                              </div>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {tool.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary/20 text-secondary-foreground">
                                {tool.category}
                              </span>
                              <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                                <Button variant="ghost" size="sm" asChild>
                                  <Link to={`/tools/${tool.id}`}>View</Link>
                                </Button>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUp}
                className="text-center mt-12"
              >
                <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/tools">View All Tools</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={slideUp}
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                  How it works
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Get personalized tool recommendations in three simple steps
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="max-w-4xl mx-auto space-y-12"
              >
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    variants={slideUp}
                    className="flex gap-8 items-start"
                  >
                    <div className="text-6xl font-bold text-primary/20 leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUp}
                className="max-w-4xl mx-auto text-center"
              >
                <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20">
                  <CardContent className="p-12">
                    <Rocket className="w-16 h-16 mx-auto mb-6 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                      Ready to build your next project?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                      Idea Pulse to find the perfect tools for their projects
                    </p>
                    <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block">
                      <Button size="lg" asChild className="gap-2">
                        <Link to="/brief-builder">
                          Get Started Now
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </section>

          
        </main>

        <Footer />
      </div>
    </>
  );
}