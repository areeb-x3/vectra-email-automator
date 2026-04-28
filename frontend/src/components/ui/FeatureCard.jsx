import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import IconWrapper from './IconWrapper';
import './FeatureCard.css';

const FeatureCard = ({ icon, title, description }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Set CSS variables for shine effect
    e.currentTarget.style.setProperty("--mouse-x", `${(mouseX / width) * 100}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${(mouseY / height) * 100}%`);

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      className="feature-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ y: -6 }}
    >
      <div style={{ transform: "translateZ(50px)" }}>
        <IconWrapper>
          {icon}
        </IconWrapper>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="card-shine"></div>
    </motion.div>
  );
};

export default FeatureCard;
