import React from 'react';
import { motion } from 'framer-motion';
import styles from './FeaturedGuideHero.module.css';

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const FeaturedGuideHero = ({ guide, onClick }) => {
  if (!guide) return null;

  return (
    <motion.div 
      className={styles.heroContainer}
      style={{
        backgroundImage: guide.image && guide.image.startsWith('/') 
          ? `linear-gradient(rgba(11, 18, 32, 0.6), rgba(11, 18, 32, 0.6)), url(${guide.image})` 
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.01 }}
      onClick={() => onClick && onClick(guide)}
    >
      <div className={styles.overlay} />
      
      <div className={styles.content}>
        <motion.div 
          className={styles.featuredBadge}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SparkleIcon /> Featured Workflow
        </motion.div>
        
        <motion.h1 
          className={styles.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {guide.title}
        </motion.h1>
        
        <motion.p 
          className={styles.description}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {guide.description}
        </motion.p>
        
        <motion.div 
          className={styles.metadataRow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className={styles.author}>
            <div className={styles.avatar}>{guide.author?.avatar}</div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{guide.author?.name}</span>
          </div>
          
          <div className={styles.metaInfo}>
            <span>{guide.readTime} read</span>
            <span className={styles.dot} />
            <span>{guide.difficulty}</span>
          </div>
          
          <button 
            className={styles.readButton}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick(guide);
            }}
          >
            Start Reading <ArrowRightIcon />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FeaturedGuideHero;
