import React, { useState } from 'react';
import GuideCard from './GuideCard';
import styles from './CommunityGuidesSection.module.css';

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const CommunityGuidesSection = ({ guides, onGuideClick, bookmarkedIds, onBookmarkToggle }) => {
  const [sortBy, setSortBy] = useState('recent');

  if (!guides || guides.length === 0) return null;

  const sortedGuides = [...guides].sort((a, b) => {
    if (sortBy === 'popular') {
      return (b.engagement?.saves || 0) - (a.engagement?.saves || 0);
    }
    // Default to recent/original order
    return 0;
  });

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.usersIcon}><UsersIcon /></span>
          Community Discoveries
        </h2>
        <select 
          className={styles.sortSelect} 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Most Recent</option>
          <option value="popular">Most Saved</option>
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

export default CommunityGuidesSection;
