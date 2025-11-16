import { JournalEntry, NewJournalEntry, Folder } from '@/types/journal';

const ENTRIES_STORAGE_KEY = 'journal-entries';
const FOLDERS_STORAGE_KEY = 'journal-folders';

export const storageUtils = {
  // Get all journal entries
  getEntries: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(ENTRIES_STORAGE_KEY);
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
      localStorage.setItem(ENTRIES_STORAGE_KEY, JSON.stringify(entries));
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

  // Get all folders
  getFolders: (): Folder[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(FOLDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading folders from localStorage:', error);
      return [];
    }
  },

  // Get a single folder by ID
  getFolder: (id: string): Folder | null => {
    const folders = storageUtils.getFolders();
    return folders.find(folder => folder.id === id) || null;
  },

  // Save all folders
  saveFolders: (folders: Folder[]): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    } catch (error) {
      console.error('Error writing folders to localStorage:', error);
    }
  },

  // Create a new folder
  createFolder: (name: string): Folder => {
    const folders = storageUtils.getFolders();
    const now = Date.now();

    const folder: Folder = {
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
    };

    folders.push(folder);
    storageUtils.saveFolders(folders);

    return folder;
  },

  // Rename a folder
  renameFolder: (id: string, newName: string): Folder | null => {
    const folders = storageUtils.getFolders();
    const index = folders.findIndex(folder => folder.id === id);

    if (index === -1) return null;

    const updatedFolder: Folder = {
      ...folders[index],
      name: newName,
      updatedAt: Date.now(),
    };

    folders[index] = updatedFolder;
    storageUtils.saveFolders(folders);

    return updatedFolder;
  },

  // Delete a folder (moves entries in it to root)
  deleteFolder: (id: string): boolean => {
    const folders = storageUtils.getFolders();
    const filteredFolders = folders.filter(folder => folder.id !== id);

    if (filteredFolders.length === folders.length) return false;

    // Move all entries in this folder to root (folderId = null)
    const entries = storageUtils.getEntries();
    const updatedEntries = entries.map(entry =>
      entry.folderId === id ? { ...entry, folderId: null } : entry
    );

    storageUtils.saveFolders(filteredFolders);
    storageUtils.saveEntries(updatedEntries);

    return true;
  },

  // Get entries by folder
  getEntriesByFolder: (folderId: string | null): JournalEntry[] => {
    const entries = storageUtils.getEntries();
    return entries.filter(entry => entry.folderId === folderId);
  },

  // Move entry to folder
  moveEntryToFolder: (entryId: string, folderId: string | null): JournalEntry | null => {
    return storageUtils.updateEntry(entryId, { folderId });
  },
};
