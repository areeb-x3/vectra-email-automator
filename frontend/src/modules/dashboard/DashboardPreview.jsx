import React from 'react';
import { motion } from 'framer-motion';
import './DashboardPreview.css';

const FEED_ACTIVITIES = [
  { id: 1, text: <>Email sent to segment <strong>"Early Adopters"</strong></>, time: 'Just now' },
  { id: 2, text: <>Campaign <strong>"Product Launch Q2"</strong> completed</>, time: '2 min ago' },
  { id: 3, text: <><strong>"Welcome Flow"</strong> automation triggered</>, time: '12 min ago' },
  { id: 4, text: <>List <strong>"Inbound Leads"</strong> synced (412 contacts)</>, time: '1 hr ago' },
  { id: 5, text: <>A/B test won by version <strong>"Design-B (Green Accent)"</strong></>, time: '3 hr ago' },
  { id: 6, text: <>Webhook received for <strong>"User Signup"</strong> trigger</>, time: '4 hr ago' }
];

const DashboardPreview = () => {
  const [activities, setActivities] = React.useState([
    FEED_ACTIVITIES[0],
    FEED_ACTIVITIES[1],
    FEED_ACTIVITIES[2]
  ]);

  React.useEffect(() => {
    // Keep "Just now" item at the top, shuffle remaining and pick 2
    const justNowItem = FEED_ACTIVITIES.find(item => item.time === 'Just now');
    const remainingItems = FEED_ACTIVITIES.filter(item => item.time !== 'Just now');
    const shuffledRemaining = [...remainingItems].sort(() => 0.5 - Math.random());
    setActivities([justNowItem, ...shuffledRemaining.slice(0, 2)]);
  }, []);

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
        {activities.map((item, index) => (
          <motion.div 
            key={item.id} 
            className="feed-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
          >
            <div className="pulse-dot"></div>
            <div className="feed-text">
              <span>{item.text}</span>
              <span className="time">{item.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPreview;
