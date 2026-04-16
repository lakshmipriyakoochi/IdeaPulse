import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ExternalLink, Star, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FloatingChat from '@/components/FloatingChat.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from '@/hooks/use-toast';
import { staggerContainer, slideUp, hoverCard, hoverButton, fadeIn } from '@/lib/AnimationVariants.js';

export default function ToolDetailPage() {
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [relatedTools, setRelatedTools] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    async function loadTool() {
      try {
        const toolData = await pb.collection('tools').getOne(id, { $autoCancel: false });
        setTool(toolData);

        const related = await pb.collection('tools').getList(1, 4, {
          filter: `category = "${toolData.category}" && id != "${id}"`,
          sort: '-rating',
          $autoCancel: false
        });
        setRelatedTools(related.items);

        if (isAuthenticated) {
          try {
            await pb.collection('favorites').getFirstListItem(
              `user_id = "${currentUser.id}" && tool_id = "${id}"`,
              { $autoCancel: false }
            );
            setIsFavorite(true);
          } catch {
            setIsFavorite(false);
          }
        }
      } catch (error) {
        console.error('Failed to load tool:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTool();
  }, [id, isAuthenticated, currentUser]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to save favorites'
      });
      return;
    }

    try {
      if (isFavorite) {
        const favorite = await pb.collection('favorites').getFirstListItem(
          `user_id = "${currentUser.id}" && tool_id = "${id}"`,
          { $autoCancel: false }
        );
        await pb.collection('favorites').delete(favorite.id, { $autoCancel: false });
        setIsFavorite(false);
        toast({
          title: 'Removed from favorites',
          description: 'Tool removed from your saved list'
        });
      } else {
        await pb.collection('favorites').create({
          user_id: currentUser.id,
          tool_id: id
        }, { $autoCancel: false });
        setIsFavorite(true);
        toast({
          title: 'Added to favorites',
          description: 'Tool saved to your favorites'
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading tool details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!tool) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">Tool not found</p>
              <Button asChild>
                <Link to="/tools">Back to Tools</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${tool.name} - Idea Pulse`}</title>
        <meta name="description" content={tool.description} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block mb-6">
              <Button variant="ghost" asChild className="gap-2">
                <Link to="/tools">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Tools
                </Link>
              </Button>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={slideUp}>
                <Card className="mb-8">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-4xl flex-shrink-0">
                        {tool.logo_url ? (
                          <img src={tool.logo_url} alt={tool.name} className="w-16 h-16 object-contain" />
                        ) : (
                          tool.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
                          {tool.name}
                        </h1>
                        <div className="flex items-center gap-4 flex-wrap">
                          <Badge variant="secondary">{tool.category}</Badge>
                          <Badge variant="outline">{tool.pricing}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{tool.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({tool.reviews_count} reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                        <Button asChild className="gap-2">
                          <a href={tool.website_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            Visit Website
                          </a>
                        </Button>
                      </motion.div>
                      <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                        <Button variant="outline" onClick={toggleFavorite} className="gap-2">
                          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          {isFavorite ? 'Saved' : 'Save'}
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={slideUp}>
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{tool.description}</p>
                  </CardContent>
                </Card>
              </motion.div>

              {tool.features && tool.features.length > 0 && (
                <motion.div variants={slideUp}>
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Key Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.ul variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
                        {tool.features.map((feature, index) => (
                          <motion.li key={index} variants={fadeIn} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-muted-foreground">{feature}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <motion.div variants={slideUp}>
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {tool.pricing}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Visit the official website for detailed pricing information and plans.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {relatedTools.length > 0 && (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="mt-12"
              >
                <motion.h2 variants={fadeIn} className="text-2xl font-bold mb-6">Related Tools</motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedTools.map((relatedTool) => (
                    <motion.div key={relatedTool.id} variants={slideUp}>
                      <motion.div variants={hoverCard} initial="rest" whileHover="hover" className="h-full">
                        <Card className="h-full transition-colors">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
                                {relatedTool.logo_url ? (
                                  <img src={relatedTool.logo_url} alt={relatedTool.name} className="w-8 h-8 object-contain" />
                                ) : (
                                  relatedTool.name.charAt(0)
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{relatedTool.name}</h3>
                                <div className="flex items-center gap-1 text-sm">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{relatedTool.rating}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {relatedTool.description}
                            </p>
                            <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                              <Button variant="outline" size="sm" asChild className="w-full">
                                <Link to={`/tools/${relatedTool.id}`}>View Details</Link>
                              </Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            
            <FloatingChat />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}