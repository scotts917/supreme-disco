'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({
  content,
  onContentChange,
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
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {content.length} characters
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
              <ReactMarkdown
                components={{
                  // Disable potentially dangerous elements
                  script: () => null,
                  iframe: () => null,
                  object: () => null,
                  embed: () => null,
                  // Override link component to open in new tab and sanitize URLs
                  a: ({ node, href, children, ...props }) => {
                    // Sanitize link URIs to prevent XSS attacks via javascript:, data:, vbscript: protocols
                    const allowedProtocols = ['http:', 'https:', 'mailto:'];
                    let sanitizedHref = '#';

                    if (href) {
                      try {
                        // Handle relative URLs and anchors
                        if (href.startsWith('/') || href.startsWith('#')) {
                          sanitizedHref = href;
                        } else {
                          // Parse and validate absolute URLs
                          const url = new URL(href, window.location.href);

                          if (allowedProtocols.includes(url.protocol)) {
                            sanitizedHref = href;
                          } else {
                            // Block dangerous protocols
                            console.warn(`Blocked potentially dangerous link protocol: ${url.protocol}`);
                          }
                        }
                      } catch (error) {
                        // If URL parsing fails, it might be malformed - block it
                        console.warn('Blocked malformed URL:', href);
                      }
                    }

                    return (
                      <a
                        href={sanitizedHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
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
