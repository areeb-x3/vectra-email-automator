import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import styles from './PremiumBanner.module.css';

const PremiumBanner = () => {
  return (
    <Card variant="prominent" className={styles.banner}>
      <div className={styles.content}>
        <Badge variant="premium" className={styles.badge}>Premium</Badge>
        <h2 className={styles.heading}>Vectra Premium</h2>
        <p className={styles.description}>
          Unlock advanced automation, unlimited schedules, and priority support. 
          Take your email campaigns to the next level.
        </p>
        <div className={styles.actions}>
          <Button variant="glow" className={styles.primaryBtn}>
            Upgrade Plan
          </Button>
          <Button variant="glass" className={styles.secondaryBtn}>
            Not Interested
          </Button>
        </div>
      </div>

      <div className={styles.visual}>
        <motion.div 
          className={styles.circle1}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <motion.div 
          className={styles.circle2}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, -120, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
        <motion.div 
          className={styles.circle3}
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
        />
      </div>
    </Card>
  );
};

export default PremiumBanner;
