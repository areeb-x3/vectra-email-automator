import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrganisations } from '../../context/OrganisationContext';
import Button from '../ui/Button';
import EditableField from '../ui/EditableField';
import Dropzone from '../ui/Dropzone';
import Papa from 'papaparse';
import styles from './GroupManagement.module.css';

const GroupManagement = ({ organisation }) => {
  const { addGroup, deleteGroup, updateRecipients, updateGroupName } = useOrganisations();
  const [newGroupName, setNewGroupName] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [editingGroupId, setEditingGroupId] = useState(null);
  const [bulkText, setBulkText] = useState('');

  const handleAddGroup = (e) => {
    e.preventDefault();
    if (!newGroupName) return;
    addGroup(organisation.id, { name: newGroupName });
    setNewGroupName('');
  };

  const handleRemoveRecipient = (groupId, email) => {
    const group = organisation.groups.find(g => g.id === groupId);
    const newRecipients = group.recipients.filter(r => r.email !== email);
    updateRecipients(organisation.id, groupId, newRecipients);
  };

  const handleAddRecipients = (groupId, text) => {
    const group = organisation.groups.find(g => g.id === groupId);
    const emails = text.split(/[\s,]+/).filter(e => e.includes('@'));
    const newRecipients = [...group.recipients];
    
    emails.forEach(email => {
      if (!newRecipients.find(r => r.email === email)) {
        newRecipients.push({ email, name: '' });
      }
    });

    updateRecipients(organisation.id, groupId, newRecipients);
  };

  const handleCSVUpload = (groupId, file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const group = organisation.groups.find(g => g.id === groupId);
        
        // Determine if we should use headers or indices
        const hasHeaders = results.meta.fields && (
          results.meta.fields.includes('group') || 
          results.meta.fields.includes('email') ||
          results.meta.fields.includes('Group')
        );

        if (!hasHeaders) {
          Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (idxResults) => {
              const groupNamesInCSV = [...new Set(idxResults.data.map(row => row[0]?.trim()).filter(Boolean))];
              if (groupNamesInCSV.length > 1) {
                alert(`Error: CSV contains multiple groups (${groupNamesInCSV.join(', ')}).`);
                return;
              }
              const newRecipients = [...group.recipients];
              idxResults.data.forEach(row => {
                const email = row[2]?.trim();
                const name = row[1]?.trim();
                if (email && email.includes('@') && !newRecipients.find(r => r.email === email)) {
                  newRecipients.push({ email, name: name || 'Recipient' });
                }
              });
              updateRecipients(organisation.id, groupId, newRecipients);
              alert(`Imported ${idxResults.data.length} recipients.`);
            }
          });
        } else {
          const groupNamesInCSV = [...new Set(results.data.map(row => row.group || row.Group).filter(Boolean))];
          if (groupNamesInCSV.length > 1) {
            alert(`Error: CSV contains multiple groups (${groupNamesInCSV.join(', ')}).`);
            return;
          }
          const newRecipients = [...group.recipients];
          results.data.forEach(row => {
            const email = row.email || row.Email || row.email_id;
            const name = row.name || row.Name;
            if (email && email.includes('@') && !newRecipients.find(r => r.email === email)) {
              newRecipients.push({ email: email.trim(), name: (name || 'Recipient').trim() });
            }
          });
          updateRecipients(organisation.id, groupId, newRecipients);
          alert(`Imported ${results.data.length} recipients.`);
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleAddGroup} className={styles.addGroup}>
        <input
          type="text"
          placeholder="Group name (e.g. Beta Testers)"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className={styles.input}
        />
        <Button variant="glow" type="submit" disabled={!newGroupName}>Add Group</Button>
      </form>

      <div className={styles.groupList}>
        {organisation.groups?.map((group) => {
          const isExpanded = expandedGroup === group.id;
          const isEditing = editingGroupId === group.id;

          return (
            <div key={group.id} className={styles.groupCard}>
              <div 
                className={styles.groupHeader}
                onClick={() => {
                  setExpandedGroup(isExpanded ? null : group.id);
                  if (isExpanded) {
                    setEditingGroupId(null);
                    setBulkText('');
                  }
                }}
              >
                <div className={styles.groupInfo}>
                  <h4 className={styles.groupName}>{group.name}</h4>
                  <span className={styles.recipientCount}>{group.recipients?.length || 0} recipients</span>
                </div>
                <div className={styles.groupActions}>
                  <button 
                    className={`${styles.actionBtn} ${isEditing ? styles.activeEdit : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isExpanded) setExpandedGroup(group.id);
                      setEditingGroupId(isEditing ? null : group.id);
                    }}
                    title="Edit Group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </button>
                  <button 
                    className={styles.deleteGroupBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteGroup(organisation.id, group.id);
                    }}
                    title="Delete Group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                  </button>
                  <div className={`${styles.chevron} ${isExpanded ? styles.expanded : ''}`}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={styles.groupBody}
                  >
                    {isEditing ? (
                      <div className={styles.editInterface}>
                        <div className={styles.editSection}>
                          <label className={styles.editLabel}>Group Name</label>
                          <EditableField 
                            value={group.name}
                            onSave={(val) => updateGroupName(organisation.id, group.id, val)}
                          />
                        </div>
                        
                        <div className={styles.bulkAdd}>
                          <label className={styles.editLabel}>Import Recipients</label>
                          <div className={styles.importOptions}>
                            <div className={styles.bulkInputWrapper}>
                              <textarea 
                                placeholder="Manual: email1@example.com, email2@example.com..."
                                value={bulkText}
                                onChange={(e) => setBulkText(e.target.value)}
                                className={styles.bulkInput}
                              />
                              <Button 
                                variant="glow" 
                                size="sm" 
                                className={styles.bulkAddBtn}
                                onClick={() => {
                                  handleAddRecipients(group.id, bulkText);
                                  setBulkText('');
                                }}
                                disabled={!bulkText.trim()}
                              >
                                Add Manual
                              </Button>
                            </div>
                            
                            <div className={styles.csvImport}>
                              <Dropzone 
                                onFileSelect={(file) => handleCSVUpload(group.id, file)}
                                accept=".csv"
                                compact
                              />
                            </div>
                          </div>
                        </div>

                        <div className={styles.editSection}>
                          <label className={styles.editLabel}>Manage Recipients</label>
                          <div className={styles.recipientList}>
                            {group.recipients?.map((recipient) => (
                              <div key={recipient.email} className={styles.recipientChip}>
                                <span>{recipient.email}</span>
                                <button 
                                  onClick={() => handleRemoveRecipient(group.id, recipient.email)}
                                  className={styles.removeRecipient}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.editActions}>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={() => setEditingGroupId(null)}
                          >
                            Finish Editing
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.viewInterface}>
                        <div className={styles.recipientList}>
                          {group.recipients?.map((recipient) => (
                            <div key={recipient.email} className={styles.recipientChip}>
                              <span>{recipient.email}</span>
                              <button 
                                onClick={() => handleRemoveRecipient(group.id, recipient.email)}
                                className={styles.removeRecipient}
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                              </button>
                            </div>
                          ))}
                          {(!group.recipients || group.recipients.length === 0) && (
                            <p className={styles.emptyRecipients}>No recipients in this group.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupManagement;
