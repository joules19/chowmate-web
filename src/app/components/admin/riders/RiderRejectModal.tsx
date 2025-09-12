"use client";

import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { RiderSummary } from '@/app/data/types/rider';

interface RiderRejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { reason: string; notifyRider: boolean }) => void;
  rider: RiderSummary | null;
  isLoading?: boolean;
}

export default function RiderRejectModal({
  isOpen,
  onClose,
  onConfirm,
  rider,
  isLoading = false
}: RiderRejectModalProps) {
  const [reason, setReason] = useState('');
  const [notifyRider, setNotifyRider] = useState(true);

  if (!isOpen || !rider) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm({
        reason: reason.trim(),
        notifyRider
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setReason('');
    setNotifyRider(true);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text-primary">
            Reject Rider
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
              Rejecting <span className="font-medium text-text-primary">{rider.fullName}</span> will prevent them from accessing the delivery platform.
            </p>
            
            <label htmlFor="reject-reason" className="block text-sm font-medium text-text-primary mb-2">
              Reason for Rejection <span className="text-red-500">*</span>
            </label>
            <textarea
              id="reject-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-primary-500 focus:border-primary-500 text-text-primary bg-surface-0"
              placeholder="Please provide a reason for rejecting this rider application..."
              required
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center">
              <input
                id="notify-rider-reject"
                type="checkbox"
                checked={notifyRider}
                onChange={(e) => setNotifyRider(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
              />
              <label htmlFor="notify-rider-reject" className="ml-2 block text-sm text-text-primary">
                Notify rider via email/SMS
              </label>
            </div>
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
              disabled={!reason.trim() || isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-button hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Rejecting...' : 'Reject Rider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}