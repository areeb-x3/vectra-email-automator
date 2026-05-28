import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useOrganisations } from './OrganisationContext';

const SchedulerContext = createContext();

export const useScheduler = () => {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error('useScheduler must be used within a SchedulerProvider');
  }
  return context;
};

// Mock Data
const MOCK_TEMPLATES = [
  { id: 't1', name: 'Welcome Series - Email 1', subject: 'Welcome to Vectra! 🎉', variables: ['{{firstName}}', '{{company}}'], type: 'onboarding' },
  { id: 't2', name: 'Monthly Newsletter - May', subject: 'Your Monthly Vectra Update', variables: ['{{name}}'], type: 'newsletter' },
  { id: 't3', name: 'Downtime Alert', subject: 'URGENT: Scheduled Maintenance Notice', variables: ['{{date}}', '{{time}}'], type: 'alert' },
];

const MOCK_SCHEDULES = [
  {
    id: 's1',
    title: 'Daily Onboarding Digest',
    description: 'Sends the welcome email to all new users who joined in the last 24 hours.',
    type: 'recurring',
    state: 'active', // active, paused, inactive, failed, draft, completed
    templateId: 't1',
    recipientCount: 145,
    groupName: 'New Signups (24h)',
    frequency: 'Daily at 09:00 AM',
    nextExecution: '2026-05-19T09:00:00Z',
    lastExecution: '2026-05-18T09:00:00Z',
    lastExecutionStatus: 'success'
  },
  {
    id: 's2',
    title: 'May Product Newsletter',
    description: 'Monthly feature updates and announcements.',
    type: 'one-time',
    state: 'paused',
    templateId: 't2',
    recipientCount: 12500,
    groupName: 'All Active Users',
    frequency: 'Run Once',
    nextExecution: '2026-05-25T10:00:00Z',
    lastExecution: null,
    lastExecutionStatus: null
  },
  {
    id: 's3',
    title: 'Weekend Maintenance Alert',
    description: 'Notification regarding database maintenance.',
    type: 'one-time',
    state: 'failed',
    templateId: 't3',
    recipientCount: 500,
    groupName: 'Enterprise Customers',
    frequency: 'Run Once',
    nextExecution: null,
    lastExecution: '2026-05-15T22:00:00Z',
    lastExecutionStatus: 'failed'
  },
  {
    id: 's4',
    title: 'Weekly Engagement Campaign',
    description: 'Re-engagement sequence for inactive users.',
    type: 'recurring',
    state: 'active',
    templateId: 't1',
    recipientCount: 3200,
    groupName: 'Inactive (30+ Days)',
    frequency: 'Weekly on Tuesday',
    nextExecution: '2026-05-19T14:00:00Z',
    lastExecution: '2026-05-12T14:00:00Z',
    lastExecutionStatus: 'success'
  },
  {
    id: 's5',
    title: 'Q2 Performance Review Reminder',
    description: 'Draft schedule for internal team reminders.',
    type: 'one-time',
    state: 'draft',
    templateId: null,
    recipientCount: 0,
    groupName: null,
    frequency: 'Not set',
    nextExecution: null,
    lastExecution: null,
    lastExecutionStatus: null
  }
];

export const SchedulerProvider = ({ children }) => {
  const { activeOrganisationId, addActivity } = useOrganisations();
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem('vectra_schedules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_SCHEDULES;
      }
    }
    return MOCK_SCHEDULES;
  });
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [activeScheduleId, setActiveScheduleId] = useState(null); // For viewing logs or details

  useEffect(() => {
    localStorage.setItem('vectra_schedules', JSON.stringify(schedules));
  }, [schedules]);

  const addSchedule = (newSchedule) => {
    const schedule = {
      ...newSchedule,
      id: `s${Date.now()}`,
      state: newSchedule.state || 'draft',
    };
    setSchedules([schedule, ...schedules]);
    if (activeOrganisationId) {
      addActivity(activeOrganisationId, {
        type: 'schedules',
        content: `Schedule "${schedule.title}" created`,
        status: 'success'
      });
    }
  };

  const updateSchedule = (id, updates) => {
    const target = schedules.find(s => s.id === id);
    setSchedules(schedules.map(s => (s.id === id ? { ...s, ...updates } : s)));
    if (target && activeOrganisationId) {
      addActivity(activeOrganisationId, {
        type: 'schedules',
        content: `Schedule "${target.title}" updated`,
        status: 'success'
      });
    }
  };

  const deleteSchedule = (id) => {
    const target = schedules.find(s => s.id === id);
    setSchedules(schedules.filter(s => s.id !== id));
    if (target && activeOrganisationId) {
      addActivity(activeOrganisationId, {
        type: 'schedules',
        content: `Schedule "${target.title}" deleted`,
        status: 'failed'
      });
    }
  };

  const toggleScheduleState = (id) => {
    const targetSchedule = schedules.find(s => s.id === id);
    if (!targetSchedule) return;
    
    const isPausing = targetSchedule.state === 'active';
    const newState = isPausing ? 'paused' : 'active';

    setSchedules(schedules.map(s => s.id === id ? { ...s, state: newState } : s));

    if (activeOrganisationId) {
      addActivity(activeOrganisationId, {
        type: 'schedules',
        content: `Schedule "${targetSchedule.title}" ${isPausing ? 'paused' : 'activated'}`,
        status: isPausing ? 'pending' : 'success'
      });
    }
  };

  const stats = useMemo(() => {
    return {
      total: schedules.length,
      active: schedules.filter(s => s.state === 'active').length,
      paused: schedules.filter(s => s.state === 'paused').length,
      failed: schedules.filter(s => s.state === 'failed').length,
      draft: schedules.filter(s => s.state === 'draft').length,
      upcomingExecutions: schedules.filter(s => s.nextExecution !== null).length,
      totalRecipients: schedules.reduce((acc, s) => acc + (s.recipientCount || 0), 0)
    };
  }, [schedules]);

  return (
    <SchedulerContext.Provider value={{
      schedules,
      templates,
      stats,
      activeScheduleId,
      setActiveScheduleId,
      addSchedule,
      updateSchedule,
      deleteSchedule,
      toggleScheduleState
    }}>
      {children}
    </SchedulerContext.Provider>
  );
};
