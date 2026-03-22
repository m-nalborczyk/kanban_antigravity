'use client';

import React, { useState, useEffect } from 'react';
import { useKanban, Id, CardType } from '@/context/KanbanContext';
import { X } from 'lucide-react';

import styles from './CardModal.module.css';

interface CardModalProps {
  type: 'add' | 'edit';
  columnId?: Id;
  card?: CardType;
  onClose: () => void;
}

export function CardModal({ type, columnId, card, onClose }: CardModalProps) {
  const { addCard, editCard } = useKanban();
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  useEffect(() => {
    if (type === 'edit' && card) {
      setTitle(card.title);
      setDetails(card.details);
    }
  }, [type, card]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (type === 'add' && columnId) {
      addCard(columnId, title.trim(), details.trim());
    } else if (type === 'edit' && card) {
      editCard(card.id, title.trim(), details.trim());
    }
    
    onClose();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{type === 'add' ? 'Add New Card' : 'Edit Card'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="cardTitle">Title</label>
            <input
              id="cardTitle"
              autoFocus
              className={styles.inputField}
              placeholder="e.g., Update documentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="cardDetails">Description</label>
            <textarea
              id="cardDetails"
              className={styles.textareaField}
              placeholder="Add more details..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={!title.trim()}
              style={{ opacity: !title.trim() ? 0.5 : 1 }}
            >
              {type === 'add' ? 'Add Card' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
