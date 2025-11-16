'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import { JournalEntry, Folder } from '@/types/journal';
import { storageUtils } from '@/lib/storage';

export default function Home() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [isClient, setIsClient] = useState(false);

  // Load entries and folders from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const loadedEntries = storageUtils.getEntries();
    const loadedFolders = storageUtils.getFolders();
    setEntries(loadedEntries);
    setFolders(loadedFolders);

    // Select the first entry if available
    if (loadedEntries.length > 0) {
      setSelectedEntryId(loadedEntries[0].id);
      setCurrentContent(loadedEntries[0].content);
      setCurrentTitle(loadedEntries[0].title);
    }
  }, []);

  // Save current entry when content changes
  useEffect(() => {
    if (!isClient || !selectedEntryId) return;

    const timeoutId = setTimeout(() => {
      const entry = entries.find(e => e.id === selectedEntryId);
      if (entry && (entry.content !== currentContent || entry.title !== currentTitle)) {
        storageUtils.updateEntry(selectedEntryId, {
          content: currentContent,
          title: currentTitle || 'Untitled',
        });

        // Update local state
        setEntries(prev =>
          prev.map(e =>
            e.id === selectedEntryId
              ? { ...e, content: currentContent, title: currentTitle || 'Untitled', updatedAt: Date.now() }
              : e
          )
        );
      }
    }, 500); // Debounce saves by 500ms

    return () => clearTimeout(timeoutId);
  }, [currentContent, currentTitle, selectedEntryId, isClient, entries]);

  const handleNewEntry = useCallback(() => {
    const newEntry = storageUtils.createEntry({
      title: 'Untitled',
      content: '',
      folderId: selectedFolderId,
    });

    setEntries(prev => [newEntry, ...prev]);
    setSelectedEntryId(newEntry.id);
    setCurrentContent('');
    setCurrentTitle('');
  }, [selectedFolderId]);

  const handleSelectFolder = useCallback((folderId: string | null) => {
    setSelectedFolderId(folderId);
    setSelectedEntryId(null);
    setCurrentContent('');
    setCurrentTitle('');
  }, []);

  const handleFoldersChange = useCallback(() => {
    const loadedFolders = storageUtils.getFolders();
    setFolders(loadedFolders);
  }, []);

  const handleSelectEntry = useCallback((id: string) => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setSelectedEntryId(id);
      setCurrentContent(entry.content);
      setCurrentTitle(entry.title);
    }
  }, [entries]);

  const handleDeleteEntry = useCallback((id: string) => {
    storageUtils.deleteEntry(id);
    setEntries(prev => prev.filter(e => e.id !== id));

    // If deleting the selected entry, select the next one
    if (selectedEntryId === id) {
      const remainingEntries = entries.filter(e => e.id !== id);
      if (remainingEntries.length > 0) {
        setSelectedEntryId(remainingEntries[0].id);
        setCurrentContent(remainingEntries[0].content);
        setCurrentTitle(remainingEntries[0].title);
      } else {
        setSelectedEntryId(null);
        setCurrentContent('');
        setCurrentTitle('');
      }
    }
  }, [selectedEntryId, entries]);

  const handleContentChange = useCallback((content: string) => {
    setCurrentContent(content);

    // Auto-generate title from first line if title is empty or "Untitled"
    if (!currentTitle || currentTitle === 'Untitled') {
      const firstLine = content.split('\n')[0].trim();
      if (firstLine) {
        // Remove markdown formatting from title
        const cleanTitle = firstLine.replace(/^#+\s*/, '').slice(0, 50);
        setCurrentTitle(cleanTitle || 'Untitled');
      }
    }
  }, [currentTitle]);

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  // Filter entries based on selected folder
  const filteredEntries = selectedFolderId === null
    ? entries.filter(e => e.folderId === null)
    : entries.filter(e => e.folderId === selectedFolderId);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        entries={filteredEntries}
        folders={folders}
        selectedEntryId={selectedEntryId}
        selectedFolderId={selectedFolderId}
        onSelectEntry={handleSelectEntry}
        onSelectFolder={handleSelectFolder}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
        onFoldersChange={handleFoldersChange}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-950">
        {selectedEntryId ? (
          <>
            {/* Title Input */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <input
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="Entry title..."
                className="w-full text-3xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
              />
            </div>

            {/* Markdown Editor */}
            <MarkdownEditor
              content={currentContent}
              onContentChange={handleContentChange}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-600">
            <div className="text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-lg">No entry selected</p>
              <p className="text-sm mt-2">Create a new entry or select one from the sidebar</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
