import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useOrganisations } from '../../context/OrganisationContext';
import Button from '../ui/Button';
import ScheduleComposeModal from './ScheduleComposeModal';
import styles from './ComposeWorkspace.module.css';

const ComposeWorkspace = ({ organisation }) => {
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    setCharCount(body.length);
  }, [body]);

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId) 
        : [...prev, groupId]
    );
  };

  const selectAll = () => {
    if (selectedGroups.length === organisation.groups.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(organisation.groups.map(g => g.id));
    }
  };

  const insertVariable = (variable) => {
    setBody(prev => prev + ` {{${variable}}}`);
  };

  const { addActivity } = useOrganisations();

  const handleSend = () => {
    if (selectedGroups.length === 0 || !subject || !body) return;
    setIsSending(true);

    // Get all unique recipients from selected groups
    const recipients = [];
    selectedGroups.forEach(groupId => {
      const group = organisation.groups.find(g => g.id === groupId);
      group.recipients.forEach(r => {
        if (!recipients.find(existing => existing.email === r.email)) {
          recipients.push(r);
        }
      });
    });

    // Simulate sending
    setTimeout(() => {
      setIsSending(false);
      
      // Log detailed activity with variable replacement example
      const previewRecipient = recipients[0] || { name: 'Recipient', email: 'example@mail.com' };
      const previewGroup = selectedGroups[0] ? organisation.groups.find(g => g.id === selectedGroups[0])?.name : 'General';
      
      const personalize = (text, r, gName) => {
        return text
          .replace(/{{name}}/g, r.name)
          .replace(/{{email}}/g, r.email)
          .replace(/{{group}}/g, gName);
      };

      const personalizedBody = personalize(body, previewRecipient, previewGroup);

      addActivity(organisation.id, { 
        type: 'emails', 
        content: `Sent "${subject}" to ${recipients.length} recipients`, 
        status: 'success',
        metadata: {
          subject,
          body: personalizedBody, 
          recipientCount: recipients.length,
          groups: selectedGroups.map(id => organisation.groups.find(g => g.id === id)?.name),
          fullHistory: recipients.map(r => {
            const rGroup = organisation.groups.find(g => g.recipients.find(rec => rec.email === r.email))?.name || 'General';
            return {
              email: r.email,
              personalized: personalize(body, r, rGroup)
            };
          })
        }
      });
      alert(`Broadcast sent to ${recipients.length} recipients successfully!`);
    }, 2000);
  };

  const filteredGroups = organisation.groups?.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3 className={styles.sidebarTitle}>Recipient Groups</h3>
          <button className={styles.selectAll} onClick={selectAll}>
            {selectedGroups.length === organisation.groups.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className={styles.search}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search groups..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.groupList}>
          {filteredGroups.map((group) => (
            <div 
              key={group.id} 
              className={`${styles.groupItem} ${selectedGroups.includes(group.id) ? styles.selected : ''}`}
              onClick={() => toggleGroup(group.id)}
            >
              <div className={styles.checkbox}>
                {selectedGroups.includes(group.id) && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </div>
              <div className={styles.groupInfo}>
                <span className={styles.groupName}>{group.name}</span>
                <span className={styles.groupRecipients}>{group.recipients?.length || 0} recipients</span>
              </div>
            </div>
          ))}
          {filteredGroups.length === 0 && (
            <p className={styles.emptySearch}>No groups found.</p>
          )}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.composer}>
          <div className={styles.inputGroup}>
            <label>Subject</label>
            <input 
              type="text" 
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={styles.subjectInput}
            />
          </div>

          <div className={styles.inputGroup}>
            <div className={styles.bodyHeader}>
              <label>Message</label>
              <div className={styles.variables}>
                <span className={styles.varLabel}>Insert:</span>
                {['name', 'group', 'email'].map(v => (
                  <button key={v} className={styles.varChip} onClick={() => insertVariable(v)}>
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>
            <textarea 
              placeholder="Compose your email here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={styles.bodyTextarea}
              rows={12}
            />
            <div className={styles.bodyFooter}>
              <span className={styles.charCount}>{charCount} characters</span>
              <span className={styles.autosave}>Draft autosaved 1m ago</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.selectionSummary}>
            {selectedGroups.length > 0 ? (
              <span>Sending to <strong>{selectedGroups.length} groups</strong></span>
            ) : (
              <span className={styles.error}>No groups selected</span>
            )}
          </div>
          <div className={styles.actionButtons} style={{ display: 'flex', gap: '12px' }}>
            <Button 
              variant="outline" 
              onClick={() => setIsScheduleModalOpen(true)}
              disabled={isSending || selectedGroups.length === 0 || !subject || !body}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Schedule
            </Button>
            <Button 
              variant="glow" 
              onClick={handleSend} 
              disabled={isSending || selectedGroups.length === 0 || !subject || !body}
              className={styles.sendBtn}
            >
              {isSending ? (
                <div className={styles.sendingState}>
                  <div className={styles.spinner} />
                  Sending...
                </div>
              ) : selectedGroups.length === 0 ? (
                'Select Groups to Send'
              ) : (
                <>
                  Send Broadcast
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                    <line x1="22" y1="2" x2="11" y2="13"/><polyline points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <ScheduleComposeModal 
        isOpen={isScheduleModalOpen}
        onClose={(success) => {
          setIsScheduleModalOpen(false);
          if (success) {
            alert('Schedule created successfully!');
            // Optional: clear form
            // setSubject('');
            // setBody('');
            // setSelectedGroups([]);
          }
        }}
        emailData={{
          organisationId: organisation.id,
          subject,
          body,
          recipientCount: selectedGroups.reduce((acc, groupId) => acc + (organisation.groups.find(g => g.id === groupId)?.recipients.length || 0), 0),
          groupNames: selectedGroups.map(id => organisation.groups.find(g => g.id === id)?.name).join(', ')
        }}
      />
    </div>
  );
};

export default ComposeWorkspace;
