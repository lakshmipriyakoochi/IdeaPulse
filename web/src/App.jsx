import React from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import HomePage from '@/pages/HomePage.jsx';
import ToolsDirectory from '@/pages/ToolsDirectory.jsx';
import ToolDetailPage from '@/pages/ToolDetailPage.jsx';
import ProjectBriefBuilder from '@/pages/ProjectBriefBuilder.jsx';
import RoadmapPage from '@/pages/RoadmapPage.jsx';
import UserDashboard from '@/pages/UserDashboard.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import ProfilePage from '@/pages/ProfilePage.jsx';
import AdminDashboard from '@/pages/AdminDashboard.jsx';
import { pageTransition } from '@/lib/AnimationVariants.js';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
        <Route path="/tools" element={<PageWrapper><ToolsDirectory /></PageWrapper>} />
        <Route path="/tools/:id" element={<PageWrapper><ToolDetailPage /></PageWrapper>} />
        <Route path="/brief-builder" element={<PageWrapper><ProjectBriefBuilder /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
        <Route
          path="/roadmap/:projectId"
          element={
            <ProtectedRoute>
              <PageWrapper><RoadmapPage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><UserDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageWrapper><ProfilePage /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <AnimatedRoutes />
      </AuthProvider>
    </Router>
  );
}
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <a href="/" className="text-primary hover:underline font-medium">
          Back to home
        </a>
      </div>
    </div>
  );
}

export default App;