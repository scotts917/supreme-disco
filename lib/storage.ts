import { JournalEntry, NewJournalEntry } from '@/types/journal';
import { DEFAULT_COLOR } from './colors';

const STORAGE_KEY = 'journal-entries';

export const storageUtils = {
  // Get all journal entries
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  // Get a single entry by ID
  getEntry: (id: string): JournalEntry | null => {
    const entries = storageUtils.getEntries();
    return entries.find(entry => entry.id === id) || null;
  },

  // Save all entries
  saveEntries: (entries: JournalEntry[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  // Create a new entry
  createEntry: (newEntry: NewJournalEntry): JournalEntry => {
    const entries = storageUtils.getEntries();
    const now = Date.now();

    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      ...newEntry,
      color: newEntry.color || DEFAULT_COLOR,
      createdAt: now,
      updatedAt: now,
    };

    entries.unshift(entry); // Add to beginning of array
    storageUtils.saveEntries(entries);

    return entry;
  },

  // Update an existing entry
  updateEntry: (id: string, updates: Partial<NewJournalEntry>): JournalEntry | null => {
    const entries = storageUtils.getEntries();
    const index = entries.findIndex(entry => entry.id === id);

    if (index === -1) return null;

    const updatedEntry: JournalEntry = {
      ...entries[index],
      ...updates,
      updatedAt: Date.now(),
    };

    entries[index] = updatedEntry;
    storageUtils.saveEntries(entries);

    return updatedEntry;
  },

  // Delete an entry
  deleteEntry: (id: string): boolean => {
    const entries = storageUtils.getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);

    if (filteredEntries.length === entries.length) return false;

    storageUtils.saveEntries(filteredEntries);
    return true;
  },
};
