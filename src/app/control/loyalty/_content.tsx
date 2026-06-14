"use client";

import { useState } from "react";
import PermissionGuard from "@/app/components/admin/guards/PermissionGuard";
import LoyaltyCustomerTable from "@/app/components/admin/loyalty/LoyaltyCustomerTable";
import RankConfigTable from "@/app/components/admin/loyalty/RankConfigTable";
import LoyaltyAdminTools from "@/app/components/admin/loyalty/LoyaltyAdminTools";
import { Permission } from "@/app/data/types/permissions";

const TABS = [
  { id: "customers", label: "Customers" },
  { id: "ranks", label: "Rank Config" },
  { id: "tools", label: "Admin Tools" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState<TabId>("customers");

  return (
    <PermissionGuard permission={Permission.VIEW_LOYALTY}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Loyalty Program
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage customer ranks, reward tiers, and loyalty operations.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        {activeTab === "customers" && <LoyaltyCustomerTable />}
        {activeTab === "ranks" && <RankConfigTable />}
        {activeTab === "tools" && <LoyaltyAdminTools />}
      </div>
    </PermissionGuard>
  );
}
