import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../modules/ui/Button';
import DashboardPreview from '../modules/dashboard/DashboardPreview';
import { staggerContainer, itemFadeIn } from '../lib/motion';
import { authAPI } from '../lib/api';
import './Hero.css';
import heroImg from '../assets/hero.png';

const Hero = () => {
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
    <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
      <motion.div
        className="hero-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ duration: 1 }}
      ></motion.div>
      <div className="container hero-container">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >

          <motion.h1 variants={itemFadeIn}>
            Automate Your <span className="text-gradient">Email Campaigns</span>
          </motion.h1>
          <motion.p variants={itemFadeIn}>
            Save hours every week with intelligent email automation.
            Reach the right people at the right time with personalized campaigns.
          </motion.p>
          <motion.div variants={itemFadeIn} className="hero-actions">
            {user ? (
              <Button variant="primary" to="/dashboard">Open Vectra</Button>
            ) : (
              <>
                <Button variant="primary" to="/signup">Get Started Free</Button>
                <Button variant="secondary" href="#">Watch Demo</Button>
              </>
            )}
          </motion.div>

          <motion.div
            variants={{
              initial: { opacity: 0, y: 40, scale: 0.95 },
              animate: { opacity: 1, y: 0, scale: 1 }
            }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <DashboardPreview />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
