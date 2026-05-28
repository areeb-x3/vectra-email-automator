import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SchedulerDashboard from './SchedulerDashboard';
import SchedulerLogsModal from './SchedulerLogsModal';
import Button from '../ui/Button';
import { useScheduler } from '../../context/SchedulerContext';
import styles from './SchedulerPage.module.css';

const SchedulerPage = () => {
  const { activeScheduleId, setActiveScheduleId } = useScheduler();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Scheduler</h1>
          <p className={styles.subtitle}>Manage automated email campaigns and recurring workflows</p>
        </div>
        <div className={styles.headerTip}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>To create a new schedule, use the "Compose" tab in an Organisation workspace.</span>
        </div>
      </div>

      <SchedulerDashboard />

      <SchedulerLogsModal
        isOpen={!!activeScheduleId}
        onClose={() => setActiveScheduleId(null)}
        scheduleId={activeScheduleId}
      />
    </div>
  );
};

export default SchedulerPage;
