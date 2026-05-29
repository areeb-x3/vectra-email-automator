import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Button from '../modules/ui/Button';
import './Navbar.css';
import vectraLogo from '../assets/vectra_logo.svg';
import { useTheme } from '../context/ThemeContext';
import { authAPI } from '../lib/api';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(var(--theme-bg-rgb), 0)", "rgba(var(--theme-bg-rgb), 0.9)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [user, setUser] = useState(null);

  useEffect(() => {
    authAPI.getCurrentUser()
      .then(res => {
        if (res.status === 'success' && res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  return (
    <motion.nav
      className="navbar"
      style={{
        backgroundColor,
        borderBottom: isScrolled ? "1px solid var(--border-dark)" : "1px solid transparent"
      }}
    >
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src={vectraLogo} alt="Vectra" className="logo-icon" />
          <span className="logo-text">Vectra</span>
        </Link>

        <div className="nav-links">
          {['Features', 'Solutions', 'Pricing'].map((link) => (
            <motion.a
              key={link}
              href="#"
              className="nav-link"
              whileHover={{ color: "var(--primary)" }}
            >
              {link}
              <motion.div
                className="link-underline"
                layoutId="underline"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.a>
          ))}
        </div>

        <div className="nav-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>

          {user ? (
            <Button variant="glow" className="btn-sm" to="/dashboard">Dashboard</Button>
          ) : isAuthPage ? null : (
            <>
              <Button variant="secondary" className="btn-sm" to="/login">Log In</Button>
              <Button variant="primary" className="btn-sm" to="/signup">Sign Up</Button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
