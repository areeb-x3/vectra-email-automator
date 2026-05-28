import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganisations } from '../../context/OrganisationContext';
import Tabs from '../ui/Tabs';
import EditableField from '../ui/EditableField';
import GroupManagement from './GroupManagement';
import ComposeWorkspace from './ComposeWorkspace';
import ActivityFeed from '../activity/ActivityFeed';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import styles from './OrganisationWorkspace.module.css';

const OrganisationWorkspace = ({ isOpen, onClose, initialTab = 'general' }) => {
  const { activeOrganisation, updateOrganisation, deleteOrganisation } = useOrganisations();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!activeOrganisation) return null;

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'groups', label: 'Groups' },
    { id: 'compose', label: 'Compose' },
    { id: 'activity', label: 'Activity' },
  ];

  const handleUpdate = (updates) => {
    updateOrganisation(activeOrganisation.id, updates);
  };

  const handleDelete = () => {
    deleteOrganisation(activeOrganisation.id);
    onClose();
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
        <motion.div
          className={styles.backdrop}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.workspace}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <div className={styles.avatar}>
                  {activeOrganisation.name.charAt(0)}
                </div>
                <div>
                  <h2 className={styles.name}>{activeOrganisation.name}</h2>
                  <p className={styles.subtitle}>Organisation Workspace</p>
                </div>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <div className={styles.nav}>
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            <div className={styles.content}>
              {activeTab === 'general' && (
                <div className={styles.tabContent}>
                  <section className={styles.section}>
                    <label className={styles.label}>Organisation Name</label>
                    <EditableField 
                      value={activeOrganisation.name} 
                      onSave={(val) => handleUpdate({ name: val })} 
                      label="name"
                    />
                  </section>

                  <section className={styles.section}>
                    <label className={styles.label}>Description</label>
                    <EditableField 
                      value={activeOrganisation.description} 
                      onSave={(val) => handleUpdate({ description: val })} 
                      label="description"
                      multiline
                    />
                  </section>

                  <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Total Groups</span>
                      <span className={styles.statValue}>{activeOrganisation.groups?.length || 0}</span>
                    </div>
                    <div className={styles.statCard}>
                      <span className={styles.statLabel}>Total Recipients</span>
                      <span className={styles.statValue}>
                        {activeOrganisation.groups?.reduce((acc, g) => acc + (g.recipients?.length || 0), 0) || 0}
                      </span>
                    </div>
                  </div>

                  <div className={styles.dangerZone}>
                    <h3>Danger Zone</h3>
                    <p>Once you delete an organisation, there is no going back. Please be certain.</p>
                    <Button variant="outline" className={styles.deleteBtn} onClick={() => setIsDeleteConfirmOpen(true)}>
                      Delete Organisation
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'groups' && (
                <GroupManagement organisation={activeOrganisation} />
              )}

              {activeTab === 'compose' && (
                <ComposeWorkspace organisation={activeOrganisation} />
              )}

              {activeTab === 'activity' && (
                <ActivityFeed />
              )}
            </div>
          </motion.div>
        </motion.div>

        {isDeleteConfirmOpen && (
            <Modal 
              isOpen={true} 
              onClose={() => setIsDeleteConfirmOpen(false)} 
              title="Delete Organisation?"
            >
              <div className={styles.confirmModal}>
                <p>Are you sure you want to delete <strong>{activeOrganisation.name}</strong>? This will remove all groups and recipients associated with it.</p>
                <div className={styles.confirmActions}>
                  <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                  <Button variant="glow" className={styles.confirmDeleteBtn} onClick={handleDelete}>Yes, Delete</Button>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default OrganisationWorkspace;
