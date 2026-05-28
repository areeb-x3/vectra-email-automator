import React from 'react';
import { motion } from 'framer-motion';
import styles from './GuideCard.module.css';

const BookmarkIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

const ViewIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);

const VerifiedIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" />
  </svg>
);

const GuideCard = ({ guide, index = 0, onClick, isBookmarked, onBookmark }) => {
  const {
    title,
    description,
    category,
    readTime,
    difficulty,
    tags,
    engagement,
    isOfficial
  } = guide;

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookmark) onBookmark(guide.id);
  };

  return (
    <motion.div
      className={`${styles.cardWrapper} ${isOfficial ? styles.official : styles.community}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, type: 'spring' }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => {
        if (e.target.closest('button')) return;
        if (onClick) onClick(guide);
      }}
    >
      <div
        className={`${styles.coverVisual} ${isOfficial ? styles.gradientOfficial : styles.gradientCommunity}`}
        style={{
          backgroundImage: guide.image && guide.image.startsWith('/')
            ? `linear-gradient(rgba(11, 18, 32, 0.6), rgba(11, 18, 32, 0.6)), url(${guide.image})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {!guide.image && <div className={`${styles.abstractShape} ${styles.shape1}`} />}
        {!guide.image && <div className={`${styles.abstractShape} ${styles.shape2}`} />}

        <span className={styles.badge}>{category}</span>

        {isOfficial ? (
          <div className={styles.officialBadge}>
            <VerifiedIcon /> Verified
          </div>
        ) : (
          <button
            className={`${styles.bookmarkAction} ${isBookmarked ? styles.activeBookmark : ''}`}
            aria-label="Save guide"
            onClick={handleBookmark}
            onPointerDown={(e) => e.stopPropagation()}
            style={isBookmarked ? { color: 'var(--primary-cyan)', background: 'rgba(6, 182, 212, 0.15)', borderColor: 'var(--primary-cyan)' } : {}}
          >
            <BookmarkIcon filled={isBookmarked} />
          </button>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <div className={styles.tags}>
          {tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>

        <div className={styles.metadata}>
          <div className={styles.readInfo}>
            <span>{readTime}</span>
            <span className={styles.dot} />
            <span>{difficulty}</span>
          </div>

          <div className={styles.engagement}>
            <button 
              className={styles.statButton}
              onClick={handleBookmark}
              onPointerDown={(e) => e.stopPropagation()}
              style={isBookmarked ? { color: 'var(--primary-cyan)' } : {}}
            >
              <BookmarkIcon filled={isBookmarked} />
              <span>{engagement.saves + (isBookmarked ? 1 : 0)}</span>
            </button>
            {engagement.views && (
              <div className={styles.stat}>
                <ViewIcon />
                <span>{(engagement.views / 1000).toFixed(1)}k</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GuideCard;
