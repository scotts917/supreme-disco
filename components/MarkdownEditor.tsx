'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import ShareButtons from './ShareButtons';

interface MarkdownEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  title?: string;
  placeholder?: string;
}

export default function MarkdownEditor({
  content,
  onContentChange,
  title = 'Untitled',
  placeholder = 'Start writing your journal entry...',
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !isPreview
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              isPreview
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            Preview
          </button>
        </div>
        <div className="flex items-center gap-4">
          <ShareButtons title={title} content={content} />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {content.length} characters
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-auto">
        {!isPreview ? (
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full px-6 py-4 resize-none markdown-editor bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600"
            spellCheck="false"
          />
        ) : (
          <div className="px-6 py-4 markdown-preview prose dark:prose-invert max-w-none">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <p className="text-gray-400 dark:text-gray-600 italic">
                Nothing to preview yet. Start writing to see the preview.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
