import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import FloatingChat from '@/components/FloatingChat.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { generateRoadmap } from '@/lib/RoadmapGenerator.js';
import { slideInLeft, staggerContainer, fadeIn, hoverButton } from '@/lib/AnimationVariants.js';

export default function ProjectBriefBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_type: '',
    budget: '',
    timeline: '',
    team_size: '',
    key_features: '',
    target_audience: '',
    additional_requirements: ''
  });
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const steps = [
    {
      title: 'Project basics',
      fields: [
        { name: 'title', label: 'Project Title', type: 'text', placeholder: 'My Awesome Project' },
        { name: 'description', label: 'Project Description', type: 'textarea', placeholder: 'Describe your project in a few sentences...' }
      ]
    },
    {
      title: 'Project type',
      fields: [
        {
          name: 'project_type',
          label: 'What type of project are you building?',
          type: 'radio',
          options: ['E-commerce', 'SaaS', 'Mobile App', 'Blog', 'Portfolio', 'Desktop App', 'API', 'Other']
        }
      ]
    },
    {
      title: 'Budget & timeline',
      fields: [
        {
          name: 'budget',
          label: 'What is your budget range?',
          type: 'radio',
          options: ['<5k', '5k-25k', '25k-100k', '100k+']
        },
        {
          name: 'timeline',
          label: 'What is your timeline?',
          type: 'radio',
          options: ['<1 month', '1-3 months', '3-6 months', '6+ months']
        }
      ]
    },
    {
      title: 'Team details',
      fields: [
        { name: 'team_size', label: 'Team Size', type: 'text', placeholder: 'e.g., 3 developers, 1 designer' }
      ]
    },
    {
      title: 'Features & audience',
      fields: [
        { name: 'key_features', label: 'Key Features Needed', type: 'textarea', placeholder: 'List the main features your project needs...' },
        { name: 'target_audience', label: 'Target Audience', type: 'text', placeholder: 'Who will use this product?' }
      ]
    },
    {
      title: 'Additional requirements',
      fields: [
        { name: 'additional_requirements', label: 'Any other requirements?', type: 'textarea', placeholder: 'Specific integrations, compliance needs, etc.' }
      ]
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        variant: 'destructive',
        title: 'Authentication required',
        description: 'Please log in to save your project brief'
      });
      navigate('/login');
      return;
    }

    if (!formData.title) {
      toast({
        variant: 'destructive',
        title: 'Title required',
        description: 'Please provide a project title.'
      });
      return;
    }

    setIsGenerating(true);

    try {
      const roadmapData = await generateRoadmap(formData);

      const project = await pb.collection('projects').create({
        user_id: currentUser.id,
        title: formData.title,
        description: formData.description,
        project_type: formData.project_type,
        budget: formData.budget,
        timeline: formData.timeline,
        status: 'Planning'
      }, { $autoCancel: false });

      const briefContent = {
        team_size: formData.team_size,
        key_features: formData.key_features,
        target_audience: formData.target_audience,
        additional_requirements: formData.additional_requirements
      };

      await pb.collection('briefs').create({
        project_id: project.id,
        user_id: currentUser.id,
        content: briefContent,
        generated_roadmap: roadmapData.phases,
        recommended_tools: roadmapData.recommendedTools.map(t => t.id),
        timeline_estimate: roadmapData.timeline
      }, { $autoCancel: false });

      await pb.collection('roadmaps').create({
        project_id: project.id,
        tech_stack: roadmapData.techStack,
        phases: roadmapData.phases,
        steps: roadmapData.steps
      }, { $autoCancel: false });

      toast({
        title: 'Roadmap generated!',
        description: 'Your comprehensive project roadmap is ready.'
      });

      navigate(`/roadmap/${project.id}`);

    } catch (error) {
      console.error('Failed to save brief & roadmap:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Failed to generate project roadmap. Please try again.'
      });
      setIsGenerating(false);
    }
  };

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  return (
    <>
      <Helmet>
        <title>Project Brief Builder - Idea Pulse</title>
        <meta name="description" content="Build a comprehensive project brief and get an AI-generated roadmap tailored to your needs." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              
              {isGenerating ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="min-h-[60vh] flex flex-col items-center justify-center space-y-6"
                >
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">Analyzing your brief...</h2>
                    <p className="text-muted-foreground">Generating personalized tech stack and implementation roadmap.</p>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="mb-12 text-center"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ letterSpacing: '-0.02em', textWrap: 'balance' }}>
                      Build your project brief
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Answer a few questions to get a personalized implementation roadmap and tool recommendations.
                    </p>
                  </motion.div>

                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="mb-8"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        Step {currentStep + 1} of {steps.length}
                      </span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}% complete</span>
                    </div>
                    <motion.div 
                      className="h-2 bg-muted rounded-full overflow-hidden"
                    >
                      <motion.div 
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </motion.div>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Card className="shadow-lg border-border/50">
                        <CardHeader>
                          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
                            {currentStepData.fields.map((field) => (
                              <motion.div key={field.name} variants={slideInLeft} className="space-y-3">
                                <Label htmlFor={field.name} className="text-base">{field.label}</Label>
                                {field.type === 'text' && (
                                  <Input
                                    id={field.name}
                                    type="text"
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    className="text-foreground text-base py-6 transition-all focus:ring-2"
                                  />
                                )}
                                {field.type === 'textarea' && (
                                  <Textarea
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    value={formData[field.name]}
                                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                                    rows={4}
                                    className="text-foreground text-base resize-none transition-all focus:ring-2"
                                  />
                                )}
                                {field.type === 'radio' && (
                                  <RadioGroup
                                    value={formData[field.name]}
                                    onValueChange={(value) => handleInputChange(field.name, value)}
                                    className="grid sm:grid-cols-2 gap-3"
                                  >
                                    {field.options.map((option) => (
                                      <Label 
                                        key={option} 
                                        htmlFor={`${field.name}-${option}`} 
                                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:bg-muted/50 transition-colors ${formData[field.name] === option ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : ''}`}
                                      >
                                        <span className="font-medium text-base">{option}</span>
                                        <RadioGroupItem value={option} id={`${field.name}-${option}`} />
                                      </Label>
                                    ))}
                                  </RadioGroup>
                                )}
                              </motion.div>
                            ))}
                          </motion.div>

                          <div className="flex gap-3 pt-8 border-t">
                            {currentStep > 0 && (
                              <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap">
                                <Button variant="outline" size="lg" onClick={handlePrevious} className="gap-2">
                                  <ChevronLeft className="w-4 h-4" />
                                  Previous
                                </Button>
                              </motion.div>
                            )}
                            {!isLastStep ? (
                              <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="ml-auto">
                                <Button size="lg" onClick={handleNext} className="gap-2">
                                  Next
                                  <ChevronRight className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div variants={hoverButton} initial="rest" whileHover="hover" whileTap="tap" className="ml-auto">
                                <Button size="lg" onClick={handleSubmit} className="gap-2 shadow-md">
                                  <Sparkles className="w-4 h-4" />
                                  Generate Roadmap
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>
            
            <FloatingChat />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}