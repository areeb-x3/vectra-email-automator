import React from 'react';
import { motion } from 'framer-motion';
import FeatureCard from '../components/ui/FeatureCard';
import { staggerContainer, itemFadeIn } from '../lib/motion';
import './Features.css';

const featuresData = [
  {
    icon: '⚡',
    title: 'Smart Automation',
    description: 'Set up complex email sequences that respond to user behavior in real-time.'
  },
  {
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Track opens, clicks, conversions and gain actionable insights about your campaigns.'
  },
  {
    icon: '👥',
    title: 'Audience Segmentation',
    description: 'Target specific segments with personalized content for higher engagement rates.'
  },
  {
    icon: '🎨',
    title: 'Beautiful Templates',
    description: 'Choose from hundreds of professionally designed email templates.'
  },
  {
    icon: '🔗',
    title: 'Easy Integration',
    description: 'Connect with your favorite tools like CRM, e-commerce, and webhooks.'
  },
  {
    icon: '🛡️',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, CCPA, and industry standards.'
  }
];

const Features = () => {
  return (
    <section className="features-section">
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
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
