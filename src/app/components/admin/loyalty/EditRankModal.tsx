"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { LoyaltyRank, UpdateRankRequest } from "@/app/data/types/loyalty";
import { RepositoryFactory } from "@/app/lib/api/repository-factory";

interface Props {
  rank: LoyaltyRank;
  allRanks: LoyaltyRank[];
  onClose: () => void;
  onSaved: (updated: LoyaltyRank) => void;
}

export default function EditRankModal({ rank, allRanks, onClose, onSaved }: Props) {
  const [minPoints, setMinPoints] = useState(rank.minLifetimePoints);
  const [maxDeliveries, setMaxDeliveries] = useState(rank.monthlyMaxFreeDeliveries);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");

  const validate = (): string => {
    if (minPoints < 0) return "Min lifetime points must be ≥ 0.";
    if (maxDeliveries < 0) return "Monthly max free deliveries must be ≥ 0.";

    const sorted = [...allRanks].sort((a, b) => a.displayOrder - b.displayOrder);
    for (let i = 0; i < sorted.length; i++) {
      const r = sorted[i];
      const pts = r.id === rank.id ? minPoints : r.minLifetimePoints;

      const prev = sorted[i - 1];
      if (prev) {
        const prevPts = prev.id === rank.id ? minPoints : prev.minLifetimePoints;
        if (pts <= prevPts) {
          return `${r.name} threshold must be greater than ${prev.name} (${prevPts} pts).`;
        }
      }
    }
    return "";
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError("");
    setApiError("");
    setLoading(true);

    const payload: UpdateRankRequest = {
      minLifetimePoints: minPoints,
      monthlyMaxFreeDeliveries: maxDeliveries,
    };

    try {
      const updated = await RepositoryFactory.loyalty.updateRank(rank.id, payload);
      onSaved(updated);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit {rank.name} Rank</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Lifetime Points
            </label>
            <input
              type="number"
              min={0}
              value={minPoints}
              onChange={(e) => setMinPoints(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Points a customer must accumulate to enter this rank.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Max Free Deliveries
            </label>
            <input
              type="number"
              min={0}
              value={maxDeliveries}
              onChange={(e) => setMaxDeliveries(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hard cap on free delivery credits per month regardless of tiers hit.
            </p>
          </div>

          {validationError && (
            <p className="text-sm text-red-600">{validationError}</p>
          )}
          {apiError && (
            <p className="text-sm text-red-600">{apiError}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
