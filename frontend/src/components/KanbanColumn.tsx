'use client';

import React, { useState } from 'react';
import { ColumnType, CardType } from '@/context/KanbanContext';
import { KanbanCard } from './KanbanCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useKanban } from '@/context/KanbanContext';
import { Plus } from 'lucide-react';

import styles from './KanbanColumn.module.css';

interface KanbanColumnProps {
  column: ColumnType;
  cards: CardType[];
  onAddCard: () => void;
  onEditCard: (card: CardType) => void;
}

export function KanbanColumn({ column, cards, onAddCard, onEditCard }: KanbanColumnProps) {
  const { renameColumn } = useKanban();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(column.title);

  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  const cardIds = cards.map((card) => card.id);

  const handleTitleSubmit = () => {
    setIsEditing(false);
    if (title.trim() && title !== column.title) {
      renameColumn(column.id, title.trim());
    } else {
      setTitle(column.title);
    }
  };

  return (
    <div className={styles.columnContainer}>
      <div className={styles.columnHeader} onClick={() => setIsEditing(!isEditing)}>
        {isEditing ? (
          <input
            autoFocus
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTitleSubmit();
              if (e.key === 'Escape') {
                setTitle(column.title);
                setIsEditing(false);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className={styles.title} title="Click to rename">{column.title}</h3>
        )}
        <div className={styles.badge}>{cards.length}</div>
      </div>

      <div className={styles.cardsContainer} ref={setNodeRef}>
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <KanbanCard key={card.id} card={card} onEditClick={onEditCard} />
          ))}
        </SortableContext>
      </div>

      <button className={styles.addCardButton} onClick={onAddCard}>
        <Plus size={16} />
        Add Card
      </button>
    </div>
  );
}
