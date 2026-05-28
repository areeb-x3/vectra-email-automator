import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './Card.css';

const Card = ({ 
  children, 
  variant = 'standard', 
  interactive = false, 
  glowColor = 'rgba(79, 70, 229, 0.5)',
  className = '',
  style = {},
  ...props 
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty("--mouse-x", `${(mouseX / width) * 100}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${(mouseY / height) * 100}%`);

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    x.set(0);
    y.set(0);
  };

  const Comp = interactive ? motion.div : motion.div;

  return (
    <Comp
      className={`glass-card card-${variant} ${interactive ? 'card-interactive' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        ...(interactive ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}),
        '--glow-color': glowColor,
        '--glow-color-soft': glowColor.replace('0.5', '0.15'),
        ...style
      }}
      {...props}
    >
      {interactive && <div className="card-shine" />}
      <div className="card-content" style={interactive ? { transform: "translateZ(30px)" } : {}}>
        {children}
      </div>
      <div 
        className="card-glow" 
        style={{ 
          backgroundColor: glowColor,
          ...(interactive ? { transform: "translateZ(-10px)" } : {})
        }} 
      />
    </Comp>
  );
};

export default Card;
