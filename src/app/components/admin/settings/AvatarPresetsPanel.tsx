"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { message } from "antd";
import { useAvatarPresets, useDeleteAvatarPreset } from "@/app/lib/hooks/api-hooks.ts/use-avatar-presets";
import { AvatarPresetDto } from "@/app/data/types/avatar-preset";
import { PermissionService } from "@/app/lib/auth/permissions";
import { Permission } from "@/app/data/types/permissions";
import AvatarPresetModal from "./AvatarPresetModal";

function DeleteConfirmModal({
  preset,
  isOpen,
  onClose,
}: {
  preset: AvatarPresetDto | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const deleteMutation = useDeleteAvatarPreset();

  const handleDelete = async () => {
    if (!preset) return;
    try {
      await deleteMutation.mutateAsync(preset.id);
      message.success("Avatar preset removed successfully.");
      onClose();
    } catch {
      message.error("Failed to remove avatar preset.");
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[70]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm bg-background-secondary rounded-lg shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  </div>
                  <Dialog.Title className="text-base font-semibold text-text-primary">
                    Remove Avatar Preset
                  </Dialog.Title>
                </div>
                <p className="text-sm text-text-secondary mb-5">
                  Are you sure you want to remove{" "}
                  <strong className="text-text-primary">{preset?.name}</strong>? Customers who
                  already selected this avatar will keep it, but it won&apos;t appear for new selections.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-border-default text-text-secondary rounded-lg text-sm hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? "Removing..." : "Remove"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function AvatarPresetsPanel() {
  const { data: presets, isLoading, isError } = useAvatarPresets();
  const canEdit = PermissionService.hasPermission(Permission.EDIT_SETTINGS);

  const [modalOpen, setModalOpen] = useState(false);
  const [deletingPreset, setDeletingPreset] = useState<AvatarPresetDto | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 bg-surface-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
        Failed to load avatar presets. Please refresh the page.
      </div>
    );
  }

  const sorted = [...(presets ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {sorted.length} preset{sorted.length !== 1 ? "s" : ""} available
        </p>
        {canEdit && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Preset
          </button>
        )}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="bg-surface-50 rounded-lg p-8 text-center">
          <p className="text-text-secondary text-sm">No avatar presets configured yet.</p>
        </div>
      ) : (
        <div className="border border-border-default rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-50 border-b border-border-default">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Avatar
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Display Order
                </th>
                {canEdit && (
                  <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default bg-background-secondary">
              {sorted.map((preset) => (
                <tr key={preset.id} className="hover:bg-surface-50 transition-colors">
                  <td className="px-4 py-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="h-10 w-10 rounded-full object-cover border border-border-default"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Ccircle cx='12' cy='12' r='12'/%3E%3C/svg%3E";
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-primary font-medium">
                    {preset.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary text-center">
                    {preset.displayOrder}
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeletingPreset(preset)}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AvatarPresetModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <DeleteConfirmModal
        preset={deletingPreset}
        isOpen={!!deletingPreset}
        onClose={() => setDeletingPreset(null)}
      />
    </div>
  );
}
