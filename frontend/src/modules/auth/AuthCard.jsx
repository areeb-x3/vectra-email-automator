import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './Auth.css';

const AuthCard = ({ children }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Set CSS variables for shine effect
    cardRef.current.style.setProperty("--mouse-x", `${(mouseX / width) * 100}%`);
    cardRef.current.style.setProperty("--mouse-y", `${(mouseY / height) * 100}%`);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="auth-card"
    >
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
      <div className="auth-card-shine"></div>
    </motion.div>
  );
};

export default AuthCard;
