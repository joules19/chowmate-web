"use client";

import { useState, useEffect } from "react";
import { PencilSquareIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { LoyaltyRank, RewardTier } from "@/app/data/types/loyalty";
import { RepositoryFactory } from "@/app/lib/api/repository-factory";
import RankBadge from "./RankBadge";
import EditRankModal from "./EditRankModal";
import EditTierModal from "./EditTierModal";

export default function RankConfigTable() {
  const [ranks, setRanks] = useState<LoyaltyRank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingRank, setEditingRank] = useState<LoyaltyRank | null>(null);
  const [editingTier, setEditingTier] = useState<{ rank: LoyaltyRank; tier: RewardTier } | null>(null);

  const fetchRanks = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await RepositoryFactory.loyalty.getRanks();
      setRanks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ranks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
  }, []);

  const handleRankSaved = (updated: LoyaltyRank) => {
    setRanks((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleTierSaved = (rankId: string, updated: RewardTier) => {
    setRanks((prev) =>
      prev.map((r) =>
        r.id === rankId
          ? { ...r, rewardTiers: r.rewardTiers.map((t) => (t.id === updated.id ? updated : t)) }
          : r
      )
    );
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 flex items-center justify-between">
        <span>{error}</span>
        <button onClick={fetchRanks} className="flex items-center gap-1 text-red-600 hover:text-red-800 ml-4">
          <ArrowPathIcon className="h-4 w-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Points</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Max Credits</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward Tiers</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ranks.map((rank) => (
              <tr key={rank.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <RankBadge rankName={rank.name} rankImageUrl={rank.rankImageUrl} size="md" />
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                  {rank.minLifetimePoints.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {rank.monthlyMaxFreeDeliveries}
                </td>
                <td className="px-6 py-4">
                  {rank.isRookieSpecial ? (
                    <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                      3rd order → 1 credit (one-time)
                    </span>
                  ) : rank.rewardTiers.length === 0 ? (
                    <span className="text-gray-400 text-xs">No tiers</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {rank.rewardTiers
                        .slice()
                        .sort((a, b) => a.monthlyOrdersNeeded - b.monthlyOrdersNeeded)
                        .map((tier) => (
                          <button
                            key={tier.id}
                            onClick={() => setEditingTier({ rank, tier })}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200 transition-colors"
                          >
                            {tier.monthlyOrdersNeeded} orders → {tier.creditsAwarded} credit
                            <PencilSquareIcon className="h-3 w-3" />
                          </button>
                        ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => setEditingRank(rank)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <PencilSquareIcon className="h-3.5 w-3.5" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingRank && (
        <EditRankModal
          rank={editingRank}
          allRanks={ranks}
          onClose={() => setEditingRank(null)}
          onSaved={handleRankSaved}
        />
      )}

      {editingTier && (
        <EditTierModal
          rank={editingTier.rank}
          tier={editingTier.tier}
          onClose={() => setEditingTier(null)}
          onSaved={(updated) => {
            handleTierSaved(editingTier.rank.id, updated);
          }}
        />
      )}
    </>
  );
}
