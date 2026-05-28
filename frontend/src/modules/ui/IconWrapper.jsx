import React from 'react';
import './IconWrapper.css';

const IconWrapper = ({ children, className = '' }) => {
  return (
    <div className={`icon-wrapper ${className}`}>
      {children}
    </div>
  );
};

export default IconWrapper;
