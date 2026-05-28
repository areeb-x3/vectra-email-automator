import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import IconWrapper from '../ui/IconWrapper';
import styles from './ScheduleCard.module.css';

const schedules = [
  { title: 'Weekly Newsletter', desc: 'Sent to 4.2k subscribers', group: 'Newsletter', timing: 'Every Monday, 9:00 AM' },
  { title: 'Product Updates', desc: 'Internal test group', group: 'Changelog', timing: 'Wednesdays, 2:00 PM' },
];

const ScheduleCard = () => {
  return (
    <Card className={styles.card}>
      <div className={styles.header} >
        <h3 className={styles.title}>Active Schedules</h3>
        <button className={styles.viewAll}>View All</button>
      </div>

      <div className={styles.list}>
        {schedules.map((schedule, index) => (
          <motion.div 
            key={index} 
            className={styles.item}
          >
            <div className={styles.itemLeft}>
              <IconWrapper className={styles.iconContainer}>
                <ScheduleIcon />
              </IconWrapper>
              <div className={styles.text}>
                <h4 className={styles.itemName}>{schedule.title}</h4>
                <p className={styles.itemDesc}>{schedule.desc}</p>
              </div>
            </div>

            <div className={styles.itemRight}>
              <div className={styles.metadataGroup}>
                <Badge variant="muted">{schedule.group}</Badge>
                <Badge variant="neon" icon={ClockIcon}>{schedule.timing}</Badge>
              </div>
              <div className={styles.actionAffordance}>
                <ChevronIcon />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

const ChevronIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const ScheduleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/><path d="M18 22a5.66 5.66 0 1 0-5.66-5.66l5.66 5.66Z"/><path d="M18 18h.01"/>
  </svg>
);

export default ScheduleCard;
