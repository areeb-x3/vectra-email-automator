import React from 'react';
import { motion } from 'framer-motion';
import styles from './SearchFilterLayer.module.css';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const filters = [
  'All',
  'Beginner',
  'Advanced',
  'Productivity',
  'AI',
  'Automation',
  'Scheduler',
  'Community',
  'Trending',
  'Saved'
];

const SearchFilterLayer = ({ activeFilter, setActiveFilter, searchQuery, setSearchQuery }) => {
  return (
    <div className={styles.filterContainer}>
      <div className={styles.searchBar}>
        <div className={styles.searchIcon}>
          <SearchIcon />
        </div>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search workflows, tools, and guides..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.filtersRow}>
        {filters.map((filter) => (
          <motion.button
            key={filter}
            className={`${styles.filterPill} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilterLayer;
