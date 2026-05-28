import React from 'react';
import { motion } from 'framer-motion';
import styles from './Tabs.module.css';

const Tabs = ({ tabs, activeTab, onChange }) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabPill"
                className={styles.activePill}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
