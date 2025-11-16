'use client';

import React, { useState } from 'react';
import { Folder } from '@/types/journal';
import { storageUtils } from '@/lib/storage';
import { ChevronRight, ChevronDown, FolderIcon, Plus, Trash2 } from 'lucide-react';

interface FolderNavProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onFoldersChange: () => void;
}

export default function FolderNav({
  folders,
  selectedFolderId,
  onSelectFolder,
  onFoldersChange,
}: FolderNavProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renamingValue, setRenamingValue] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleRenameFolder = (folderId: string, currentName: string) => {
    setRenamingId(folderId);
    setRenamingValue(currentName);
  };

  const saveRename = (folderId: string) => {
    if (renamingValue.trim()) {
      storageUtils.renameFolder(folderId, renamingValue.trim());
      onFoldersChange();
    }
    setRenamingId(null);
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('Delete this folder? Entries in it will be moved to the root.')) {
      storageUtils.deleteFolder(folderId);
      if (selectedFolderId === folderId) {
        onSelectFolder(null);
      }
      onFoldersChange();
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      storageUtils.createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
      onFoldersChange();
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-2 py-2">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Folders
        </h3>
        <button
          onClick={() => setShowNewFolderInput(true)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
          title="New folder"
        >
          <Plus size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {showNewFolderInput && (
        <div className="px-2 py-1 mb-2">
          <input
            autoFocus
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateFolder();
              if (e.key === 'Escape') {
                setShowNewFolderInput(false);
                setNewFolderName('');
              }
            }}
            placeholder="Folder name..."
            className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded outline-none"
          />
        </div>
      )}

      {/* Root folder */}
      <button
        onClick={() => onSelectFolder(null)}
        className={`w-full text-left px-2 py-1 text-sm rounded transition-colors flex items-center gap-2 ${
          selectedFolderId === null
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
      >
        <FolderIcon size={16} />
        All Entries
      </button>

      {/* Folders list */}
      {folders.map((folder) => (
        <div key={folder.id}>
          <div className="flex items-center gap-1 group">
            <button
              onClick={() => toggleFolder(folder.id)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {expandedFolders.has(folder.id) ? (
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-500 dark:text-gray-400" />
              )}
            </button>

            {renamingId === folder.id ? (
              <input
                autoFocus
                type="text"
                value={renamingValue}
                onChange={(e) => setRenamingValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveRename(folder.id);
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                onBlur={() => saveRename(folder.id)}
                className="flex-1 px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded outline-none"
              />
            ) : (
              <button
                onClick={() => onSelectFolder(folder.id)}
                onDoubleClick={() => handleRenameFolder(folder.id, folder.name)}
                className={`flex-1 text-left px-2 py-1 text-sm rounded transition-colors flex items-center gap-2 ${
                  selectedFolderId === folder.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <FolderIcon size={16} />
                <span className="truncate">{folder.name}</span>
              </button>
            )}

            <button
              onClick={() => handleDeleteFolder(folder.id)}
              className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-all"
              title="Delete folder"
            >
              <Trash2 size={14} className="text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      ))}

      {folders.length === 0 && !showNewFolderInput && (
        <p className="px-2 py-2 text-xs text-gray-500 dark:text-gray-400">
          No folders yet. Create one!
        </p>
      )}
    </div>
  );
}
