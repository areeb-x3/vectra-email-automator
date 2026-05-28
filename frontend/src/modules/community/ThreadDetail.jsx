import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import TagPill from './TagPill';
import ReplyCard from './ReplyCard';
import Button from '../ui/Button';
import styles from './ThreadDetail.module.css';

const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  </svg>
);

const BookmarkIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/>
  </svg>
);

const ThreadDetail = ({ threadId }) => {
  const { allThreads, predefinedTags, toggleHelpful, toggleBookmark, toggleSolved, addReply } = useCommunity();
  const [replyContent, setReplyContent] = useState('');

  const thread = allThreads.find(t => t.id === threadId);

  if (!thread) return <div>Thread not found.</div>;

  const threadTags = thread.tags.map(tagId => predefinedTags.find(t => t.id === tagId)).filter(Boolean);

  const handleHelpfulClick = () => toggleHelpful(thread.id);
  const handleBookmarkClick = () => toggleBookmark(thread.id);
  const handleSolvedClick = () => toggleSolved(thread.id);

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    addReply(thread.id, replyContent);
    setReplyContent('');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={styles.container}>
      
      {/* Thread Main Content */}
      <div className={styles.mainPost}>
        <div className={styles.header}>
          <div className={styles.authorInfo}>
            <div className={styles.avatar}>{thread.author.avatar}</div>
            <div>
              <div className={styles.authorName}>{thread.author.name}</div>
              <div className={styles.timestamp}>{formatDate(thread.createdAt)}</div>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button className={`${styles.actionBtn} ${thread.isSolved ? styles.isSolved : ''}`} onClick={handleSolvedClick} title="Mark as Solved">
              <CheckCircleIcon />
            </button>
            <button className={`${styles.actionBtn} ${thread.isBookmarked ? styles.isBookmarked : ''}`} onClick={handleBookmarkClick} title="Bookmark">
              <BookmarkIcon filled={thread.isBookmarked} />
            </button>
          </div>
        </div>

        <h1 className={styles.title}>{thread.title}</h1>
        
        <div className={styles.tags}>
          {threadTags.map(tag => (
            <TagPill key={tag.id} tag={tag} />
          ))}
        </div>

        <div className={styles.content}>
          {thread.content}
        </div>

        <div className={styles.postFooter}>
          <button className={`${styles.helpfulBtn} ${thread.isHelpful ? styles.isHelpful : ''}`} onClick={handleHelpfulClick}>
            <HeartIcon filled={thread.isHelpful} />
            <span>{thread.helpfulCount} people found this helpful</span>
          </button>
        </div>
      </div>

      {/* Replies Section */}
      <div className={styles.repliesSection}>
        <h3 className={styles.repliesCount}>{thread.replies.length} Replies</h3>
        
        <div className={styles.repliesList}>
          {thread.replies.map(reply => (
            <ReplyCard key={reply.id} threadId={thread.id} reply={reply} />
          ))}
        </div>
      </div>

      {/* Reply Input Area */}
      <div className={styles.replyArea}>
        <form onSubmit={handleSubmitReply} className={styles.replyForm}>
          <textarea 
            className={styles.replyInput} 
            placeholder="Write a thoughtful reply..." 
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={4}
          />
          <div className={styles.replyFormFooter}>
            <span className={styles.markdownHint}>Markdown is not supported yet.</span>
            <Button variant="primary" type="submit" disabled={!replyContent.trim()}>
              Post Reply
            </Button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default ThreadDetail;
