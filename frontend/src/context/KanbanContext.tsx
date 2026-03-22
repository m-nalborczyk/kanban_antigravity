'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Id = string | number;

export interface CardType {
  id: Id;
  columnId: Id;
  title: string;
  details: string;
}

export interface ColumnType {
  id: Id;
  title: string;
}

interface KanbanContextProps {
  columns: ColumnType[];
  cards: CardType[];
  renameColumn: (id: Id, newTitle: string) => void;
  addCard: (columnId: Id, title: string, details: string) => void;
  editCard: (id: Id, newTitle: string, newDetails: string) => void;
  deleteCard: (id: Id) => void;
  moveCard: (cardId: Id, newColumnId: Id) => void;
  reorderCards: (activeId: Id, overId: Id) => void;
}

const defaultColumns: ColumnType[] = [
  { id: 'col-1', title: 'To Do' },
  { id: 'col-2', title: 'In Progress' },
  { id: 'col-3', title: 'Review' },
  { id: 'col-4', title: 'Testing' },
  { id: 'col-5', title: 'Done' },
];

const defaultCards: CardType[] = [
  { id: 'card-1', columnId: 'col-1', title: 'Project kick-off', details: 'Initial meeting to discuss requirements.' },
  { id: 'card-2', columnId: 'col-1', title: 'Design system', details: 'Setup color palette and typography.' },
  { id: 'card-3', columnId: 'col-2', title: 'Kanban board MVP', details: 'Implement basic drag and drop features.' },
  { id: 'card-4', columnId: 'col-3', title: 'Code review', details: 'Review the latest PRs.' },
  { id: 'card-5', columnId: 'col-5', title: 'Setup repository', details: 'Initialize Git, Next.js, and CI/CD.' },
];

const KanbanContext = createContext<KanbanContextProps | undefined>(undefined);

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  const [columns, setColumns] = useState<ColumnType[]>(defaultColumns);
  const [cards, setCards] = useState<CardType[]>(defaultCards);

  const renameColumn = (id: Id, newTitle: string) => {
    setColumns((prev) => prev.map((col) => (col.id === id ? { ...col, title: newTitle } : col)));
  };

  const addCard = (columnId: Id, title: string, details: string) => {
    const newCard: CardType = {
      id: `card-${Date.now()}`,
      columnId,
      title,
      details,
    };
    setCards((prev) => [...prev, newCard]);
  };

  const editCard = (id: Id, newTitle: string, newDetails: string) => {
    setCards((prev) => prev.map((card) => 
      card.id === id ? { ...card, title: newTitle, details: newDetails } : card
    ));
  };

  const deleteCard = (id: Id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  const moveCard = (cardId: Id, newColumnId: Id) => {
    setCards((prev) => prev.map((card) => 
      card.id === cardId ? { ...card, columnId: newColumnId } : card
    ));
  };

  const reorderCards = (activeId: Id, overId: Id) => {
    setCards((prev) => {
      const oldIndex = prev.findIndex((card) => card.id === activeId);
      const newIndex = prev.findIndex((card) => card.id === overId);
      
      const newCards = [...prev];
      const [movedCard] = newCards.splice(oldIndex, 1);
      newCards.splice(newIndex, 0, movedCard);
      
      return newCards;
    });
  };

  return (
    <KanbanContext.Provider value={{ columns, cards, renameColumn, addCard, editCard, deleteCard, moveCard, reorderCards }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
