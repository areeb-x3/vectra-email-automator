import React from 'react';
import './IconWrapper.css';

const IconWrapper = ({ children, className = '', glow = true, style }) => {
  return (
    <div className={`icon-wrapper ${glow ? '' : 'no-glow'} ${className}`} style={style}>
      {children}
    </div>
  );
};

export default IconWrapper;
