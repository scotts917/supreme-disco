export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export type NewJournalEntry = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;
