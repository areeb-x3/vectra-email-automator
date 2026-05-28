import React from 'react';
import { useCommunity } from '../../context/CommunityContext';
import ThreadCard from './ThreadCard';
import styles from './ThreadFeed.module.css';

const ThreadFeed = ({ onThreadSelect }) => {
  const { threads, searchQuery, activeTags, predefinedTags } = useCommunity();

  if (threads.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <h3>No discussions found</h3>
        <p>
          {searchQuery 
            ? `No results for "${searchQuery}"` 
            : activeTags.length > 0 
              ? `No discussions found for selected tags`
              : "Be the first to start a discussion!"}
        </p>
      </div>
    );
  }

  return (
    <div className={styles.feed}>
      {threads.map(thread => (
        <ThreadCard 
          key={thread.id} 
          thread={thread} 
          onClick={onThreadSelect} 
        />
      ))}
    </div>
  );
};

export default ThreadFeed;
