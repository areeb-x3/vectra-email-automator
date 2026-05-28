import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Dropzone.module.css';

const Dropzone = ({ onFileSelect, accept = '.csv', label = 'Click to upload or drag and drop', compact = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFile = (file) => {
    if (onFileSelect) onFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <motion.div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${compact ? styles.compact : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFile(e.target.files[0])}
        accept={accept}
        className={styles.hiddenInput}
      />
      <div className={styles.icon}>
        <svg width={compact ? "24" : "40"} height={compact ? "24" : "40"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <p className={styles.label}>{compact ? 'Upload CSV' : label}</p>
      {!compact && <p className={styles.hint}>Supported formats: {accept}</p>}
    </motion.div>
  );
};

export default Dropzone;
