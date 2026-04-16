import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Folder, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { staggerContainer, slideUp, scaleIn, fadeIn, hoverButton } from '@/lib/AnimationVariants.js';

export default function UserDashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const projectsData = await pb.collection('projects').getFullList({
          filter: `user_id = '${currentUser.id}'`,
          sort: '-created',
          $autoCancel: false
        }).catch(e => { console.error('PROJECTS failed:', e); return []; });

        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, [currentUser]);

  const deleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await pb.collection('projects').delete(projectId, { $autoCancel: false });
      setProjects(projects.filter(p => p.id !== projectId));
      toast({ title: 'Project deleted', description: 'Project has been removed successfully' });
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete project' });
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Idea Pulse</title>
        <meta name="description" content="Manage your projects." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>

              {/* Welcome Header */}
              <motion.div variants={fadeIn} className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
                  Welcome back, {currentUser?.name || 'there'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage your projects and discover new tools
                </p>
              </motion.div>

              {/* Stats Row */}
              <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div variants={scaleIn}>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Projects</p>
                          <p className="text-3xl font-bold">{projects.length}</p>
                        </div>
                        <Folder className="w-12 h-12 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>

              {/* My Projects */}
              <motion.div variants={slideUp}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>My Projects</CardTitle>
                    <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                      <Button size="sm" asChild className="gap-2">
                        <Link to="/brief-builder">
                          <Plus className="w-4 h-4" />
                          New Project
                        </Link>
                      </Button>
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <motion.div variants={scaleIn} className="text-center py-12">
                        <Folder className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground mb-4">No projects yet</p>
                        <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="inline-block">
                          <Button asChild>
                            <Link to="/brief-builder">Create Your First Project</Link>
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
                        {projects.map((project) => (
                          <motion.div key={project.id} variants={slideUp} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1">{project.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {project.description}
                                </p>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                                  <Button variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {project.project_type && (
                                <Badge variant="secondary">{project.project_type}</Badge>
                              )}
                              {project.status && (
                                <Badge variant="outline">{project.status}</Badge>
                              )}
                              <span className="text-xs text-muted-foreground ml-auto">
                                {format(new Date(project.created), 'MMM d, yyyy')}
                              </span>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

