import React from 'react';
import { motion } from 'framer-motion';
import './IconWrapper.css';

const IconWrapper = ({ children, className = '' }) => {
  return (
    <motion.div 
      className={`icon-wrapper ${className}`}
      animate={{
        boxShadow: ["0 4px 10px rgba(0, 0, 0, 0.2)", "0 4px 20px rgba(124, 58, 237, 0.3)", "0 4px 10px rgba(0, 0, 0, 0.2)"]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default IconWrapper;
