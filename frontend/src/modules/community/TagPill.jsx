import React from 'react';
import styles from './TagPill.module.css';

const TagPill = ({ tag, onClick, selectable, selected }) => {
  if (!tag) return null;

  return (
    <button
      className={`${styles.tagPill} ${selectable ? styles.selectable : ''} ${selected ? styles.selected : ''}`}
      onClick={() => onClick && onClick(tag.id)}
      style={{
        '--tag-color': tag.color,
      }}
      type="button"
    >
      {tag.label}
    </button>
  );
};

export default TagPill;
