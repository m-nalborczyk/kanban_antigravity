'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';

import { useKanban, Id, CardType } from '@/context/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { CardModal } from './CardModal';

import styles from './KanbanBoard.module.css';

export function KanbanBoard() {
  const { columns, cards, moveCard, reorderCards } = useKanban();
  const [activeCard, setActiveCard] = useState<CardType | null>(null);
  
  const [modalConfig, setModalConfig] = useState<{type: 'add', columnId: Id} | {type: 'edit', card: CardType} | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'Card') {
      setActiveCard(active.data.current.card);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'Card';
    const isOverCard = over.data.current?.type === 'Card';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveCard) return;

    // Im dropping a Card over another Card
    if (isActiveCard && isOverCard) {
      const activeCardIndex = cards.findIndex((c) => c.id === activeId);
      const overCardIndex = cards.findIndex((c) => c.id === overId);
      
      const overCardColumnId = cards[overCardIndex].columnId;
      const activeCardColumnId = cards[activeCardIndex].columnId;

      if (activeCardColumnId !== overCardColumnId) {
        moveCard(activeId, overCardColumnId);
      }
    }

    // Im dropping a Card over an empty Column
    if (isActiveCard && isOverColumn) {
      moveCard(activeId, overId);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveCard = active.data.current?.type === 'Card';
    if (isActiveCard) {
      // In the same column, we reorder
      const activeCardObj = cards.find(c => c.id === activeId);
      const overCardObj = cards.find(c => c.id === overId);
      
      if (activeCardObj && overCardObj && activeCardObj.columnId === overCardObj.columnId) {
         reorderCards(activeId, overId);
      }
    }
  };

  return (
    <div className={styles.boardContainer}>
      <header className={styles.boardHeader}>
        <h1 className={styles.boardTitle}>Project Alpha</h1>
        <p className={styles.boardSubtitle}>Kanban MVP</p>
      </header>

      <div className={styles.columnsWrapper}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
        >
          <div className={styles.columnsList}>
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                cards={cards.filter((card) => card.columnId === col.id)}
                onAddCard={() => setModalConfig({ type: 'add', columnId: col.id })}
                onEditCard={(card) => setModalConfig({ type: 'edit', card })}
              />
            ))}
          </div>

          <DragOverlay>
            {activeCard ? <KanbanCard card={activeCard} onEditClick={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {modalConfig && (
        <CardModal
          type={modalConfig.type}
          columnId={modalConfig.type === 'add' ? modalConfig.columnId : undefined}
          card={modalConfig.type === 'edit' ? modalConfig.card : undefined}
          onClose={() => setModalConfig(null)}
        />
      )}
    </div>
  );
}
