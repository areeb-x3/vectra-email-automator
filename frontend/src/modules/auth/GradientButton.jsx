import React from 'react';
import { motion } from 'framer-motion';
import './Auth.css';

const GradientButton = ({ children, type = "submit", onClick }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className="gradient-btn"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
