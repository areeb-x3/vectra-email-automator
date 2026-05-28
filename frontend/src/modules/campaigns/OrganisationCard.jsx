import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import styles from './OrganisationCard.module.css';

const OrganisationCard = ({ organisation, onAction }) => {
  const totalRecipients = organisation.groups?.reduce((acc, g) => acc + (g.recipients?.length || 0), 0) || 0;
  const totalGroups = organisation.groups?.length || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onAction('groups')}
      className={styles.cardWrapper}
    >
      <Card className={styles.card}>
        <div className={styles.glow} />
        
        <div className={styles.header}>
          <div className={styles.avatar}>
            {organisation.name.charAt(0)}
          </div>
          <div className={styles.info}>
            <h3 className={styles.name}>{organisation.name}</h3>
            <p className={styles.description}>{organisation.description || 'No description'}</p>
          </div>
          <div 
            className={styles.actionMenu}
            onClick={(e) => {
              e.stopPropagation();
              onAction('general');
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
            </svg>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalGroups}</span>
            <span className={styles.statLabel}>Groups</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statValue}>{totalRecipients}</span>
            <span className={styles.statLabel}>Recipients</span>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.activity}>
            <span className={styles.activityDot} />
            <span className={styles.activityText}>
              {organisation.activities?.[0] 
                ? `Recent activity: ${organisation.activities[0].timestamp}` 
                : 'No recent activity'}
            </span>
          </div>
          <button className={styles.quickCompose} onClick={(e) => {
            e.stopPropagation();
            onAction('compose');
          }}>
            Quick Compose
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default OrganisationCard;
