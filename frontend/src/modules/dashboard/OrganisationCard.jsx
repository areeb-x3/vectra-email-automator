import React from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import Button from '../ui/Button';
import styles from './OrganisationCard.module.css';

const OrganisationCard = ({ organisations = [] }) => {
  const isEmpty = organisations.length === 0;

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Your Organisations</h3>
        {!isEmpty && <span className={styles.countBadge}>{organisations.length}</span>}
      </div>

      <div className={styles.content}>
        {isEmpty ? (
          <div className={styles.emptyState}>
            <div className={styles.illustration}>
              <EmptyIcon />
            </div>
            <p className={styles.emptyText}>No organisations yet</p>
            <Button variant="outline" className={styles.createBtn} size="sm">
              Setup Workspace
            </Button>
          </div>
        ) : (
          <div className={styles.list}>
            {organisations.slice(0, 3).map((org, index) => (
              <div key={org.id} className={styles.orgItem}>
                <div className={styles.orgAvatar}>{org.name.charAt(0)}</div>
                <div className={styles.orgInfo}>
                  <span className={styles.orgName}>{org.name}</span>
                  <span className={styles.orgSub}>{org.groups?.length || 0} groups</span>
                </div>
                <div className={styles.arrow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            ))}
            {organisations.length > 3 && (
              <p className={styles.moreCount}>+ {organisations.length - 3} more organisations</p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
    <path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/>
  </svg>
);

export default OrganisationCard;
