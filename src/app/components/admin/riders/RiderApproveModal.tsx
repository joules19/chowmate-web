"use client";

import { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';
import { RiderSummary } from '@/app/data/types/rider';
import { Zone } from '@/app/data/types/location';
import { useAvailableZones } from '@/app/lib/hooks/api-hooks.ts/use-vendor';

interface RiderApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { zoneIds: string[]; notes: string; notifyRider: boolean }) => void;
  rider: RiderSummary | null;
  isLoading?: boolean;
}

export default function RiderApproveModal({
  isOpen,
  onClose,
  onConfirm,
  rider,
  isLoading = false
}: RiderApproveModalProps) {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [notifyRider, setNotifyRider] = useState(true);

  const { data: availableZones, isLoading: zonesLoading } = useAvailableZones();

  if (!isOpen || !rider) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      zoneIds: selectedZones,
      notes: notes.trim() || `Approved by admin on ${new Date().toLocaleDateString()}`,
      notifyRider
    });
    handleClose();
  };

  const handleClose = () => {
    setSelectedZones([]);
    setNotes('');
    setNotifyRider(true);
    onClose();
  };

  const toggleZone = (zoneId: string) => {
    setSelectedZones(prev => 
      prev.includes(zoneId) 
        ? prev.filter(id => id !== zoneId)
        : [...prev, zoneId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h3 className="text-lg font-semibold text-text-primary">
            Approve Rider
          </h3>
          <button
            onClick={handleClose}
            className="text-text-tertiary hover:text-text-secondary transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-card p-4">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-sm text-green-800">
                Approving <span className="font-medium">{rider.fullName}</span> will allow them to start accepting delivery requests.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Assign Zones (Optional)
            </label>
            {zonesLoading ? (
              <div className="animate-pulse">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface-100 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-border-light rounded p-3">
                {availableZones?.map((zone: Zone) => (
                  <label key={zone.id} className="flex items-center space-x-3 p-2 rounded hover:bg-surface-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={zone.id ? selectedZones.includes(zone.id) : false}
                      onChange={() => zone.id && toggleZone(zone.id)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {zone.zoneName || 'Unnamed Zone'}
                      </p>
                      {zone.description && (
                        <p className="text-xs text-text-tertiary truncate">
                          {zone.description}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
            <p className="text-xs text-text-tertiary mt-2">
              Select zones where this rider can operate. You can modify this later.
            </p>
          </div>

          <div>
            <label htmlFor="approval-notes" className="block text-sm font-medium text-text-primary mb-2">
              Approval Notes (Optional)
            </label>
            <textarea
              id="approval-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border-default rounded-input focus:ring-primary-500 focus:border-primary-500 text-text-primary bg-surface-0"
              placeholder="Add any notes about the approval..."
            />
          </div>

          <div className="flex items-center">
            <input
              id="notify-rider"
              type="checkbox"
              checked={notifyRider}
              onChange={(e) => setNotifyRider(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
            />
            <label htmlFor="notify-rider" className="ml-2 block text-sm text-text-primary">
              Notify rider via email/SMS
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border-light">
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
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-button hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Approving...' : 'Approve Rider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}