import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PremiumBanner from './PremiumBanner';
import StatsRow from './StatsRow';
import ScheduleCard from './ScheduleCard';
import OrganisationCard from './OrganisationCard';
import OrganisationsPage from '../campaigns/OrganisationsPage';
import SchedulerPage from '../scheduler/SchedulerPage';
import CommunityPage from '../community/CommunityPage';
import GuidesPage from '../guide/GuidesPage';
import { useOrganisations } from '../../context/OrganisationContext';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { organisations } = useOrganisations();

  return (
    <div className={styles.dashboardContainer}>
      <Header />
      
      <div className={styles.workspaceBody}>
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className={styles.mainContent}>
          <div className={styles.scrollArea}>
            <div className={styles.contentWrapper}>
              {activeTab === 'home' && (
                <>
                  <PremiumBanner />
                  <StatsRow />
                </>
              )}
              
              <div className={styles.grid}>
                {activeTab === 'home' ? (
                  <>
                    <div className={styles.gridLeft}>
                      <ScheduleCard />
                    </div>
                    <div className={styles.gridRight}>
                      <OrganisationCard organisations={organisations} />
                    </div>
                  </>
                ) : activeTab === 'organisation' ? (
                  <div className={styles.fullWidth}>
                    <OrganisationsPage />
                  </div>
                ) : activeTab === 'scheduled' ? (
                  <div className={styles.fullWidth}>
                    <SchedulerPage />
                  </div>
                ) : activeTab === 'community' ? (
                  <div className={styles.fullWidth}>
                    <CommunityPage />
                  </div>
                ) : activeTab === 'guides' ? (
                  <div className={styles.fullWidth}>
                    <GuidesPage />
                  </div>
                ) : (
                  <div className={styles.placeholder}>
                    <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon...</h3>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
