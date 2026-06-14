"use client";

import { useState, useEffect, useCallback } from "react";
import { MagnifyingGlassIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { LoyaltyCustomer, LoyaltyCustomerFilters, LoyaltyCustomerListResponse, RANK_NAMES } from "@/app/data/types/loyalty";
import { RepositoryFactory } from "@/app/lib/api/repository-factory";
import DataTable, { Column } from "../shared/DataTable";
import RankBadge from "./RankBadge";
import LoyaltyCustomerDetailModal from "./LoyaltyCustomerDetailModal";

export default function LoyaltyCustomerTable() {
  const [data, setData] = useState<LoyaltyCustomerListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState<LoyaltyCustomerFilters>({ pageNumber: 1, pageSize: 20 });
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null);

  const fetchCustomers = useCallback(async (f: LoyaltyCustomerFilters) => {
    setLoading(true);
    setError("");
    try {
      const res = await RepositoryFactory.loyalty.getCustomers(f);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(filters);
  }, [filters, fetchCustomers]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilters(prev => ({ ...prev, search: value || undefined, pageNumber: 1 }));
  };

  const handleRankFilter = (rankName: string) => {
    setFilters(prev => ({ ...prev, rankName: rankName || undefined, pageNumber: 1 }));
  };

  const columns: Column<LoyaltyCustomer & Record<string, unknown>>[] = [
    {
      key: "customerName",
      label: "Customer",
      render: (item) => (
        <div>
          <p className="font-medium text-gray-900">{item.customerName}</p>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: "rankName",
      label: "Rank",
      render: (item) => (
        <RankBadge rankName={item.rankName} rankImageUrl={item.rankImageUrl} />
      ),
    },
    {
      key: "lifetimePoints",
      label: "Lifetime Points",
      render: (item) => (
        <span className="font-semibold text-gray-900">{item.lifetimePoints.toLocaleString()}</span>
      ),
    },
    {
      key: "totalOrders",
      label: "Orders",
      render: (item) => <span>{item.totalOrders.toLocaleString()}</span>,
    },
    {
      key: "rookieCreditAwarded",
      label: "Rookie Credit",
      render: (item) =>
        item.rookieCreditAwarded ? (
          <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-medium">
            <CheckCircleIcon className="h-4 w-4" /> Awarded
          </span>
        ) : (
          <span className="text-gray-400 text-xs">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <select
          onChange={(e) => handleRankFilter(e.target.value)}
          defaultValue=""
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">All ranks</option>
          {RANK_NAMES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <DataTable
        data={(data?.items ?? []) as (LoyaltyCustomer & Record<string, unknown>)[]}
        columns={columns}
        loading={loading}
        pagination={
          data
            ? {
                pageNumber: data.pageNumber,
                pageSize: data.pageSize,
                totalCount: data.totalCount,
                totalPages: data.totalPages,
              }
            : undefined
        }
        onPageChange={(page) => setFilters((prev) => ({ ...prev, pageNumber: page }))}
        onPageSizeChange={(size) => setFilters((prev) => ({ ...prev, pageSize: size, pageNumber: 1 }))}
        onRowClick={(item) => setSelectedCustomer(item as LoyaltyCustomer)}
      />

      {selectedCustomer && (
        <LoyaltyCustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
