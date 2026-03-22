'use client';

import { KanbanProvider } from '@/context/KanbanContext';
import { KanbanBoard } from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main>
      <KanbanProvider>
        <KanbanBoard />
      </KanbanProvider>
    </main>
  );
}
