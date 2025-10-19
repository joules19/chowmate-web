"use client";

import { useState } from "react";
import { UserPlusIcon, KeyIcon } from "@heroicons/react/24/outline";
import AddAdminForm from "../../components/admin/settings/AddAdminForm";

const tabs = [
  {
    id: "admin-management",
    name: "Admin Management",
    icon: UserPlusIcon,
  },
  {
    id: "system-settings",
    name: "System Settings", 
    icon: KeyIcon,
  },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("admin-management");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border-default pb-4">
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">
          Manage system settings and administrative functions.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border-default">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-default'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === "admin-management" && (
          <div className="space-y-6">
            <AddAdminForm />
          </div>
        )}

        {activeTab === "system-settings" && (
          <div className="bg-surface-50 rounded-card p-8 text-center">
            <KeyIcon className="h-12 w-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-lg font-medium text-text-primary mb-2">
              System Settings
            </h3>
            <p className="text-text-secondary">
              System configuration options will be available here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}