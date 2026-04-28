import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/ui/Button';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.9)"]
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
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05 }}
        >
          <span className="logo-icon">V</span>
          <span className="logo-text">Vectra</span>
        </motion.div>
        
        <div className="nav-links">
          {['Features', 'Solutions', 'Pricing'].map((link) => (
            <motion.a 
              key={link} 
              href="#"
              className="nav-link"
              whileHover={{ color: "var(--primary-light)" }}
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
          <Button variant="secondary" className="btn-sm" style={{ marginRight: '1rem' }} href="#">Log In</Button>
          <Button variant="primary" className="btn-sm" href="#">Sign In</Button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
