import React from 'react';
import { motion } from 'framer-motion';
import './DashboardPreview.css';

const DashboardPreview = () => {
  return (
    <div className="dashboard-preview">
      <div className="preview-header">
        <div className="dots">
          <span></span><span></span><span></span>
        </div>
        <div className="address-bar">vectra.io/dashboard</div>
      </div>
      
      <div className="preview-content">
        <div className="stats-grid">
          {[
            { label: 'Active Campaigns', value: 12, color: 'var(--primary)' },
            { label: 'Total Sends', value: 45200, color: 'var(--cyan)' },
            { label: 'Avg. Open Rate', value: '24.8%', color: 'var(--success)' }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              className="stat-card"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className="stat-label">{stat.label}</span>
              <motion.span 
                className="stat-value"
                style={{ color: stat.color }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
              >
                {stat.value}
              </motion.span>
            </motion.div>
          ))}
        </div>

        <div className="chart-area">
          <div className="chart-header">
            <h3>Campaign Performance</h3>
            <div className="chart-legend">
              <span><i style={{ background: 'var(--primary)' }}></i> Sent</span>
              <span><i style={{ background: 'var(--cyan)' }}></i> Opened</span>
            </div>
          </div>
          <div className="bars-container">
            {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
              <div key={i} className="bar-group">
                <motion.div 
                  className="bar sent"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: "easeOut" }}
                />
                <motion.div 
                  className="bar opened"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h * 0.6}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: "easeOut" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="activity-feed">
        <div className="feed-header">Live Activity</div>
        {[1, 2, 3].map((item) => (
          <motion.div 
            key={item} 
            className="feed-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + item * 0.1 }}
          >
            <div className="pulse-dot"></div>
            <div className="feed-text">
              <span>Email sent to segment <strong>"Early Adopters"</strong></span>
              <span className="time">Just now</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPreview;
