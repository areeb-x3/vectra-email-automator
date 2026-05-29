import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Hero from './sections/Hero';
import Features from './sections/Features';
import CTA from './sections/CTA';

// Dynamic code-splitting for high Lighthouse Performance
const LoginPage = lazy(() => import('./modules/auth/LoginPage'));
const SignupPage = lazy(() => import('./modules/auth/SignupPage'));
const Dashboard = lazy(() => import('./modules/dashboard/Dashboard'));

import { OrganisationProvider } from './context/OrganisationContext';
import { SchedulerProvider } from './context/SchedulerContext';
import { CommunityProvider } from './context/CommunityContext';
import { ThemeProvider } from './context/ThemeContext';

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === '#features') {
      const timer = setTimeout(() => {
        const element = document.getElementById('features');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Features />
      <CTA />
    </>
  );
};

const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
    backgroundColor: '#050505',
    color: '#16a34a'
  }}>
    <div style={{
      width: '3rem',
      height: '3rem',
      border: '4px solid rgba(22, 163, 74, 0.1)',
      borderTop: '4px solid #16a34a',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="app-wrapper">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <OrganisationProvider>
        <SchedulerProvider>
          <CommunityProvider>
            <Router>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="*" element={<AppContent />} />
                </Routes>
              </Suspense>
            </Router>
          </CommunityProvider>
        </SchedulerProvider>
      </OrganisationProvider>
    </ThemeProvider>
  );
}

export default App;
