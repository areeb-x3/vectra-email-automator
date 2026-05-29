import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import styles from './PremiumBanner.module.css';

const PremiumBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

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
          <Button variant="glass" className={styles.secondaryBtn} onClick={handleDismiss}>
            Not Interested
          </Button>
        </div>
      </div>

      <div className={styles.visual}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
        <div className={styles.circle3} />
      </div>
    </Card>
  );
};

export default PremiumBanner;
