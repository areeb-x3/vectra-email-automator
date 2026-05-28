import React from 'react';
import { useCommunity } from '../../context/CommunityContext';
import TagPill from './TagPill';
import styles from './ThreadCard.module.css';

const MessageCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);

const ThreadCard = ({ thread, onClick }) => {
  const { predefinedTags, toggleHelpful, toggleBookmark } = useCommunity();

  const handleHelpfulClick = (e) => {
    e.stopPropagation();
    toggleHelpful(thread.id);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    toggleBookmark(thread.id);
  };

  const threadTags = thread.tags.map(tagId => predefinedTags.find(t => t.id === tagId)).filter(Boolean);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.card} onClick={() => onClick(thread.id)}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>{thread.author.avatar}</div>
          <span className={styles.authorName}>{thread.author.name}</span>
          <span className={styles.timestamp}>• {formatDate(thread.createdAt)}</span>
          {thread.isSolved && (
            <span className={styles.solvedBadge} title="Solved">
              <CheckCircleIcon />
            </span>
          )}
        </div>
      </div>

      <div className={styles.titleWrapper}>
        {thread.type && (
          <span className={styles.semanticBadge}>[{thread.type}]</span>
        )}
        <h3 className={styles.title}>{thread.title}</h3>
      </div>
      
      <p className={styles.preview}>{thread.content}</p>

      <div className={styles.tags}>
        {threadTags.map(tag => (
          <TagPill key={tag.id} tag={tag} />
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${styles.helpfulBtn} ${thread.isHelpful ? styles.isHelpful : ''}`} onClick={handleHelpfulClick}>
            <HeartIcon filled={thread.isHelpful} />
            <span>{thread.helpfulCount}</span>
          </button>
          
          <div className={styles.actionCount}>
            <MessageCircleIcon />
            <span>{thread.replies.length} replies</span>
          </div>
        </div>

        <button className={`${styles.actionBtn} ${thread.isBookmarked ? styles.bookmarked : ''}`} onClick={handleBookmarkClick}>
          <BookmarkIcon filled={thread.isBookmarked} />
        </button>
      </div>
    </div>
  );
};

export default ThreadCard;
