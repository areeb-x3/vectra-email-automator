import React, { useState } from 'react';
import { useCommunity } from '../../context/CommunityContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TagPill from './TagPill';
import styles from './CreateThreadModal.module.css';

const CreateThreadModal = ({ isOpen, onClose }) => {
  const { addThread, predefinedTags } = useCommunity();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(t => t !== tagId)
        : [...prev, tagId]
    );
  };

  const handleClose = () => {
    setTitle('');
    setContent('');
    setSelectedTags([]);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || selectedTags.length === 0) return;
    
    addThread(title, content, selectedTags);
    handleClose();
  };

  const isValid = title.trim() && content.trim() && selectedTags.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Start a New Discussion" size="large">
      <div className={styles.guidanceSection}>
        <p>Ask a question • Suggest a feature • Report a bug • Share a workflow tip</p>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        <div className={styles.formGroup}>
          <input 
            type="text" 
            className={`${styles.input} ${styles.titleInput}`}
            placeholder="What's on your mind? (e.g. How do I chain schedules?)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            required
            autoFocus
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>What would you like to share?</label>
          <textarea 
            className={styles.textarea}
            placeholder="Write your thoughts here... adding context helps others provide better answers."
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={8}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Choose topics related to your discussion</label>
          <div className={styles.tagsContainer}>
            {predefinedTags.map(tag => (
              <TagPill 
                key={tag.id} 
                tag={tag}
                selectable
                selected={selectedTags.includes(tag.id)}
                onClick={() => toggleTag(tag.id)}
              />
            ))}
          </div>
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!isValid}>
            Start Discussion
          </Button>
        </div>

      </form>
    </Modal>
  );
};

export default CreateThreadModal;
