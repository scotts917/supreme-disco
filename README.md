# Journal App

A beautiful, clean, and simple markdown-based journaling application built with Next.js, TypeScript, and Tailwind CSS v3.

## Features

- **Markdown Editor**: Write your journal entries using markdown with a live preview
- **Local Storage**: All entries are saved locally in your browser
- **Clean UI**: Beautiful, minimalist interface with dark mode support
- **Auto-save**: Changes are automatically saved as you type
- **Auto-title**: Titles are automatically generated from the first line of content
- **Date Formatting**: Smart date display (Today, Yesterday, or formatted date)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v3** - Utility-first CSS framework
- **React Markdown** - Markdown rendering
- **Local Storage** - Client-side data persistence

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles and Tailwind imports
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/
│   ├── MarkdownEditor.tsx # Markdown editor with preview
│   └── Sidebar.tsx        # Journal entries list sidebar
├── lib/
│   └── storage.ts         # Local storage utility functions
└── types/
    └── journal.ts         # TypeScript type definitions
```

## Usage

1. **Create an Entry**: Click the "New Entry" button in the sidebar
2. **Edit**: Type your journal entry using markdown syntax
3. **Preview**: Click "Preview" to see the rendered markdown
4. **Auto-save**: Your changes are automatically saved after 500ms
5. **Delete**: Hover over an entry in the sidebar and click the delete icon

## Markdown Support

The editor supports standard markdown syntax including:
- Headers (`#`, `##`, `###`)
- **Bold** and *italic* text
- Lists (ordered and unordered)
- Code blocks
- Blockquotes
- And more!

## Note

This app uses browser's local storage. Your journal entries are stored only on your device and are not synced to any server.
