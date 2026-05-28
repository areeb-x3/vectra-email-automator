import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { authAPI } from '../../lib/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  const { organisations } = useOrganisations();
  const navigate = useNavigate();

  useEffect(() => {
    authAPI.getCurrentUser()
      .then(res => {
        if (res.status === 'success' && res.user) {
          setIsLoading(false);
        } else {
          navigate('/login');
        }
      })
      .catch(() => {
        navigate('/login');
      });
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--gradient-bg)',
        color: 'var(--text-primary)',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--border)',
            borderTop: '3px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
            Verifying session...
          </span>
        </div>
      </div>
    );
  }

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
