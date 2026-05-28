import React, { useState } from 'react';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { useOrganisations } from '../../context/OrganisationContext';
import Modal from '../ui/Modal';
import Dropzone from '../ui/Dropzone';
import Button from '../ui/Button';
import styles from './CreateOrganisationModal.module.css';

const CreateOrganisationModal = ({ isOpen, onClose }) => {
  const { addOrganisation } = useOrganisations();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [csvData, setCsvData] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSummary, setParseSummary] = useState(null);

  const handleFileSelect = (file) => {
    setIsParsing(true);

    const finalizeParse = (groupsMap, invalid) => {
      const formattedGroups = Object.keys(groupsMap).map(name => ({
        name,
        recipients: groupsMap[name]
      }));

      const totalRecipients = formattedGroups.reduce((acc, g) => acc + g.recipients.length, 0);

      setCsvData(formattedGroups);
      setParseSummary({
        groupCount: formattedGroups.length,
        recipientCount: totalRecipients,
        invalidCount: invalid
      });
      setIsParsing(false);
    };

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const groups = {};
        let invalidCount = 0;

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
              const idxGroups = {};
              idxResults.data.forEach((row) => {
                const groupName = row[0]?.trim();
                const name = row[1]?.trim();
                const email = row[2]?.trim();

                if (groupName && email && email.includes('@')) {
                  if (!idxGroups[groupName]) idxGroups[groupName] = [];
                  idxGroups[groupName].push({ email, name: name || 'Recipient' });
                } else {
                  invalidCount++;
                }
              });
              finalizeParse(idxGroups, invalidCount);
            }
          });
        } else {
          results.data.forEach((row) => {
            const groupName = row.group || row.Group;
            const name = row.name || row.Name;
            const email = row.email || row.Email || row.email_id;

            if (groupName && email && email.includes('@')) {
              if (!groups[groupName]) groups[groupName] = [];
              groups[groupName].push({ email, name: name || 'Recipient' });
            } else {
              invalidCount++;
            }
          });
          finalizeParse(groups, invalidCount);
        }
      },
      error: (err) => {
        console.error('CSV Parsing Error:', err);
        setIsParsing(false);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    addOrganisation({
      name,
      description,
      groups: csvData || []
    });

    // Reset and close
    setName('');
    setDescription('');
    setCsvData(null);
    setParseSummary(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Organisation" maxWidth="600px">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Organisation Name</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. Acme Corp"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description (Optional)</label>
          <textarea
            className={styles.textarea}
            placeholder="What is this organisation for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Import Recipients (CSV)</label>
          <p className={styles.hint}>Format: group, name, email</p>
          <Dropzone onFileSelect={handleFileSelect} label={csvData ? "File selected" : "Click or drag CSV file"} />
        </div>

        {isParsing && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Parsing CSV data...</span>
          </div>
        )}

        {parseSummary && (
          <motion.div 
            className={styles.summary}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{parseSummary.groupCount}</span>
              <span className={styles.summaryLabel}>Groups detected</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryValue}>{parseSummary.recipientCount}</span>
              <span className={styles.summaryLabel}>Recipients imported</span>
            </div>
            {parseSummary.invalidCount > 0 && (
              <div className={`${styles.summaryItem} ${styles.warning}`}>
                <span className={styles.summaryValue}>{parseSummary.invalidCount}</span>
                <span className={styles.summaryLabel}>Invalid rows skipped</span>
              </div>
            )}
          </motion.div>
        )}

        <div className={styles.actions}>
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="glow" type="submit" disabled={!name}>Create Organisation</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateOrganisationModal;
