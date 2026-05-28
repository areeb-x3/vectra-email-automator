import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Badge from '../ui/Badge';
import styles from './Sidebar.module.css';
import { authAPI } from '../../lib/api';

// Icons as inline SVGs
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/>
  </svg>
);


const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const navItems = [
  { id: 'home', label: 'Home', icon: <HomeIcon /> },
  { id: 'organisation', label: 'Organization', icon: <BuildingIcon /> },
  { id: 'scheduled', label: 'Scheduler', icon: <ClockIcon /> },
  { id: 'community', label: 'Community', icon: <UsersIcon /> },
  { id: 'guides', label: 'Guide', icon: <BookIcon /> },
];

const Sidebar = ({ activeTab = 'home', onTabChange }) => {
  const [user, setUser] = useState(null);
  const [showFlyout, setShowFlyout] = useState(false);
  const navigate = useNavigate();
  const footerRef = useRef(null);

  useEffect(() => {
    authAPI.getCurrentUser()
      .then(res => {
        if (res.status === 'success' && res.user) {
          setUser(res.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (footerRef.current && !footerRef.current.contains(event.target)) {
        setShowFlyout(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.stopPropagation();
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/login');
    }
  };

  const getInitials = () => {
    if (!user) return 'JD';
    const first = user.first_name ? user.first_name[0].toUpperCase() : '';
    const last = user.last_name ? user.last_name[0].toUpperCase() : '';
    return first + last || user.email[0].toUpperCase();
  };

  const getFullName = () => {
    if (!user) return 'John Doe';
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email;
  };

  return (
    <aside className={styles.sidebar}>
      {/* <div className={styles.logo}>
        <div className={styles.logoIcon}>V</div>
        <span className={styles.logoText}>Vectra</span>
      </div> */}

      <nav className={styles.nav}>
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
            onClick={() => onTabChange && onTabChange(item.id)}
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {activeTab === item.id && (
              <motion.div
                layoutId="activePill"
                className={styles.activePill}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div ref={footerRef} className={styles.footer} style={{ position: 'relative' }}>
        {showFlyout && (
          <div className={styles.profileFlyout}>
            <button className={styles.flyoutItem}>Upgrade Plan</button>
            <button className={styles.flyoutItem}>Account Settings</button>
            <button className={styles.flyoutItem}>Help</button>
            <div className={styles.flyoutDivider} />
            <button className={`${styles.flyoutItem} ${styles.danger}`} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
        <div className={styles.userProfile} onClick={() => setShowFlyout(!showFlyout)} style={{ cursor: 'pointer' }}>
          <div className={styles.avatar}>{getInitials()}</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{getFullName()}</span>
            <Badge variant="premium">Premium</Badge>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
