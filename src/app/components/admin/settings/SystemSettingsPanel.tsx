"use client";

import { useState } from "react";
import { PencilIcon, CheckIcon, XMarkIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { message } from "antd";
import { useSystemSettings, useUpdateSetting } from "@/app/lib/hooks/api-hooks.ts/use-settings";
import { SystemSettingDto } from "@/app/data/types/settings";
import { PermissionService } from "@/app/lib/auth/permissions";
import { Permission } from "@/app/data/types/permissions";

function groupByCategory(settings: SystemSettingDto[]): Record<string, SystemSettingDto[]> {
  return settings.reduce<Record<string, SystemSettingDto[]>>((acc, setting) => {
    const cat = setting.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {});
}

interface EditingState {
  key: string;
  value: string;
}

export default function SystemSettingsPanel() {
  const { data: settings, isLoading, isError } = useSystemSettings();
  const updateMutation = useUpdateSetting();
  const [editing, setEditing] = useState<EditingState | null>(null);
  const canEdit = PermissionService.hasPermission(Permission.EDIT_SETTINGS);

  const startEdit = (setting: SystemSettingDto) => {
    setEditing({ key: setting.key, value: setting.value });
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ key: editing.key, request: { value: editing.value } });
      message.success("Setting updated successfully.");
      setEditing(null);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "Failed to update setting.";
      message.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-surface-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
        Failed to load system settings. Please refresh the page.
      </div>
    );
  }

  const grouped = groupByCategory(settings);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="border border-border-default rounded-lg overflow-hidden divide-y divide-border-default">
            {items.map((setting) => {
              const isEditingThis = editing?.key === setting.key;
              return (
                <div
                  key={setting.key}
                  className="flex items-center justify-between px-4 py-3 bg-background-secondary hover:bg-surface-50 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary">{setting.key}</span>
                      {setting.isReadOnly && (
                        <span className="inline-flex items-center gap-1 text-xs text-text-tertiary">
                          <LockClosedIcon className="h-3 w-3" />
                          Read-only
                        </span>
                      )}
                    </div>
                    {setting.description && (
                      <p className="text-xs text-text-secondary mt-0.5">{setting.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isEditingThis ? (
                      <>
                        <input
                          type="text"
                          value={editing.value}
                          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                          className="border border-border-default rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary w-44 transition-colors"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit();
                            if (e.key === "Escape") cancelEdit();
                          }}
                        />
                        <button
                          onClick={saveEdit}
                          disabled={updateMutation.isPending}
                          className="p-1.5 rounded-lg text-success-600 hover:bg-success-50 transition-colors disabled:opacity-50"
                          title="Save"
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-1.5 rounded-lg text-text-secondary hover:bg-surface-100 transition-colors"
                          title="Cancel"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-mono text-text-primary bg-surface-100 px-2.5 py-1 rounded">
                          {setting.value}
                        </span>
                        {canEdit && !setting.isReadOnly && (
                          <button
                            onClick={() => startEdit(setting)}
                            className="p-1.5 rounded-lg text-text-tertiary hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
