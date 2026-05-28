import React from 'react';
import Card from '../ui/Card';
import styles from './StatsRow.module.css';

const stats = [
  { label: 'Active Campaigns', value: '12', glowColor: 'rgba(79, 70, 229, 0.5)' },
  { label: 'Total Sends', value: '1,284', glowColor: 'rgba(124, 58, 237, 0.5)' },
  { label: 'Open Rate', value: '64.2%', glowColor: 'rgba(6, 182, 212, 0.5)' },
];

const StatsRow = () => {
  return (
    <div className={styles.statsRow}>
      {stats.map((stat, index) => (
        <Card 
          key={index}
          interactive={true}
          glowColor={stat.glowColor}
          className={styles.statCard}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <div className={styles.content}>
            <div className={styles.statLabel}>{stat.label}</div>
            <div className={styles.statValue}>
              {stat.value}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsRow;
