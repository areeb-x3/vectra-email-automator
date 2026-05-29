import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart, Users, Palette, Link, ShieldAlert } from 'lucide-react';
import FeatureCard from '../modules/ui/FeatureCard';
import { staggerContainer, itemFadeIn } from '../lib/motion';
import './Features.css';

const featuresData = [
  {
    icon: <Zap size={24} color="url(#gradient-zap)" />, // Pure Green to Emerald
    title: 'Smart Automation',
    description: 'Set up complex email sequences that respond to user behavior in real-time.',
    iconColor: '#22c55e',
    iconColorRgb: '34, 197, 94'
  },
  {
    icon: <BarChart size={24} color="url(#gradient-chart)" />, // Emerald to Neon
    title: 'Advanced Analytics',
    description: 'Track opens, clicks, conversions and gain actionable insights about your campaigns.',
    iconColor: '#10b981',
    iconColorRgb: '16, 185, 129'
  },
  {
    icon: <Users size={24} color="url(#gradient-users)" />, // Vivid Mint to Jade
    title: 'Audience Segmentation',
    description: 'Target specific segments with personalized content for higher engagement rates.',
    iconColor: '#34d399',
    iconColorRgb: '52, 211, 153'
  },
  {
    icon: <Palette size={24} color="url(#gradient-palette)" />, // Neon to Brand Green
    title: 'Beautiful Templates',
    description: 'Choose from hundreds of professionally designed email templates.',
    iconColor: '#4ade80',
    iconColorRgb: '74, 222, 128'
  },
  {
    icon: <Link size={24} color="url(#gradient-link)" />, // Vibrant Green to Mint
    title: 'Easy Integration',
    description: 'Connect with your favorite tools like CRM, e-commerce, and webhooks.',
    iconColor: '#22c55e',
    iconColorRgb: '34, 197, 94'
  },
  {
    icon: <ShieldAlert size={24} color="url(#gradient-shield)" />, // Vivid Jade to Mint
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, CCPA, and industry standards.',
    iconColor: '#059669',
    iconColorRgb: '5, 150, 105'
  }
];

const Features = () => {
  return (
    <section id="features" className="features-section">
      {/* SVG Gradient Definitions for Multicolored Icons */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <linearGradient id="gradient-zap" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="gradient-chart" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="gradient-users" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gradient-palette" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>
          <linearGradient id="gradient-link" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
          <linearGradient id="gradient-shield" x1="0%" y1="0%" x2="100%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Powerful Features</h2>
          <div className="header-line"></div>
        </motion.div>
        <motion.div 
          className="features-grid"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
        >
          {featuresData.map((feature, index) => (
            <motion.div key={index} variants={itemFadeIn}>
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                iconColor={feature.iconColor}
                iconColorRgb={feature.iconColorRgb}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
