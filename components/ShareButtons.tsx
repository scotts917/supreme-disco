'use client';

import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  content: string;
}

export default function ShareButtons({ title, content }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Generate a preview of the content (first 100 characters)
  const preview = content.slice(0, 100).replace(/\n/g, ' ').trim();
  const shareText = `${title}${preview ? ': ' + preview : ''}`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(twitterUrl, 'twitter-share', 'width=550,height=420');
  };

  const handleShareLinkedIn = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(linkedInUrl, 'linkedin-share', 'width=550,height=420');
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      currentUrl
    )}`;
    window.open(facebookUrl, 'facebook-share', 'width=550,height=420');
  };

  const handleShareEmail = () => {
    const subject = `Check out my journal entry: ${title}`;
    const body = `${shareText}\n\n${currentUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n\n${currentUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleShareTwitter}
        title="Share on Twitter"
        className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Share on Twitter"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 002.856-3.515v.34a10 10 0 01-2.857-3.515v-.34c0-.355.029-.71.085-1.05a4.934 4.934 0 01.885-1.9C24.758.545 24 0 24 0s-4.76.7-7.905 2.157c-.565.289-1.1.623-1.606.996a10 10 0 01-4.482 1.087c-.553 0-1.1-.04-1.646-.124A10 10 0 007.858 2.25a10 10 0 00-4.482 1.087c-.505.373-1.04.707-1.606.996C.35 6.045.05 6 0 7.5v.34c0 .355.029.71.085 1.05a4.934 4.934 0 01.885 1.9v.34c-.265.335-.535.67-.8 1-.265-.33-.535-.665-.8-1v-.34a4.934 4.934 0 01.885-1.9 10 10 0 01.085-1.05C.3 7.21.058 6.855.058 6.5v-.34A10 10 0 019 3.25a10 10 0 014.482-1.087c.553 0 1.1.04 1.646.124A10 10 0 0122 1.8a10 10 0 012 2.7v.34a10 10 0 01-2.857 3.515v.34A10 10 0 0124 13.7v-.34a10 10 0 01-.047-1.087 10 10 0 01.047-1.087v-.34a10 10 0 01-2.856-3.515v-.34z" />
        </svg>
      </button>

      <button
        onClick={handleShareLinkedIn}
        title="Share on LinkedIn"
        className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.437-.103.249-.129.597-.129.945v5.423h-3.554s.047-8.81 0-9.728h3.554v1.375c.428-.659 1.191-1.596 2.897-1.596 2.117 0 3.704 1.385 3.704 4.362v5.587zM5.337 8.855c-1.144 0-1.915-.758-1.915-1.708 0-.966.77-1.71 1.952-1.71s1.927.744 1.96 1.71c0 .95-.769 1.708-1.997 1.708zm1.6 11.597H3.738V9.724h3.199v10.728zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      </button>

      <button
        onClick={handleShareFacebook}
        title="Share on Facebook"
        className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Share on Facebook"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </button>

      <button
        onClick={handleShareEmail}
        title="Share via Email"
        className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        aria-label="Share via Email"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </button>

      <button
        onClick={handleCopyToClipboard}
        title={copied ? 'Copied!' : 'Copy to Clipboard'}
        className={`p-2 rounded-md transition-colors ${
          copied
            ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
