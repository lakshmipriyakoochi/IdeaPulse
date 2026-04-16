import pb from '@/lib/pocketbaseClient';

export async function generateRoadmap(briefData) {
  const { project_type, budget, timeline, key_features, target_audience, team_size } = briefData;

  // Fetch all tools to select from
  const tools = await pb.collection('tools').getFullList({
    $autoCancel: false,
    sort: '-rating'
  });

  const roadmap = {
    techStack: { frontend: [], backend: [], database: [] },
    phases: [],
    steps: {},
    recommendedTools: [],
    timeline: 0
  };

  // 1. Smart Tech Stack based on project type
  const type = project_type?.toLowerCase() || '';
  let preferredFrontend = [];
  let preferredBackend = [];
  let preferredDatabase = [];

  if (type.includes('e-commerce')) {
    preferredFrontend = ['React', 'Next.js', 'Tailwind'];
    preferredBackend = ['Stripe', 'Vercel', 'Auth0'];
    preferredDatabase = ['Supabase', 'PostgreSQL'];
  } else if (type.includes('saas')) {
    preferredFrontend = ['React', 'Next.js', 'Tailwind'];
    preferredBackend = ['Auth0', 'Vercel', 'Firebase'];
    preferredDatabase = ['MongoDB', 'Supabase'];
  } else if (type.includes('mobile')) {
    preferredFrontend = ['React', 'Tailwind'];
    preferredBackend = ['Firebase', 'Supabase'];
    preferredDatabase = ['Firebase', 'MongoDB'];
  } else if (type.includes('api')) {
    preferredFrontend = ['Postman', 'Swagger'];
    preferredBackend = ['Vercel', 'Cloudflare', 'Auth0'];
    preferredDatabase = ['MongoDB', 'Supabase'];
  } else if (type.includes('blog')) {
    preferredFrontend = ['React', 'Tailwind', 'Storybook'];
    preferredBackend = ['Contentful', 'Vercel'];
    preferredDatabase = ['Supabase', 'MongoDB'];
  } else {
    preferredFrontend = ['React', 'Tailwind', 'Next.js'];
    preferredBackend = ['Vercel', 'Firebase', 'Auth0'];
    preferredDatabase = ['Supabase', 'MongoDB'];
  }

  // 2. Budget-based extra tools
  const budgetStr = budget?.toLowerCase() || '';
  let extraTools = [];
  if (budgetStr.includes('100k')) {
    extraTools = ['Sentry', 'AWS', 'Cypress', 'Linear'];
  } else if (budgetStr.includes('25k')) {
    extraTools = ['Sentry', 'Postman', 'Linear'];
  } else if (budgetStr.includes('5k')) {
    extraTools = ['GitHub', 'Vercel', 'Tailwind'];
  } else {
    extraTools = ['GitHub', 'Vercel'];
  }

  // 3. Feature-based extra tools
  const features = key_features?.toLowerCase() || '';
  if (features.includes('auth') || features.includes('login')) {
    preferredBackend.push('Auth0', 'Firebase');
  }
  if (features.includes('payment') || features.includes('stripe')) {
    preferredBackend.push('Stripe');
  }
  if (features.includes('ai') || features.includes('chatbot') || features.includes('ml')) {
    preferredBackend.push('OpenAI');
  }
  if (features.includes('storage') || features.includes('upload') || features.includes('file')) {
    preferredDatabase.push('AWS S3');
  }
  if (features.includes('email') || features.includes('notification')) {
    preferredBackend.push('Postman');
  }
  if (features.includes('test') || features.includes('qa')) {
    extraTools.push('Cypress');
  }
  if (features.includes('monitor') || features.includes('error')) {
    extraTools.push('Sentry');
  }

  // Helper to find tools
  const findTools = (preferredNames, categories, limit = 2) => {
    let matched = tools.filter(t =>
      categories.includes(t.category) &&
      preferredNames.some(name => t.name.toLowerCase().includes(name.toLowerCase()))
    );
    if (matched.length < limit) {
      const generic = tools.filter(t => categories.includes(t.category) && !matched.includes(t));
      matched = [...matched, ...generic].slice(0, limit);
    }
    return matched.slice(0, limit);
  };

  roadmap.techStack.frontend = findTools(preferredFrontend, ['Development Platforms', 'UI Component Libraries'], 2);
  roadmap.techStack.backend = findTools(preferredBackend, ['Backend/Database', 'Hosting', 'Authentication', 'Payment Processing', 'AI/ML', 'API/Integration'], 3);
  roadmap.techStack.database = findTools(preferredDatabase, ['Backend/Database', 'Storage'], 2);

  // Add extra budget/feature tools
  const extraMatched = tools.filter(t =>
    extraTools.some(name => t.name.toLowerCase().includes(name.toLowerCase()))
  ).slice(0, 3);

  roadmap.recommendedTools = [
    ...roadmap.techStack.frontend,
    ...roadmap.techStack.backend,
    ...roadmap.techStack.database,
    ...extraMatched
  ].filter((tool, index, self) => self.findIndex(t => t.id === tool.id) === index);

  // 4. Timeline Estimate
  const timelineStr = timeline?.toLowerCase() || '';
  if (timelineStr.includes('<1')) roadmap.timeline = 30;
  else if (timelineStr.includes('1-3')) roadmap.timeline = 90;
  else if (timelineStr.includes('3-6')) roadmap.timeline = 180;
  else roadmap.timeline = 240;

  // Budget affects timeline multiplier
  let timelineMultiplier = 1;
  if (budgetStr.includes('<5k')) timelineMultiplier = 0.8;
  else if (budgetStr.includes('5k-25k')) timelineMultiplier = 1;
  else if (budgetStr.includes('25k-100k')) timelineMultiplier = 1.2;
  else if (budgetStr.includes('100k')) timelineMultiplier = 1.5;
  roadmap.timeline = Math.round(roadmap.timeline * timelineMultiplier);

  // 5. Dynamic Phases based on budget & features
  const hasAI = features.includes('ai') || features.includes('ml');
  const hasPayment = features.includes('payment') || features.includes('stripe');
  const isLargeBudget = budgetStr.includes('25k') || budgetStr.includes('100k');

  roadmap.phases = [
    {
      id: 1,
      name: 'Setup & Planning',
      duration: Math.max(7, Math.floor(roadmap.timeline * 0.1)),
      description: `Initial project setup for ${project_type || 'your project'}, repository creation, and architecture planning${isLargeBudget ? ' with detailed technical specifications' : ''}.`
    },
    {
      id: 2,
      name: 'Frontend Development',
      duration: Math.max(14, Math.floor(roadmap.timeline * 0.25)),
      description: `Building the user interface${target_audience ? ` for ${target_audience}` : ''}, routing, and state management using your chosen UI framework.`
    },
    {
      id: 3,
      name: 'Backend Development',
      duration: Math.max(14, Math.floor(roadmap.timeline * 0.25)),
      description: `API design, authentication, and core business logic${hasPayment ? ' including payment integration' : ''}${hasAI ? ' with AI/ML features' : ''}.`
    },
    {
      id: 4,
      name: 'Database & Integration',
      duration: Math.max(7, Math.floor(roadmap.timeline * 0.15)),
      description: `Schema design, frontend-backend connection${key_features ? `, and integrations for: ${key_features.slice(0, 80)}` : ', and 3rd-party integrations'}.`
    },
    ...(isLargeBudget ? [{
      id: 5,
      name: 'Performance & Security',
      duration: Math.max(7, Math.floor(roadmap.timeline * 0.1)),
      description: 'Load testing, security audits, performance optimization, and scalability improvements.'
    }] : []),
    {
      id: isLargeBudget ? 6 : 5,
      name: 'Testing & Deployment',
      duration: Math.max(7, Math.floor(roadmap.timeline * 0.15)),
      description: `QA testing, CI/CD setup, hosting${isLargeBudget ? ', monitoring with Sentry' : ''}, and final release.`
    }
  ];

  // 6. Dynamic Steps
  roadmap.steps = {
    1: [
      { title: 'Version Control Setup', description: 'Initialize Git repository on GitHub and setup branching strategy.' },
      { title: 'Development Environment', description: 'Configure linters, formatters, and local development tools.' },
      { title: 'Project Scaffolding', description: `Initialize the base ${project_type || 'application'} using chosen frameworks.` }
    ],
    2: [
      { title: 'UI/UX Design Implementation', description: 'Translate designs into functional components using Tailwind CSS.' },
      { title: 'Framework Setup', description: 'Configure routing, layouts, and global providers.' },
      { title: 'Interactivity', description: `Implement client-side logic, forms, and state management${target_audience ? ` optimized for ${target_audience}` : ''}.` }
    ],
    3: [
      { title: 'Server Setup', description: 'Initialize backend framework and middleware.' },
      { title: 'Authentication', description: 'Implement user login, registration, and session management.' },
      { title: 'API Endpoints', description: `Create REST endpoints for: ${key_features ? key_features.slice(0, 100) : 'core features'}.` },
      ...(hasPayment ? [{ title: 'Payment Integration', description: 'Setup Stripe for secure payment processing and subscriptions.' }] : []),
      ...(hasAI ? [{ title: 'AI Integration', description: 'Connect OpenAI API for intelligent features.' }] : [])
    ],
    4: [
      { title: 'Database Schema', description: 'Design and implement database tables/collections.' },
      { title: 'API Integration', description: 'Connect frontend clients to backend APIs.' },
      { title: 'Error Handling', description: 'Implement robust error logging and user feedback.' }
    ],
    5: isLargeBudget ? [
      { title: 'Load Testing', description: 'Test application under high traffic conditions.' },
      { title: 'Security Audit', description: 'Review authentication, data handling, and vulnerability scanning.' },
      { title: 'Performance Optimization', description: 'Optimize queries, caching, and asset delivery.' }
    ] : [
      { title: 'Hosting Setup', description: 'Configure production servers or serverless environments.' },
      { title: 'CI/CD Pipeline', description: 'Automate testing and deployment processes.' },
      { title: 'Monitoring & Launch', description: 'Setup analytics, configure domain/SSL, and go live.' }
    ],
    6: [
      { title: 'Hosting Setup', description: 'Configure production servers or serverless environments.' },
      { title: 'CI/CD Pipeline', description: 'Automate testing and deployment processes.' },
      { title: 'Monitoring & Launch', description: 'Setup analytics, configure domain/SSL, and go live.' }
    ]
  };

  return roadmap;
}