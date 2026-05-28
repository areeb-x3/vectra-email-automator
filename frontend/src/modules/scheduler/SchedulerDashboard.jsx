import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduler } from '../../context/SchedulerContext';
import SchedulerCard from './SchedulerCard';
import SchedulerActivitySidebar from './SchedulerActivitySidebar';
import styles from './SchedulerDashboard.module.css';

const SchedulerDashboard = () => {
  const { schedules, stats } = useScheduler();
  const [filter, setFilter] = useState('all'); // all, active, paused, failed, draft
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSchedules = schedules.filter(s => {
    const matchesFilter = filter === 'all' || s.state === filter;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.dashboard}>
      <div className={styles.layout}>
        <div className={styles.mainContent}>
          {/* Operational Summary */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total Schedules</span>
              <span className={styles.statValue}>{stats.total}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Active</span>
              <span className={`${styles.statValue} ${styles.textActive}`}>{stats.active}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Failed</span>
              <span className={`${styles.statValue} ${stats.failed > 0 ? styles.textFailed : ''}`}>{stats.failed}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Upcoming Executions</span>
              <span className={styles.statValue}>{stats.upcomingExecutions}</span>
            </div>
          </div>

          {/* Filters & Controls */}
          <div className={styles.controls}>
            <div className={styles.tabs}>
              {['all', 'active', 'paused', 'failed', 'draft'].map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${filter === tab ? styles.activeTab : ''}`}
                  onClick={() => setFilter(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className={styles.tabCount}>
                    {tab === 'all' ? schedules.length : schedules.filter(s => s.state === tab).length}
                  </span>
                </button>
              ))}
            </div>
            <div className={styles.actions}>
               <div className={styles.searchBox}>
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                   <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                 </svg>
                 <input 
                   type="text" 
                   placeholder="Search schedules..." 
                   className={styles.searchInput} 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
               </div>
            </div>
          </div>

          {/* Schedules List */}
          <div className={styles.listContainer}>
            <AnimatePresence>
              {filteredSchedules.length > 0 ? (
                filteredSchedules.map(schedule => (
                  <motion.div
                    key={schedule.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SchedulerCard schedule={schedule} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className={styles.emptyState}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <h3>No schedules found</h3>
                  <p>Try adjusting your filters or create a new schedule.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Activity Log Sidebar */}
        <SchedulerActivitySidebar />
      </div>
    </div>
  );
};

export default SchedulerDashboard;
