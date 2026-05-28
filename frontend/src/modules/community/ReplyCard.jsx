import React from 'react';
import { useCommunity } from '../../context/CommunityContext';
import styles from './ReplyCard.module.css';

const HeartIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const ReplyCard = ({ threadId, reply }) => {
  const { toggleReplyHelpful } = useCommunity();

  const handleHelpfulClick = () => {
    toggleReplyHelpful(threadId, reply.id);
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={styles.replyCard}>
      <div className={styles.header}>
        <div className={styles.authorInfo}>
          <div className={styles.avatar}>{reply.author.avatar}</div>
          <span className={styles.authorName}>{reply.author.name}</span>
          <span className={styles.timestamp}>• {timeAgo(reply.createdAt)}</span>
        </div>
        
        <button 
          className={`${styles.helpfulBtn} ${reply.isHelpful ? styles.isHelpful : ''}`} 
          onClick={handleHelpfulClick}
        >
          <HeartIcon filled={reply.isHelpful} />
          <span>{reply.helpfulCount > 0 ? reply.helpfulCount : 'Helpful'}</span>
        </button>
      </div>
      
      <div className={styles.content}>
        {reply.content}
      </div>
    </div>
  );
};

export default ReplyCard;
