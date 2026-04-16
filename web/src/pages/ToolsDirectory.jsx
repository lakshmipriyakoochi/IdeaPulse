import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ExternalLink, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FloatingChat from '@/components/FloatingChat.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from '@/hooks/use-toast';
import { staggerContainer, slideUp, hoverCard, hoverButton, fadeIn } from '@/lib/AnimationVariants.js';

export default function ToolsDirectory() {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const { isAuthenticated, currentUser } = useAuth();

  const categories = [
    'All',
    'Design Tools',
    'Development Platforms',
    'Backend/Database',
    'Payment Processing',
    'Project Management',
    'Communication',
    'Analytics',
    'Hosting',
    'API/Integration',
    'CMS',
    'Testing',
    'Monitoring',
    'Email',
    'Storage',
    'Authentication',
    
    'UI Component Libraries',
    'Documentation'
  ];

  useEffect(() => {
    async function loadTools() {
      try {
        const toolsData = await pb.collection('tools').getFullList({
          sort: '-rating',
          $autoCancel: false
        });
        setTools(toolsData);
        setFilteredTools(toolsData);

        if (isAuthenticated) {
          const favoritesData = await pb.collection('favorites').getFullList({
            filter: `user_id = "${currentUser.id}"`,
            $autoCancel: false
          });
          setFavorites(favoritesData.map(f => f.tool_id));
        }
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setLoading(false);
      }
    }
    loadTools();
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    let filtered = tools;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTools(filtered);
  }, [searchQuery, selectedCategory, tools]);

  const toggleFavorite = async (toolId) => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to save favorites'
      });
      return;
    }

    try {
      const isFavorite = favorites.includes(toolId);

      if (isFavorite) {
        const favorite = await pb.collection('favorites').getFirstListItem(
          `user_id = "${currentUser.id}" && tool_id = "${toolId}"`,
          { $autoCancel: false }
        );
        await pb.collection('favorites').delete(favorite.id, { $autoCancel: false });
        setFavorites(favorites.filter(id => id !== toolId));
        toast({
          title: 'Removed from favorites',
          description: 'Tool removed from your saved list'
        });
      } else {
        await pb.collection('favorites').create({
          user_id: currentUser.id,
          tool_id: toolId
        }, { $autoCancel: false });
        setFavorites([...favorites, toolId]);
        toast({
          title: 'Added to favorites',
          description: 'Tool saved to your favorites'
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update favorites'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Tools Directory - Idea Pulse</title>
        <meta name="description" content="Browse our comprehensive directory of development tools. Find the perfect tools for your project with AI-powered recommendations." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={slideUp}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                Development tools directory
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Explore our curated collection of development tools. Filter by category or ask our AI for personalized recommendations.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-8">
              {/* Category Sidebar */}
              <motion.aside 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="space-y-2"
              >
                <h3 className="font-semibold mb-4">Categories</h3>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </motion.aside>

              {/* Main Content */}
              <div>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  className="mb-6"
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 text-foreground"
                    />
                  </div>
                </motion.div>

                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="h-64">
                        <CardContent className="p-6">
                          <div className="animate-pulse space-y-4">
                            <div className="h-12 w-12 bg-muted rounded-xl"></div>
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-full"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredTools.length === 0 ? (
                  <motion.div initial="hidden" animate="visible" variants={fadeIn}>
                    <Card>
                      <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground mb-4">No tools found matching your criteria</p>
                        <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block">
                          <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>
                            Clear Filters
                          </Button>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                      {filteredTools.map((tool) => (
                        <motion.div
                          key={tool.id}
                          layout
                          variants={slideUp}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <motion.div variants={hoverCard} initial="rest" whileHover="hover" className="h-full">
                            <Card className="h-full transition-colors">
                              <CardContent className="p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                                    {tool.logo_url ? (
                                      <img src={tool.logo_url} alt={tool.name} className="w-8 h-8 object-contain" />
                                    ) : (
                                      tool.name.charAt(0)
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                      <span className="font-medium">{tool.rating}</span>
                                    </div>
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => toggleFavorite(tool.id)}
                                      className="p-1 hover:bg-muted rounded transition-colors"
                                    >
                                      <Heart
                                        className={`w-5 h-5 ${
                                          favorites.includes(tool.id)
                                            ? 'fill-red-500 text-red-500'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    </motion.button>
                                  </div>
                                </div>

                                <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                  {tool.description}
                                </p>

                                <div className="space-y-3 mt-auto">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Badge variant="secondary">{tool.category}</Badge>
                                    <Badge variant="outline">{tool.pricing}</Badge>
                                  </div>

                                  <div className="flex gap-2">
                                    <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="flex-1">
                                      <Button variant="outline" size="sm" asChild className="w-full">
                                        <a href={tool.website_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                          <ExternalLink className="w-4 h-4" />
                                          Visit
                                        </a>
                                      </Button>
                                    </motion.div>
                                    <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="flex-1">
                                      <Button size="sm" asChild className="w-full">
                                        <Link to={`/tools/${tool.id}`}>Details</Link>
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </div>
            
            <FloatingChat />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}