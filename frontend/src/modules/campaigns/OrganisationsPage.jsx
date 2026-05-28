import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOrganisations } from '../../context/OrganisationContext';
import OrganisationCard from './OrganisationCard';
import CreateOrganisationModal from './CreateOrganisationModal';
import OrganisationWorkspace from './OrganisationWorkspace';
import Button from '../ui/Button';
import styles from './OrganisationsPage.module.css';

const OrganisationsPage = () => {
  const { organisations, activeOrganisationId, setActiveOrganisationId } = useOrganisations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('general');

  const handleOrgAction = (orgId, tab) => {
    setInitialTab(tab);
    setActiveOrganisationId(orgId);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Organisations</h1>
          <p className={styles.subtitle}>Manage your workspaces and recipient groups</p>
        </div>
        <Button variant="glow" onClick={() => setIsCreateModalOpen(true)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Organisation
        </Button>
      </div>

      {organisations.length === 0 ? (
        <motion.div 
          className={styles.emptyState}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
            </svg>
          </div>
          <h3>No organisations yet</h3>
          <p>Create your first organisation to start managing recipients.</p>
          <Button variant="outline" onClick={() => setIsCreateModalOpen(true)}>Get Started</Button>
        </motion.div>
      ) : (
        <div className={styles.grid}>
          {organisations.map((org) => (
            <OrganisationCard 
              key={org.id} 
              organisation={org} 
              onAction={(tab) => handleOrgAction(org.id, tab)}
            />
          ))}
        </div>
      )}

      <CreateOrganisationModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      <OrganisationWorkspace 
        isOpen={!!activeOrganisationId} 
        onClose={() => setActiveOrganisationId(null)} 
        initialTab={initialTab}
      />
    </div>
  );
};

export default OrganisationsPage;
