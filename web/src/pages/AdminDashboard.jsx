import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Folder, Package, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const [tools, setTools] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    website_url: '',
    category: '',
    description: '',
    pricing: '',
    rating: 0,
    reviews_count: 0
  });

  const categories = [
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

  const pricingOptions = ['Free', 'Freemium', 'Paid', 'Enterprise'];

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [toolsData, usersData, projectsData] = await Promise.all([
        pb.collection('tools').getFullList({ sort: '-created', $autoCancel: false }),
        pb.collection('users').getFullList({ sort: '-created', $autoCancel: false }),
        pb.collection('projects').getFullList({ sort: '-created', $autoCancel: false })
      ]);

      setTools(toolsData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTool) {
        await pb.collection('tools').update(editingTool.id, formData, { $autoCancel: false });
        toast({
          title: 'Tool updated',
          description: 'Tool has been updated successfully'
        });
      } else {
        await pb.collection('tools').create(formData, { $autoCancel: false });
        toast({
          title: 'Tool created',
          description: 'New tool has been added successfully'
        });
      }

      setDialogOpen(false);
      setEditingTool(null);
      setFormData({
        name: '',
        website_url: '',
        category: '',
        description: '',
        pricing: '',
        rating: 0,
        reviews_count: 0
      });
      loadData();
    } catch (error) {
      console.error('Failed to save tool:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save tool'
      });
    }
  };

  const handleEdit = (tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      website_url: tool.website_url,
      category: tool.category,
      description: tool.description,
      pricing: tool.pricing,
      rating: tool.rating,
      reviews_count: tool.reviews_count
    });
    setDialogOpen(true);
  };

  const handleDelete = async (toolId) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) {
      return;
    }

    try {
      await pb.collection('tools').delete(toolId, { $autoCancel: false });
      toast({
        title: 'Tool deleted',
        description: 'Tool has been removed successfully'
      });
      loadData();
    } catch (error) {
      console.error('Failed to delete tool:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete tool'
      });
    }
  };

  const stats = {
    totalUsers: users.length,
    totalProjects: projects.length,
    totalTools: tools.length,
    activeProjects: projects.filter(p => p.status === 'In Progress').length
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Idea Pulse</title>
        <meta name="description" content="Manage tools, users, and platform analytics." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ letterSpacing: '-0.02em' }}>
                  Admin Dashboard
                </h1>
                <p className="text-lg text-muted-foreground">
                  Manage platform tools, users, and analytics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                        <p className="text-3xl font-bold">{stats.totalUsers}</p>
                      </div>
                      <Users className="w-12 h-12 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
                        <p className="text-3xl font-bold">{stats.totalProjects}</p>
                      </div>
                      <Folder className="w-12 h-12 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Tools</p>
                        <p className="text-3xl font-bold">{stats.totalTools}</p>
                      </div>
                      <Package className="w-12 h-12 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
                        <p className="text-3xl font-bold">{stats.activeProjects}</p>
                      </div>
                      <TrendingUp className="w-12 h-12 text-primary/20" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mb-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Tools Management</CardTitle>
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2" onClick={() => {
                        setEditingTool(null);
                        setFormData({
                          name: '',
                          website_url: '',
                          category: '',
                          description: '',
                          pricing: '',
                          rating: 0,
                          reviews_count: 0
                        });
                      }}>
                        <Plus className="w-4 h-4" />
                        Add Tool
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{editingTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Tool Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website_url">Website URL</Label>
                          <Input
                            id="website_url"
                            type="url"
                            value={formData.website_url}
                            onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                            required
                            className="text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => setFormData({ ...formData, category: value })}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="text-foreground"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="pricing">Pricing</Label>
                          <Select
                            value={formData.pricing}
                            onValueChange={(value) => setFormData({ ...formData, pricing: value })}
                          >
                            <SelectTrigger className="text-foreground">
                              <SelectValue placeholder="Select pricing" />
                            </SelectTrigger>
                            <SelectContent>
                              {pricingOptions.map((price) => (
                                <SelectItem key={price} value={price}>{price}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <Input
                              id="rating"
                              type="number"
                              min="0"
                              max="5"
                              step="0.1"
                              value={formData.rating}
                              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                              className="text-foreground"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="reviews_count">Reviews Count</Label>
                            <Input
                              id="reviews_count"
                              type="number"
                              min="0"
                              value={formData.reviews_count}
                              onChange={(e) => setFormData({ ...formData, reviews_count: parseInt(e.target.value) })}
                              className="text-foreground"
                            />
                          </div>
                        </div>

                        <Button type="submit" className="w-full">
                          {editingTool ? 'Update Tool' : 'Add Tool'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tools.map((tool) => (
                      <div key={tool.id} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{tool.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                              {tool.description}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary">{tool.category}</Badge>
                              <Badge variant="outline">{tool.pricing}</Badge>
                              <span className="text-xs text-muted-foreground">
                                Rating: {tool.rating}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(tool)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(tool.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div>
                            <p className="font-medium">{user.name || 'Unnamed User'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                            {user.role}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.id} className="p-3 rounded-lg border">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium">{project.title}</h3>
                            <Badge variant="outline">{project.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(project.created), 'MMM d, yyyy')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}