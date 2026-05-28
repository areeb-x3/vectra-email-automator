import React from 'react';
import { motion } from 'framer-motion';
import Button from '../modules/ui/Button';
import { staggerContainer, itemFadeIn } from '../lib/motion';
import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section">
      <motion.div 
        className="container cta-container"
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemFadeIn}>Ready to Transform Your Email Marketing?</motion.h2>
        <motion.p variants={itemFadeIn}>Join thousands of businesses automating their email campaigns today.</motion.p>
        <motion.div variants={itemFadeIn}>
          <Button variant="primary" className="btn-lg" href="#">Start Your Free Trial</Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CTA;
