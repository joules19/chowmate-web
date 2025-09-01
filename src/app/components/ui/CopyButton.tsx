'use client';

import { useState } from 'react';
import { DocumentDuplicateIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Props {
  text: string;
  className?: string;
  iconClassName?: string;
}

export default function CopyButton({ text, className = '', iconClassName = 'h-3 w-3' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center text-gray-400 hover:text-gray-600 transition-colors ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <CheckIcon className={`text-green-500 ${iconClassName}`} />
      ) : (
        <DocumentDuplicateIcon className={iconClassName} />
      )}
    </button>
  );
}