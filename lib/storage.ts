import { JournalEntry, NewJournalEntry } from '@/types/journal';

const STORAGE_KEY = 'journal-entries';

// Security: Input validation limits
const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 1000000; // 1MB of text (~1 million characters)
const MAX_ENTRIES = 10000;
const STORAGE_QUOTA_WARNING_THRESHOLD = 4 * 1024 * 1024; // 4MB (localStorage is typically 5-10MB)

export const storageUtils = {
  // Get all journal entries
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);

      // Security: Validate data structure
      if (!Array.isArray(parsed)) {
        console.warn('Invalid data structure in localStorage, resetting');
        return [];
      }

      // Security: Validate each entry has required fields with correct types
      const validEntries = parsed.filter((entry: any) => {
        return (
          entry &&
          typeof entry.id === 'string' &&
          typeof entry.title === 'string' &&
          typeof entry.content === 'string' &&
          typeof entry.createdAt === 'number' &&
          typeof entry.updatedAt === 'number'
        );
      });

      // Log if we had to filter out invalid entries
      if (validEntries.length !== parsed.length) {
        console.warn(`Filtered out ${parsed.length - validEntries.length} invalid entries`);
      }

      return validEntries;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error reading from localStorage:', error);
      }
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
      const serialized = JSON.stringify(entries);

      // Security: Check storage quota before saving
      if (serialized.length > STORAGE_QUOTA_WARNING_THRESHOLD) {
        console.warn('Storage quota warning: Approaching localStorage limit');
      }

      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error('Storage quota exceeded. Please delete some entries to free up space.');
      }

      if (process.env.NODE_ENV === 'development') {
        console.error('Error writing to localStorage:', error);
      }
      throw new Error('Failed to save data');
    }
  },

  // Create a new entry
  createEntry: (newEntry: NewJournalEntry): JournalEntry => {
    const entries = storageUtils.getEntries();

    // Security: Validate entry count limit
    if (entries.length >= MAX_ENTRIES) {
      throw new Error(`Maximum number of entries (${MAX_ENTRIES}) reached`);
    }

    // Security: Sanitize and validate input
    const sanitizedTitle = String(newEntry.title || 'Untitled')
      .slice(0, MAX_TITLE_LENGTH)
      .trim();

    const sanitizedContent = String(newEntry.content || '')
      .slice(0, MAX_CONTENT_LENGTH);

    const now = Date.now();

    const entry: JournalEntry = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: sanitizedTitle || 'Untitled',
      content: sanitizedContent,
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

    // Security: Sanitize and validate updates
    const sanitizedUpdates: Partial<NewJournalEntry> = {};

    if (updates.title !== undefined) {
      sanitizedUpdates.title = String(updates.title)
        .slice(0, MAX_TITLE_LENGTH)
        .trim() || 'Untitled';
    }

    if (updates.content !== undefined) {
      sanitizedUpdates.content = String(updates.content)
        .slice(0, MAX_CONTENT_LENGTH);
    }

    const updatedEntry: JournalEntry = {
      ...entries[index],
      ...sanitizedUpdates,
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
