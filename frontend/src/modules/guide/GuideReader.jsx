import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GuideReader.module.css';

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);

const GuideReader = ({ guide, onClose }) => {


  if (!guide) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className={styles.readerContainer}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>

          <div 
            className={`${styles.coverVisual} ${guide.isOfficial ? styles.gradientOfficial : styles.gradientCommunity}`}
            style={{
              backgroundImage: guide.image && guide.image.startsWith('/') 
                ? `linear-gradient(rgba(11, 18, 32, 0.5), rgba(11, 18, 32, 0.9)), url(${guide.image})` 
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          <div className={styles.contentWrapper}>
            <span className={styles.badge}>{guide.category}</span>
            <h1 className={styles.title}>{guide.title}</h1>
            
            <div className={styles.metaRow}>
              {guide.author && (
                <div className={styles.author}>
                  {guide.author.avatar && (
                    <span style={{ 
                      width: 24, height: 24, background: 'var(--primary)', 
                      borderRadius: '50%', display: 'flex', alignItems: 'center', 
                      justifyContent: 'center', fontSize: 12, fontWeight: 'bold' 
                    }}>
                      {guide.author.avatar}
                    </span>
                  )}
                  {guide.author.name}
                </div>
              )}
              {guide.author && <span className={styles.dot} />}
              <span>{guide.readTime} read</span>
              <span className={styles.dot} />
              <span>{guide.difficulty}</span>
              <span className={styles.dot} />
              <span>{(guide.engagement?.views ? (guide.engagement.views / 1000).toFixed(1) + 'k views' : guide.engagement?.saves + ' saves')}</span>
            </div>

            <div 
              className={styles.articleBody} 
              dangerouslySetInnerHTML={{ __html: guide.content || `<p>${guide.description}</p>` }} 
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GuideReader;
