import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import AuthModal from './pages/auth/AuthModal';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import LocationPage from './pages/LocationPage';
import Gta6ManualBookingPage from './pages/Gta6ManualBookingPage';
import GtaViPage from './pages/GtaViPage';
import TicketPage from './pages/TicketPage';
import ProfilePage from './pages/ProfilePage';
import Footer from './components/layout/Footer';

// React Bits Components
import AnimatedContent from '@/components/AnimatedContent';
import { SwipeToastProvider } from '@/components/SwipeToast';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('grid_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authOpen, setAuthOpen] = useState(false);
  const pendingAuthCallbackRef = useRef(null);

  const handleRequireLogin = useCallback((resumeCallback) => {
    pendingAuthCallbackRef.current =
      typeof resumeCallback === 'function' ? resumeCallback : null;
    setAuthOpen(true);
  }, []);

  const handleAuthOpenChange = useCallback((nextOpen) => {
    setAuthOpen(nextOpen);
    if (!nextOpen) {
      pendingAuthCallbackRef.current = null;
    }
  }, []);

  const handleLoginSuccess = useCallback((loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('grid_user', JSON.stringify(loggedInUser));

    if (typeof pendingAuthCallbackRef.current === 'function') {
      const resumeFn = pendingAuthCallbackRef.current;
      pendingAuthCallbackRef.current = null;
      resumeFn(loggedInUser);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('grid_user');
    localStorage.removeItem('grid_token');
  }, []);

  return (
    <SwipeToastProvider>
      <div className="min-h-screen bg-obsidian text-white selection:bg-neon selection:text-obsidian flex flex-col justify-between">
        <ScrollToTop />

        {/* Fixed SaaS Navbar + Top GTA VI Countdown Banner */}
        <Navbar
          user={user}
          onLoginClick={() => handleRequireLogin()}
          onLogout={handleLogout}
        />

        {/* Main Route View Wrapped with React Bits AnimatedContent */}
        <main className="flex-1">
          <AnimatedContent
            key={location.pathname}
            distance={40}
            direction="vertical"
            duration={1}
            ease="power3.out"
            blur={12}
            stagger={0.08}
            threshold={0.1}
          >
            <Routes location={location}>
              <Route index element={<HomePage />} />
              <Route path="/gta-vi" element={<GtaViPage />} />
              <Route path="/gta-6" element={<GtaViPage />} />
              <Route path="/games" element={<GamesPage />} />
              <Route path="/location" element={<LocationPage />} />
              <Route
                path="/book"
                element={
                  <Gta6ManualBookingPage
                    user={user}
                    onRequireLogin={handleRequireLogin}
                  />
                }
              />
              <Route
                path="/book-gta6"
                element={
                  <Gta6ManualBookingPage
                    user={user}
                    onRequireLogin={handleRequireLogin}
                  />
                }
              />
              <Route path="/ticket/:token" element={<TicketPage />} />
              <Route
                path="/profile"
                element={
                  <ProfilePage
                    user={user}
                    onUserUpdate={handleLoginSuccess}
                    onRequireLogin={handleRequireLogin}
                    onLogout={handleLogout}
                  />
                }
              />
            </Routes>
          </AnimatedContent>
        </main>

        <Footer />

        {/* Dynamic Nodemailer Email OTP Auth Modal */}
        <AuthModal
          open={authOpen}
          onOpenChange={handleAuthOpenChange}
          onSuccess={handleLoginSuccess}
        />
      </div>
    </SwipeToastProvider>
  );
}
