import React from 'react';
import styles from './SidePanels.module.css';

const LightbulbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);

const QuickTipsPanel = ({ tips }) => {
  if (!tips || tips.length === 0) return null;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>
        <span className={styles.tipsIcon}><LightbulbIcon /></span>
        Quick Productivity Tips
      </h3>
      <div className={styles.list}>
        {tips.map((tip) => (
          <div key={tip.id} className={styles.item}>
            <div className={styles.tipContent}>"{tip.content}"</div>
            <div className={styles.tipModule}>{tip.module}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickTipsPanel;
