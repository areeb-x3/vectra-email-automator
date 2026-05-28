import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScheduler } from '../../context/SchedulerContext';
import { useOrganisations } from '../../context/OrganisationContext';
import Button from '../ui/Button';
import styles from './ScheduleComposeModal.module.css';

const DAYS_MAP = [
  { label: 'Mo', value: 'Monday' },
  { label: 'Tu', value: 'Tuesday' },
  { label: 'We', value: 'Wednesday' },
  { label: 'Th', value: 'Thursday' },
  { label: 'Fr', value: 'Friday' },
  { label: 'Sa', value: 'Saturday' },
  { label: 'Su', value: 'Sunday' }
];

const ScheduleComposeModal = ({ isOpen, onClose, emailData }) => {
  const { addSchedule } = useScheduler();
  const { addActivity } = useOrganisations();
  const [scheduleType, setScheduleType] = useState('one-time'); // one-time, recurring
  const [frequency, setFrequency] = useState('Daily');
  const [executionDate, setExecutionDate] = useState('');
  const [executionTime, setExecutionTime] = useState('');
  const [daysOfWeek, setDaysOfWeek] = useState(['Monday']);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const toggleDay = (day) => {
    if (daysOfWeek.includes(day)) {
      if (daysOfWeek.length > 1) {
        setDaysOfWeek(daysOfWeek.filter(d => d !== day));
      }
    } else {
      setDaysOfWeek([...daysOfWeek, day]);
    }
  };

  const validateDateTime = () => {
    setErrorMsg('');
    if (scheduleType === 'one-time' || (scheduleType === 'recurring' && frequency === 'Monthly')) {
      if (!executionDate || !executionTime) return false;
      const targetDate = new Date(`${executionDate}T${executionTime}`);
      const now = new Date();
      const fiveYearsFromNow = new Date();
      fiveYearsFromNow.setFullYear(now.getFullYear() + 5);

      if (targetDate < now) {
        setErrorMsg('The selected date and time cannot be in the past.');
        return false;
      }
      if (targetDate > fiveYearsFromNow) {
        setErrorMsg('The selected date cannot be more than 5 years in the future.');
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateDateTime()) return;

    let finalFrequency = 'Run Once';
    let nextExec = new Date().toISOString();

    if (scheduleType === 'recurring') {
      if (frequency === 'Daily') {
        finalFrequency = 'Daily';
        const [hours, minutes] = executionTime.split(':');
        let d = new Date();
        d.setHours(hours, minutes, 0, 0);
        if (d < new Date()) d.setDate(d.getDate() + 1);
        nextExec = d.toISOString();
      } else if (frequency === 'Weekly') {
        finalFrequency = `Weekly on ${daysOfWeek.join(', ')}`;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let d = new Date();
        const [hours, minutes] = executionTime.split(':');
        d.setHours(hours, minutes, 0, 0);
        let currentDay = d.getDay();
        
        let targetDay = days.indexOf(daysOfWeek[0]);
        let minDistance = 7;
        
        daysOfWeek.forEach(dayName => {
            const index = days.indexOf(dayName);
            let dist = (index + 7 - currentDay) % 7;
            if (dist === 0 && d < new Date()) dist = 7;
            if (dist < minDistance) minDistance = dist;
        });

        d.setDate(d.getDate() + minDistance);
        nextExec = d.toISOString();
      } else if (frequency === 'Monthly') {
        finalFrequency = 'Monthly';
        nextExec = `${executionDate}T${executionTime || '00:00'}:00Z`;
      }
    } else {
      nextExec = `${executionDate}T${executionTime || '00:00'}:00Z`;
    }

    const newSchedule = {
      title: emailData.subject || 'Untitled Broadcast',
      description: emailData.body ? (emailData.body.length > 100 ? emailData.body.substring(0, 100) + '...' : emailData.body) : 'No description',
      type: scheduleType,
      state: 'active',
      templateId: null,
      recipientCount: emailData.recipientCount || 0,
      groupName: emailData.groupNames || 'Custom Selection',
      frequency: finalFrequency,
      nextExecution: nextExec,
      lastExecution: null,
      lastExecutionStatus: null
    };

    addSchedule(newSchedule);

    if (emailData.organisationId) {
      addActivity(emailData.organisationId, {
        type: 'emails',
        content: `Scheduled "${newSchedule.title}" to ${newSchedule.recipientCount} recipients (${finalFrequency})`,
        status: 'pending',
        metadata: {
          subject: newSchedule.title,
          scheduledFor: nextExec,
          frequency: finalFrequency,
          recipientCount: newSchedule.recipientCount
        }
      });
    }
    
    setScheduleType('one-time');
    setFrequency('Daily');
    setExecutionDate('');
    setExecutionTime('');
    setDaysOfWeek(['Monday']);
    setErrorMsg('');
    
    onClose(true);
  };

  const isFormValid = () => {
    if (!executionTime) return false;
    if (scheduleType === 'one-time' && !executionDate) return false;
    if (scheduleType === 'recurring' && frequency === 'Monthly' && !executionDate) return false;
    return true;
  };

  return (
    <div className={styles.overlay}>
      <motion.div 
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className={styles.header}>
          <h2>Schedule Email</h2>
          <button className={styles.closeBtn} onClick={() => { setErrorMsg(''); onClose(false); }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.sectionDesc}>Configure when your email "<strong>{emailData.subject}</strong>" should be sent to <strong>{emailData.recipientCount}</strong> recipients.</p>
          
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input type="radio" name="scheduleType" value="one-time" checked={scheduleType === 'one-time'} onChange={() => setScheduleType('one-time')} />
              <span>Run Once</span>
            </label>
            <label className={styles.radioLabel}>
              <input type="radio" name="scheduleType" value="recurring" checked={scheduleType === 'recurring'} onChange={() => setScheduleType('recurring')} />
              <span>Recurring Schedule</span>
            </label>
          </div>

          <div className={styles.formGrid}>
            {scheduleType === 'recurring' && (
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Frequency</label>
                <select value={frequency} onChange={(e) => { setFrequency(e.target.value); setErrorMsg(''); }} className={styles.input}>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            )}
            
            {(scheduleType === 'one-time' || (scheduleType === 'recurring' && frequency === 'Monthly')) && (
              <div className={styles.inputGroup}>
                <label>Date</label>
                <input type="date" value={executionDate} onChange={(e) => { setExecutionDate(e.target.value); setErrorMsg(''); }} className={styles.input} />
              </div>
            )}

            {scheduleType === 'recurring' && frequency === 'Weekly' && (
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Days of Week</label>
                <div className={styles.daysContainer}>
                  {DAYS_MAP.map(day => (
                    <button
                      key={day.value}
                      className={`${styles.dayChip} ${daysOfWeek.includes(day.value) ? styles.dayChipActive : ''}`}
                      onClick={() => toggleDay(day.value)}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label>Time</label>
              <input type="time" value={executionTime} onChange={(e) => { setExecutionTime(e.target.value); setErrorMsg(''); }} className={styles.input} />
            </div>
          </div>
          
          {errorMsg && (
            <div className={styles.errorMsg}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '6px', flexShrink: 0}}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errorMsg}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <Button variant="outline" onClick={() => { setErrorMsg(''); onClose(false); }}>Cancel</Button>
          <Button variant="glow" onClick={handleSave} disabled={!isFormValid()}>Confirm Schedule</Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScheduleComposeModal;
