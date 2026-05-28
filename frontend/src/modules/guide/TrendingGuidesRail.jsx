import React from 'react';
import styles from './SidePanels.module.css';

const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 22 12 12l5 5L22 7"/><path d="M16 7h6v6"/>
  </svg>
);

const TrendingGuidesRail = ({ guides }) => {
  const trendingGuides = guides?.filter(g => g.trending).slice(0, 4) || [];
  
  if (trendingGuides.length === 0) return null;

  return (
    <div className={styles.panel}>
      <h3 className={styles.title}>
        <span className={styles.trendingIcon}><TrendingIcon /></span>
        Trending This Week
      </h3>
      <div className={styles.list}>
        {trendingGuides.map((guide) => (
          <div key={guide.id} className={styles.item}>
            <div className={styles.itemTitle}>{guide.title}</div>
            <div className={styles.itemMeta}>
              <span>{guide.category}</span>
              <span className={styles.dot} />
              <span>{(guide.engagement?.saves || 0)} saves</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendingGuidesRail;
