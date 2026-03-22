import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { KanbanProvider, useKanban } from '../KanbanContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <KanbanProvider>{children}</KanbanProvider>
);

describe('KanbanContext', () => {
  it('provides default columns and cards', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    expect(result.current.columns.length).toBe(5);
    expect(result.current.cards.length).toBe(5);
  });

  it('can add a card', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    act(() => {
      result.current.addCard('col-1', 'New Card', 'Details');
    });
    expect(result.current.cards.length).toBe(6);
    expect(result.current.cards[result.current.cards.length - 1].title).toBe('New Card');
  });

  it('can delete a card', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    const cardIdToDelete = result.current.cards[0].id;
    act(() => {
      result.current.deleteCard(cardIdToDelete);
    });
    expect(result.current.cards.length).toBe(4);
    expect(result.current.cards.find(c => c.id === cardIdToDelete)).toBeUndefined();
  });

  it('can rename a column', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    act(() => {
      result.current.renameColumn('col-1', 'Renamed Column');
    });
    expect(result.current.columns.find(c => c.id === 'col-1')?.title).toBe('Renamed Column');
  });

  it('can move a card to another column', () => {
    const { result } = renderHook(() => useKanban(), { wrapper });
    const cardIdToMove = result.current.cards[0].id;
    act(() => {
      result.current.moveCard(cardIdToMove, 'col-2');
    });
    expect(result.current.cards.find(c => c.id === cardIdToMove)?.columnId).toBe('col-2');
  });
});
