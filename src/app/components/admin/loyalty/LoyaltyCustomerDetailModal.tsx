"use client";

import { useState } from "react";
import { XMarkIcon, ArrowPathIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { LoyaltyCustomer } from "@/app/data/types/loyalty";
import { RepositoryFactory } from "@/app/lib/api/repository-factory";
import RankBadge from "./RankBadge";

interface Props {
  customer: LoyaltyCustomer;
  onClose: () => void;
}

export default function LoyaltyCustomerDetailModal({ customer, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleBackfill = async () => {
    setLoading(true);
    setError("");
    setDone(false);
    try {
      await RepositoryFactory.loyalty.runCustomerBackfill(customer.customerId);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Backfill failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Loyalty Details</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{customer.customerName}</p>
              <p className="text-sm text-gray-500">{customer.email}</p>
            </div>
            <RankBadge rankName={customer.rankName} rankImageUrl={customer.rankImageUrl} size="md" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Lifetime Points</p>
              <p className="text-xl font-bold text-gray-900">{customer.lifetimePoints.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Total Orders</p>
              <p className="text-xl font-bold text-gray-900">{customer.totalOrders.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Rookie credit:</span>
            {customer.rookieCreditAwarded ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" /> Awarded
              </span>
            ) : (
              <span className="text-gray-400">Not yet awarded</span>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">
              Run a backfill to recalculate this customer&apos;s points from all historical activity.
            </p>

            {error && (
              <p className="text-sm text-red-600 mb-3">{error}</p>
            )}

            {done && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 mb-3">
                <CheckCircleIcon className="h-4 w-4" />
                Backfill completed successfully.
              </div>
            )}

            <button
              onClick={handleBackfill}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              {loading ? "Running Backfill…" : "Run Backfill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
