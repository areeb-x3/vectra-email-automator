import React from 'react';
import { motion } from 'framer-motion';
import { useScheduler } from '../../context/SchedulerContext';
import styles from './SchedulerLogsModal.module.css';

const MOCK_LOGS = [
  { id: 'l1', timestamp: '2026-05-18T09:00:00Z', status: 'success', recipients: 145, failed: 0, processingTime: '1.2s' },
  { id: 'l2', timestamp: '2026-05-17T09:00:00Z', status: 'partial', recipients: 142, failed: 3, processingTime: '1.4s', error: 'SMTP timeout for 3 recipients' },
  { id: 'l3', timestamp: '2026-05-16T09:00:00Z', status: 'success', recipients: 140, failed: 0, processingTime: '1.1s' },
  { id: 'l4', timestamp: '2026-05-15T09:00:00Z', status: 'failed', recipients: 0, failed: 135, processingTime: '0.3s', error: 'API Key Invalid' },
  { id: 'l5', timestamp: '2026-05-14T09:00:00Z', status: 'success', recipients: 135, failed: 0, processingTime: '1.0s' }
];

const SchedulerLogsModal = ({ isOpen, onClose, scheduleId }) => {
  const { schedules } = useScheduler();
  const schedule = schedules.find(s => s.id === scheduleId);

  if (!isOpen || !schedule) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className={styles.overlay}>
      <motion.div 
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className={styles.header}>
          <div>
            <h2>Execution Logs</h2>
            <p className={styles.subtitle}>Viewing logs for: <strong>{schedule.title}</strong></p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.summaryStats}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Total Runs</span>
              <span className={styles.statValue}>124</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Success Rate</span>
              <span className={`${styles.statValue} ${styles.textSuccess}`}>98.2%</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Avg Delivery</span>
              <span className={styles.statValue}>1.1s</span>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.logsTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Status</th>
                  <th>Delivered</th>
                  <th>Failed</th>
                  <th>Processing Time</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LOGS.map(log => (
                  <tr key={log.id}>
                    <td>{formatDate(log.timestamp)}</td>
                    <td>
                      <span className={`${styles.badge} ${styles['badge' + log.status]}`}>
                        {log.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{log.recipients}</td>
                    <td className={log.failed > 0 ? styles.textFailed : ''}>{log.failed}</td>
                    <td>{log.processingTime}</td>
                    <td className={styles.errorText}>{log.error || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SchedulerLogsModal;
