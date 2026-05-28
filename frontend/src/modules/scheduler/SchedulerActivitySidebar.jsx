import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganisations } from '../../context/OrganisationContext';
import styles from './SchedulerActivitySidebar.module.css';

const SchedulerActivitySidebar = () => {
  const { activeOrganisation } = useOrganisations();
  const activities = activeOrganisation?.activities || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return styles.statusSuccess;
      case 'pending': return styles.statusPending;
      case 'failed': return styles.statusFailed;
      default: return styles.statusDefault;
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Activity Log</h3>
        <div className={styles.liveIndicator}>
          <span className={styles.pulse}></span>
          Live
        </div>
      </div>
      
      <div className={styles.feed}>
        <AnimatePresence>
          {activities.length > 0 ? (
            activities.slice(0, 15).map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.logItem}
              >
                <div className={styles.timeline}>
                  <div className={`${styles.dot} ${getStatusColor(activity.status)}`} />
                  {index !== activities.slice(0, 15).length - 1 && <div className={styles.line} />}
                </div>
                <div className={styles.content}>
                  <p className={styles.text}>{activity.content}</p>
                  <span className={styles.timestamp}>{activity.timestamp}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={styles.empty}>
              <p>No recent scheduler activity.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SchedulerActivitySidebar;
