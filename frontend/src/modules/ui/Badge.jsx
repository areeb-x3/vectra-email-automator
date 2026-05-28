import React from 'react';
import './Badge.css';

const Badge = ({ children, variant = 'muted', icon: Icon, className = '', ...props }) => {
  return (
    <div className={`badge badge-${variant} ${className}`} {...props}>
      {Icon && <Icon className="badge-icon" />}
      <span>{children}</span>
    </div>
  );
};

export default Badge;
