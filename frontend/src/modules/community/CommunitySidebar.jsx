import React from 'react';
import { useCommunity } from '../../context/CommunityContext';
import TagPill from './TagPill';
import styles from './CommunitySidebar.module.css';

const CommunitySidebar = () => {
  const { predefinedTags, activeTags, setActiveTags, allThreads, currentUser } = useCommunity();

  const handleTagClick = (tagId) => {
    setActiveTags(prev => prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]);
  };

  const totalThreads = allThreads.length;
  const solvedThreads = allThreads.filter(t => t.isSolved).length;
  const totalReplies = allThreads.reduce((acc, thread) => acc + thread.replies.length, 0);

  return (
    <div className={styles.sidebar}>
      
      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Filter by Topic</h3>
        <div className={styles.tagsContainer}>
          {predefinedTags.map(tag => (
            <TagPill 
              key={tag.id} 
              tag={tag} 
              selectable 
              selected={activeTags.includes(tag.id)}
              onClick={handleTagClick} 
            />
          ))}
        </div>
      </div>

      {currentUser?.role === 'Admin' && (
        <div className={styles.widget}>
          <h3 className={styles.widgetTitle}>Community Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalThreads}</span>
              <span className={styles.statLabel}>Discussions</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{totalReplies}</span>
              <span className={styles.statLabel}>Replies</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{solvedThreads}</span>
              <span className={styles.statLabel}>Solved</span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.widget}>
        <h3 className={styles.widgetTitle}>Community Guidelines</h3>
        <ul className={styles.guidelinesList}>
          <li>Be respectful and constructive</li>
          <li>Search before asking a question</li>
          <li>Mark answers as helpful/solved</li>
          <li>Share your workflows and tips</li>
        </ul>
      </div>

    </div>
  );
};

export default CommunitySidebar;
