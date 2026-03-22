'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CardType } from '@/context/KanbanContext';
import { Trash2, Edit2 } from 'lucide-react';
import { useKanban } from '@/context/KanbanContext';

import styles from './KanbanCard.module.css';

interface KanbanCardProps {
  card: CardType;
  onEditClick: (card: CardType) => void;
}

export function KanbanCard({ card, onEditClick }: KanbanCardProps) {
  const { deleteCard } = useKanban();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: 'Card', card } });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className={`${styles.card} ${styles.dragging}`} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.card}
      onClick={() => onEditClick(card)}
    >
      <div className={styles.cardHeader}>
        <h4 className={styles.title}>{card.title}</h4>
        <button
          title="Delete card"
          className={styles.deleteButton}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
          onClick={(e) => {
            e.stopPropagation();
            deleteCard(card.id);
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className={styles.details}>{card.details}</p>
    </div>
  );
}
