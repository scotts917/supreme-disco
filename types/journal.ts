export interface Folder {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: number;
  updatedAt: number;
}

export type NewJournalEntry = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;
