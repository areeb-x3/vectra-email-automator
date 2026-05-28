import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  FileUp, 
  Users, 
  Trash2, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useOrganisations } from '../../context/OrganisationContext';
import styles from './ActivityFeed.module.css';

const ActivityFeed = () => {
  const { activeOrganisation } = useOrganisations();
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const activities = activeOrganisation?.activities || [];

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'emails', label: 'Emails' },
    { id: 'groups', label: 'Groups' },
    { id: 'imports', label: 'Imports' },
    { id: 'settings', label: 'Settings' }
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'emails': return <Send size={16} />;
      case 'imports': return <FileUp size={16} />;
      case 'groups': return <Users size={16} />;
      case 'settings': return <Settings size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredActivities = activities.filter(
    item => filter === 'all' || item.type === filter
  );

  const paginatedActivities = filteredActivities.slice(0, visibleCount);

  // Group by date
  const groupedActivities = paginatedActivities.reduce((groups, activity) => {
    const date = activity.dateKey || 'Unknown';
    if (!groups[date]) groups[date] = [];
    groups[date].push(activity);
    return groups;
  }, {});

  const formatDateLabel = (dateKey) => {
    if (dateKey === 'Unknown') return 'Earlier';
    const now = new Date();
    const today = now.toLocaleDateString('en-CA');
    const yesterday = new Date(now.setDate(now.getDate() - 1)).toLocaleDateString('en-CA');
    
    if (dateKey === today) return 'Today';
    if (dateKey === yesterday) return 'Yesterday';
    
    return new Date(dateKey).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => {
              setFilter(f.id);
              setVisibleCount(10); // Reset pagination on filter change
            }}
            className={`${styles.filterBtn} ${filter === f.id ? styles.activeFilter : ''}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.feed}>
        <AnimatePresence mode="popLayout">
          {Object.keys(groupedActivities).map((date) => (
            <div key={date} className={styles.dateGroup}>
              <div className={styles.dateHeader}>
                <span className={styles.dateLabel}>{formatDateLabel(date)}</span>
                <div className={styles.dateLine} />
              </div>
              
              {groupedActivities[date].map((activity, index) => {
                const isExpanded = expandedId === activity.id;
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`${styles.activityRow} ${isExpanded ? styles.expanded : ''}`}
                    onClick={() => toggleExpand(activity.id)}
                  >
                    <div className={styles.rowMain}>
                      <div className={styles.timeline}>
                        <div className={`${styles.iconWrapper} ${styles[activity.status]}`}>
                          {getIcon(activity.type)}
                          <span className={styles.statusDot} />
                        </div>
                        {index !== groupedActivities[date].length - 1 && <div className={styles.line} />}
                      </div>

                      <div className={styles.content}>
                        <p className={styles.text}>{activity.content}</p>
                        <div className={styles.timeWrapper}>
                          <span className={styles.timestamp}>{activity.timestamp}</span>
                          <motion.div 
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            className={styles.chevron}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="6 9 12 15 18 9"/>
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className={styles.details}
                        >
                          <div className={styles.detailsContent}>
                            {activity.type === 'emails' && activity.metadata ? (
                              <div className={styles.emailPreview}>
                                <div className={styles.emailHeader}>
                                  <div className={styles.emailMetaItem}>
                                    <span className={styles.emailLabel}>Subject:</span>
                                    <span className={styles.emailValue}>{activity.metadata.subject}</span>
                                  </div>
                                  <div className={styles.emailMetaItem}>
                                    <span className={styles.emailLabel}>To:</span>
                                    <span className={styles.emailValue}>
                                      {activity.metadata.groups 
                                        ? `${activity.metadata.groups.join(', ')} (${activity.metadata.groups.length} groups)`
                                        : `${activity.metadata.recipientCount || 0} recipients`}
                                    </span>
                                  </div>
                                  {activity.metadata.scheduledFor && (
                                    <div className={styles.emailMetaItem}>
                                      <span className={styles.emailLabel}>Scheduled:</span>
                                      <span className={styles.emailValue}>{new Date(activity.metadata.scheduledFor).toLocaleString()} ({activity.metadata.frequency})</span>
                                    </div>
                                  )}
                                </div>
                                {activity.metadata.body && (
                                  <div className={styles.emailBody}>
                                    {activity.metadata.body}
                                  </div>
                                )}
                                <div className={styles.emailFooter}>
                                  {activity.status === 'pending' ? 'Scheduled on ' : 'Sent on '}
                                  {activity.fullDate}
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className={styles.detailItem}>
                                  <span className={styles.detailLabel}>Full Date:</span>
                                  <span className={styles.detailValue}>{activity.fullDate}</span>
                                </div>
                                <div className={styles.detailItem}>
                                  <span className={styles.detailLabel}>Event Type:</span>
                                  <span className={styles.detailValue}>{activity.type.toUpperCase()}</span>
                                </div>
                                {activity.details && (
                                  <div className={styles.detailItem}>
                                    <span className={styles.detailLabel}>Additional Info:</span>
                                    <span className={styles.detailValue}>{activity.details}</span>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    <div className={styles.hoverGlow} />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </AnimatePresence>

        {filteredActivities.length > visibleCount && (
          <div className={styles.pagination}>
            <button 
              className={styles.viewMore}
              onClick={() => setVisibleCount(prev => prev + 10)}
            >
              View More Activities
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        )}

        {filteredActivities.length === 0 && (
          <div className={styles.empty}>
            <AlertCircle size={32} className={styles.emptyIcon} />
            <p>No activity found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
