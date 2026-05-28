import React, { useState, useEffect } from 'react';
import { fetchGuidesData } from './mockGuidesData';
import FeaturedGuideHero from './FeaturedGuideHero';
import SearchFilterLayer from './SearchFilterLayer';
import OfficialGuidesSection from './OfficialGuidesSection';
import CommunityGuidesSection from './CommunityGuidesSection';
import TrendingGuidesRail from './TrendingGuidesRail';
import QuickTipsPanel from './QuickTipsPanel';
import GuideReader from './GuideReader';
import styles from './GuidesPage.module.css';

const GuidesPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  const handleBookmarkToggle = (id) => {
    setBookmarkedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchGuidesData();
        setData(result);
      } catch (error) {
        console.error('Error fetching guides:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        {/* Top search & filter skeleton bar */}
        <div className={styles.skeletonHeader}>
          <div className={styles.skeletonTabs}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`${styles.skeletonTab} ${styles.shimmer}`} />
            ))}
          </div>
          <div className={`${styles.skeletonSearch} ${styles.shimmer}`} />
        </div>

        {/* Hero featured guide card skeleton */}
        <div className={`${styles.skeletonHero} ${styles.shimmer}`} />

        <div className={styles.layoutGrid}>
          {/* Main workspace column skeleton */}
          <div className={styles.mainColumn}>
            <div className={`${styles.skeletonTitle} ${styles.shimmer}`} />
            <div className={styles.skeletonGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.skeletonCard}>
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineShort} ${styles.shimmer}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineLong} ${styles.shimmer}`} />
                  <div className={`${styles.skeletonLine} ${styles.skeletonLineMedium} ${styles.shimmer}`} />
                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                    <div className={`${styles.skeletonTab} ${styles.shimmer}`} style={{ width: '45px', height: '16px', borderRadius: '4px' }} />
                    <div className={`${styles.skeletonTab} ${styles.shimmer}`} style={{ width: '60px', height: '16px', borderRadius: '4px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar ecosystem column skeleton */}
          <div className={styles.sidebarColumn}>
            <div className={`${styles.skeletonSidebarCard} ${styles.shimmer}`} />
            <div className={`${styles.skeletonSidebarCard} ${styles.shimmer}`} />
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Filter logic
  const filterGuides = (guides) => {
    return guides.filter(guide => {
      const matchesSearch = 
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = activeFilter === 'All' || 
        guide.category === activeFilter ||
        guide.difficulty === activeFilter ||
        guide.tags.includes(activeFilter) ||
        (activeFilter === 'Trending' && guide.trending) ||
        (activeFilter === 'Community' && !guide.isOfficial) ||
        (activeFilter === 'Saved' && bookmarkedIds.has(guide.id));

      return matchesSearch && matchesFilter;
    });
  };

  const filteredOfficial = filterGuides(data.official);
  const filteredCommunity = filterGuides(data.community);

  const showHero = activeFilter === 'All' && searchQuery === '';

  if (selectedGuide) {
    return (
      <div className={styles.pageContainer} style={{ padding: 0 }}>
        <GuideReader 
          guide={selectedGuide} 
          onClose={() => setSelectedGuide(null)} 
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Guides</h1>
        <p className={styles.pageSubtitle}>Explore official documentation, trending workflows, and quick tips.</p>
      </div>

      <SearchFilterLayer 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {showHero && <FeaturedGuideHero guide={data.featured} onClick={setSelectedGuide} />}

      <div className={styles.layoutGrid}>
        <div className={styles.mainColumn}>
          {(filteredOfficial.length > 0 || showHero) && (
            <OfficialGuidesSection 
              guides={filteredOfficial} 
              onGuideClick={setSelectedGuide} 
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )}
          
          {(filteredCommunity.length > 0 || showHero) && (
            <CommunityGuidesSection 
              guides={filteredCommunity} 
              onGuideClick={setSelectedGuide} 
              bookmarkedIds={bookmarkedIds}
              onBookmarkToggle={handleBookmarkToggle}
            />
          )}

          {filteredOfficial.length === 0 && filteredCommunity.length === 0 && (
            <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '4rem 0' }}>
              No workflows found matching your criteria.
            </div>
          )}
        </div>

        <div className={styles.sidebarColumn}>
          <TrendingGuidesRail guides={[...data.official, ...data.community]} />
          <QuickTipsPanel tips={data.tips} />
        </div>
      </div>
    </div>
  );
};

export default GuidesPage;
