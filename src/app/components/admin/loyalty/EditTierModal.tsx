"use client";

import { useState } from "react";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { LoyaltyRank, RewardTier, UpdateTierRequest } from "@/app/data/types/loyalty";
import { RepositoryFactory } from "@/app/lib/api/repository-factory";

interface Props {
  rank: LoyaltyRank;
  tier: RewardTier;
  onClose: () => void;
  onSaved: (updated: RewardTier) => void;
}

export default function EditTierModal({ rank, tier, onClose, onSaved }: Props) {
  const [ordersNeeded, setOrdersNeeded] = useState(tier.monthlyOrdersNeeded);
  const [creditsAwarded, setCreditsAwarded] = useState(tier.creditsAwarded);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");

  const otherTiers = rank.rewardTiers.filter((t) => t.id !== tier.id);
  const projectedSum = otherTiers.reduce((sum, t) => sum + t.creditsAwarded, 0) + creditsAwarded;
  const exceedsCap = projectedSum > rank.monthlyMaxFreeDeliveries;

  const validate = (): string => {
    if (ordersNeeded < 1) return "Monthly orders needed must be ≥ 1.";
    if (creditsAwarded < 1) return "Credits awarded must be ≥ 1.";
    const duplicate = otherTiers.find((t) => t.monthlyOrdersNeeded === ordersNeeded);
    if (duplicate) {
      return `Another tier in ${rank.name} already requires ${ordersNeeded} orders this month.`;
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

    const payload: UpdateTierRequest = {
      monthlyOrdersNeeded: ordersNeeded,
      creditsAwarded,
    };

    try {
      const updated = await RepositoryFactory.loyalty.updateTier(rank.id, tier.id, payload);
      onSaved(updated);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to save tier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Edit {rank.name} Tier</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Orders Needed
            </label>
            <input
              type="number"
              min={1}
              value={ordersNeeded}
              onChange={(e) => setOrdersNeeded(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Credits Awarded
            </label>
            <input
              type="number"
              min={1}
              value={creditsAwarded}
              onChange={(e) => setCreditsAwarded(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {exceedsCap && !validationError && (
            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <ExclamationTriangleIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Total tier credits ({projectedSum}) exceed {rank.name}&apos;s monthly cap of{" "}
                {rank.monthlyMaxFreeDeliveries}. The job will cap credits at the rank limit.
              </span>
            </div>
          )}

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
