import React, { useState } from 'react';
import styles from './CommunityPage.module.css';
import CommunityHeader from './CommunityHeader';
import ThreadFeed from './ThreadFeed';
import CommunitySidebar from './CommunitySidebar';
import ThreadDetail from './ThreadDetail';

const CommunityPage = () => {
  const [activeThreadId, setActiveThreadId] = useState(null);

  const handleThreadSelect = (id) => {
    setActiveThreadId(id);
  };

  const handleBackToFeed = () => {
    setActiveThreadId(null);
  };

  return (
    <div className={styles.communityContainer}>
      <CommunityHeader 
        isDetailView={!!activeThreadId}
        onBack={handleBackToFeed}
      />
      
      <div className={styles.mainContent}>
        <div className={styles.feedSection}>
          <div className={styles.feedScrollArea}>
            {activeThreadId ? (
              <ThreadDetail threadId={activeThreadId} />
            ) : (
              <ThreadFeed onThreadSelect={handleThreadSelect} />
            )}
          </div>
        </div>
        
        {!activeThreadId && (
          <div className={styles.sidebarSection}>
            <CommunitySidebar />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
