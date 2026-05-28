import React, { useState } from 'react';
import GuideCard from './GuideCard';
import styles from './OfficialGuidesSection.module.css';

const VerifiedShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const OfficialGuidesSection = ({ guides, onGuideClick, bookmarkedIds, onBookmarkToggle }) => {
  const [sortBy, setSortBy] = useState('recent');

  if (!guides || guides.length === 0) return null;

  const sortedGuides = [...guides].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.engagement?.views || 0) - (a.engagement?.views || 0);
    }
    // Default to recent/original order
    return 0;
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.verifiedIcon}><VerifiedShieldIcon /></span>
          Official Guides
        </h2>
        <select 
          className={styles.sortSelect} 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Viewed</option>
        </select>
      </div>
      
      <div className={styles.grid}>
        {sortedGuides.map((guide, index) => (
          <GuideCard 
            key={guide.id} 
            guide={guide} 
            index={index} 
            onClick={onGuideClick}
            isBookmarked={bookmarkedIds?.has(guide.id)}
            onBookmark={onBookmarkToggle}
          />
        ))}
      </div>
    </section>
  );
};

export default OfficialGuidesSection;
