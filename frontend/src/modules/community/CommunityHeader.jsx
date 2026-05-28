import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import Button from '../ui/Button';
import styles from './CommunityHeader.module.css';
import CreateThreadModal from './CreateThreadModal';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const SORT_OPTIONS = ['Latest', 'Popular', 'Solved', 'Unanswered', 'Bookmarked'];

const CommunityHeader = ({ isDetailView, onBack }) => {
  const { searchQuery, setSearchQuery, sortBy, setSortBy, allThreads } = useCommunity();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const activeCount = allThreads.length;
  const unresolvedCount = allThreads.filter(t => !t.isSolved).length;

  return (
    <>
      {!isDetailView && (
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Community</h1>
          <p className={styles.pageSubtitle}>Connect with other creators, share workflows, and get help.</p>
        </div>
      )}
      <div className={styles.header}>
        {isDetailView ? (
          <div className={styles.leftSection}>
            <button className={styles.backButton} onClick={onBack}>
              <ArrowLeftIcon />
              <span>Back to Discussions</span>
            </button>
          </div>
        ) : (
          <div className={styles.leftSection}>
            <div className={styles.searchWrapper}>
              <SearchIcon />
              <input 
                type="text" 
                placeholder="Search discussions..." 
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className={styles.sortWrapper}>
              <FilterIcon />
              <div className={styles.customDropdown}>
                <button 
                  className={styles.dropdownToggle}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                >
                  {sortBy}
                </button>
                {isSortOpen && (
                  <div className={styles.dropdownMenu}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        className={`${styles.dropdownItem} ${sortBy === opt ? styles.activeSort : ''}`}
                        onClick={() => {
                          setSortBy(opt);
                          setIsSortOpen(false);
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.activityStats}>
              <span className={styles.statDot} />
              {activeCount} active discussions • {unresolvedCount} unresolved
            </div>
          </div>
        )}

        <div className={styles.rightSection}>
          {!isDetailView && (
            <div className={styles.ctaWrapper}>
              <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                New Discussion
              </Button>
            </div>
          )}
        </div>
      </div>

      <CreateThreadModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
    </>
  );
};

export default CommunityHeader;
