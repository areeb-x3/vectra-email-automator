import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduler } from '../../context/SchedulerContext';
import Button from '../ui/Button';
import styles from './CreateSchedulerModal.module.css';

const CreateSchedulerModal = ({ isOpen, onClose }) => {
  const { templates, addSchedule } = useScheduler();
  const [step, setStep] = useState(1);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    templateId: '',
    recipientType: 'group',
    groupName: '',
    scheduleType: 'one-time', // one-time, recurring
    frequency: 'Run Once',
    executionDate: '',
    executionTime: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));
  
  const handleSave = () => {
    addSchedule({
      title: formData.title,
      description: formData.description,
      type: formData.scheduleType,
      state: 'active',
      templateId: formData.templateId,
      recipientCount: 150, // mock count
      groupName: formData.groupName || 'Selected Contacts',
      frequency: formData.scheduleType === 'recurring' ? formData.frequency : 'Run Once',
      nextExecution: formData.executionDate ? `${formData.executionDate}T${formData.executionTime || '00:00'}:00Z` : new Date().toISOString(),
      lastExecution: null,
      lastExecutionStatus: null
    });
    onClose();
    // Reset form
    setStep(1);
    setFormData({
      title: '', description: '', templateId: '', recipientType: 'group', groupName: '', scheduleType: 'one-time', frequency: 'Run Once', executionDate: '', executionTime: ''
    });
  };

  const selectedTemplate = templates.find(t => t.id === formData.templateId);

  return (
    <div className={styles.overlay}>
      <motion.div 
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className={styles.header}>
          <h2>Create New Schedule</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.progressContainer}>
          {['Basic Info', 'Template', 'Recipients', 'Configuration'].map((label, i) => (
            <div key={label} className={`${styles.progressStep} ${step > i + 1 ? styles.completed : ''} ${step === i + 1 ? styles.active : ''}`}>
              <div className={styles.stepCircle}>{step > i + 1 ? '✓' : i + 1}</div>
              <span className={styles.stepLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div className={styles.content}>
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.formSection}>
                <h3>Basic Information</h3>
                <p className={styles.sectionDesc}>Give your schedule a recognizable name and description.</p>
                <div className={styles.inputGroup}>
                  <label>Schedule Name</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Q3 Welcome Series" className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Description (Optional)</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} placeholder="What is the purpose of this schedule?" className={styles.textarea} rows={3} />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.formSection}>
                <h3>Select Template</h3>
                <p className={styles.sectionDesc}>Choose the email template to send.</p>
                <div className={styles.templateGrid}>
                  {templates.map(t => (
                    <div 
                      key={t.id} 
                      className={`${styles.templateCard} ${formData.templateId === t.id ? styles.selectedTemplate : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, templateId: t.id }))}
                    >
                      <div className={styles.templateHeader}>
                        <span className={styles.templateName}>{t.name}</span>
                        <span className={styles.templateType}>{t.type}</span>
                      </div>
                      <div className={styles.templateSubject}><strong>Subject:</strong> {t.subject}</div>
                      <div className={styles.templateVars}>
                        {t.variables.map(v => <span key={v} className={styles.varBadge}>{v}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.formSection}>
                <h3>Recipient Selection</h3>
                <p className={styles.sectionDesc}>Who should receive these emails?</p>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="recipientType" value="group" checked={formData.recipientType === 'group'} onChange={handleChange} />
                    <span>Select an existing group</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="recipientType" value="csv" checked={formData.recipientType === 'csv'} onChange={handleChange} />
                    <span>Upload CSV (Coming soon)</span>
                  </label>
                </div>
                {formData.recipientType === 'group' && (
                  <div className={styles.inputGroup}>
                    <label>Select Group</label>
                    <select name="groupName" value={formData.groupName} onChange={handleChange} className={styles.input}>
                      <option value="">Select a group...</option>
                      <option value="All Active Users">All Active Users</option>
                      <option value="New Signups">New Signups</option>
                      <option value="Enterprise Customers">Enterprise Customers</option>
                    </select>
                  </div>
                )}
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className={styles.formSection}>
                <h3>Scheduling Configuration</h3>
                <p className={styles.sectionDesc}>When should this execute?</p>
                
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="scheduleType" value="one-time" checked={formData.scheduleType === 'one-time'} onChange={handleChange} />
                    <span>Run Once</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input type="radio" name="scheduleType" value="recurring" checked={formData.scheduleType === 'recurring'} onChange={handleChange} />
                    <span>Recurring Schedule</span>
                  </label>
                </div>

                {formData.scheduleType === 'one-time' ? (
                  <div className={styles.flexRow}>
                    <div className={styles.inputGroup}>
                      <label>Date</label>
                      <input type="date" name="executionDate" value={formData.executionDate} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Time</label>
                      <input type="time" name="executionTime" value={formData.executionTime} onChange={handleChange} className={styles.input} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={styles.inputGroup}>
                      <label>Frequency</label>
                      <select name="frequency" value={formData.frequency} onChange={handleChange} className={styles.input}>
                        <option value="Daily">Daily</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className={styles.flexRow}>
                      <div className={styles.inputGroup}>
                        <label>Start Date</label>
                        <input type="date" name="executionDate" value={formData.executionDate} onChange={handleChange} className={styles.input} />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Execution Time</label>
                        <input type="time" name="executionTime" value={formData.executionTime} onChange={handleChange} className={styles.input} />
                      </div>
                    </div>
                  </>
                )}

                <div className={styles.summaryBox}>
                  <h4>Review Summary</h4>
                  <ul className={styles.summaryList}>
                    <li><strong>Name:</strong> {formData.title || 'N/A'}</li>
                    <li><strong>Template:</strong> {selectedTemplate ? selectedTemplate.name : 'None selected'}</li>
                    <li><strong>Recipients:</strong> {formData.groupName || 'None selected'}</li>
                    <li><strong>Type:</strong> {formData.scheduleType === 'one-time' ? 'One Time' : 'Recurring'}</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.footer}>
          {step > 1 ? (
            <Button variant="outline" onClick={handlePrev}>Back</Button>
          ) : (
            <div />
          )}
          
          {step < 4 ? (
            <Button variant="primary" onClick={handleNext} disabled={step === 1 && !formData.title}>Next Step</Button>
          ) : (
            <Button variant="glow" onClick={handleSave}>Activate Schedule</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateSchedulerModal;
