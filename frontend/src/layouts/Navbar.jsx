import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../modules/ui/Button';
import './Navbar.css';
import vectraLogo from '../assets/vectra_logo.svg';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    theme === 'light'
      ? ["rgba(248, 250, 252, 0)", "rgba(248, 250, 252, 0.9)"]
      : ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.9)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className="navbar"
      style={{
        backgroundColor,
        borderBottom: isScrolled ? "1px solid var(--border)" : "1px solid transparent"
      }}
    >
      <div className="container nav-container">
        <Link to="/">
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
          >
            <img src={vectraLogo} alt="Vectra" className="logo-icon" />
            <span className="logo-text">Vectra</span>
          </motion.div>
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
          <motion.button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle Theme"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
            }}
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
          </motion.button>

          <Button variant="glow" className="btn-sm" to="/dashboard">Dashboard</Button>
          <Button variant="secondary" className="btn-sm" to="/login">Log In</Button>
          <Button variant="primary" className="btn-sm" to="/signup">Sign In</Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
