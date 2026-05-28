import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduler } from '../../context/SchedulerContext';
import styles from './SchedulerCard.module.css';

const SchedulerCard = ({ schedule }) => {
  const { toggleScheduleState, deleteSchedule, setActiveScheduleId } = useScheduler();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const getStatusColor = (state) => {
    switch (state) {
      case 'active': return styles.statusActive;
      case 'paused': return styles.statusPaused;
      case 'failed': return styles.statusFailed;
      case 'draft': return styles.statusDraft;
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderProgress = () => {
    let pct = 0;
    if (schedule.state === 'active') pct = 68;
    else if (schedule.state === 'failed') pct = 12;
    else if (schedule.state === 'paused') pct = 42;
    
    return (
      <div className={styles.progressWrapper}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.row} ${getStatusColor(schedule.state)}`}>
      {/* LEFT ZONE: Identity */}
      <div className={styles.zoneLeft}>
        <div className={styles.iconWrapper}>
          {schedule.state === 'failed' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          )}
        </div>
        <div className={styles.identityInfo}>
          <h3 className={styles.title}>{schedule.title}</h3>
          <span className={styles.subtitle}>{schedule.frequency} • {schedule.recipientCount.toLocaleString()} recipients</span>
        </div>
      </div>

      {/* CENTER ZONE: State & Progress */}
      <div className={styles.zoneCenter}>
        <div className={styles.statusChip}>
          <div className={styles.statusIndicator}></div>
          <span className={styles.statusText}>{schedule.state.charAt(0).toUpperCase() + schedule.state.slice(1)}</span>
        </div>
        {renderProgress()}
      </div>

      {/* RIGHT ZONE: Execution & Actions */}
      <div className={styles.zoneRight}>
        <div className={styles.timingInfo}>
          <span className={styles.timingText}>{formatDate(schedule.nextExecution)}</span>
        </div>
        
        <div className={styles.actions}>
          <button 
            className={`${styles.primaryBtn} ${schedule.state === 'active' ? styles.btnActive : ''}`} 
            onClick={() => toggleScheduleState(schedule.id)}
            title={schedule.state === 'active' ? 'Pause' : 'Activate'}
          >
            {schedule.state === 'active' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            ) : schedule.state === 'failed' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.215l5.25-5.25"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            )}
          </button>

          <div className={styles.menuContainer} ref={menuRef}>
            <button className={styles.kebabBtn} onClick={() => setShowMenu(!showMenu)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
            
            <AnimatePresence>
              {showMenu && (
                <motion.div 
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <button className={styles.dropdownItem} onClick={() => { setActiveScheduleId(schedule.id); setShowMenu(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    View Logs
                  </button>
                  <button className={`${styles.dropdownItem} ${styles.dangerItem}`} onClick={() => deleteSchedule(schedule.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                    Delete Schedule
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerCard;
