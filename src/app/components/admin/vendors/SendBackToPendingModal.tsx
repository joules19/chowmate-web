"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SendBackToPendingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
  vendorName: string;
  isLoading?: boolean;
}

export default function SendBackToPendingModal({
  isOpen,
  onClose,
  onConfirm,
  vendorName,
  isLoading = false
}: SendBackToPendingModalProps) {
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onConfirm(message.trim());
      setMessage('');
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text-primary">
            Send Back to Pending
          </h3>
          <button
            onClick={handleClose}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <p className="text-sm text-text-secondary mb-4">
              Send <span className="font-medium text-text-primary">{vendorName}</span> back to pending status with instructions.
            </p>
            
            <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
              Message to Vendor
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-primary-500 focus:border-primary-500 text-text-primary bg-surface-0"
              placeholder="Please provide additional information or correct the following issues..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-border-default rounded-button text-text-primary hover:bg-surface-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="px-4 py-2 bg-orange-600 text-white rounded-button hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Back to Pending'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}