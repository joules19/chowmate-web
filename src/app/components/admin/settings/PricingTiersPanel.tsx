"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { message } from "antd";
import { usePricingTiers, useDeletePricingTier } from "@/app/lib/hooks/api-hooks.ts/use-settings";
import { DeliveryPricingTierDto } from "@/app/data/types/settings";
import { PermissionService } from "@/app/lib/auth/permissions";
import { Permission } from "@/app/data/types/permissions";
import PricingTierModal from "./PricingTierModal";

function DeleteConfirmModal({
  tier,
  isOpen,
  onClose,
}: {
  tier: DeliveryPricingTierDto | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const deleteMutation = useDeletePricingTier();

  const handleDelete = async () => {
    if (!tier) return;
    try {
      await deleteMutation.mutateAsync(tier.id);
      message.success("Pricing tier deleted successfully.");
      onClose();
    } catch {
      message.error("Failed to delete pricing tier.");
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
                    Delete Pricing Tier
                  </Dialog.Title>
                </div>
                <p className="text-sm text-text-secondary mb-5">
                  Are you sure you want to delete the tier{" "}
                  <strong className="text-text-primary">
                    {tier
                      ? `${tier.minKm}–${tier.maxKm} km`
                      : ""}
                  </strong>
                  {tier && !tier.isGlobal && tier.zoneName
                    ? ` for ${tier.zoneName}`
                    : " (Global)"}
                  ? This action cannot be undone.
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
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
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

export default function PricingTiersPanel() {
  const { data: tiers, isLoading, isError } = usePricingTiers();
  const canEdit = PermissionService.hasPermission(Permission.EDIT_SETTINGS);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<DeliveryPricingTierDto | null>(null);
  const [deletingTier, setDeletingTier] = useState<DeliveryPricingTierDto | null>(null);

  const openCreate = () => {
    setEditingTier(null);
    setModalOpen(true);
  };

  const openEdit = (tier: DeliveryPricingTierDto) => {
    setEditingTier(tier);
    setModalOpen(true);
  };

  const openDelete = (tier: DeliveryPricingTierDto) => {
    setDeletingTier(tier);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-surface-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
        Failed to load pricing tiers. Please refresh the page.
      </div>
    );
  }

  const globalTiers = tiers?.filter((t) => t.isGlobal) ?? [];
  const zoneTiers = tiers?.filter((t) => !t.isGlobal) ?? [];

  const renderTierRow = (tier: DeliveryPricingTierDto) => (
    <tr key={tier.id} className="hover:bg-surface-50 transition-colors">
      <td className="px-4 py-3 text-sm text-text-primary">
        {tier.isGlobal ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700">
            Global
          </span>
        ) : (
          <span className="text-text-primary">{tier.zoneName}</span>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-text-primary">
        {tier.minKm} – {tier.maxKm} km
      </td>
      <td className="px-4 py-3 text-sm text-text-primary font-medium">
        ₦{tier.fee.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className="px-4 py-3 text-sm text-text-secondary text-center">{tier.sortOrder}</td>
      <td className="px-4 py-3 text-sm">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            tier.isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {tier.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      {canEdit && (
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEdit(tier)}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Edit"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => openDelete(tier)}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {tiers?.length ?? 0} tier{tiers?.length !== 1 ? "s" : ""} configured
        </p>
        {canEdit && (
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Add Tier
          </button>
        )}
      </div>

      {/* Table */}
      {(!tiers || tiers.length === 0) ? (
        <div className="bg-surface-50 rounded-lg p-8 text-center">
          <p className="text-text-secondary text-sm">No pricing tiers configured yet.</p>
        </div>
      ) : (
        <div className="border border-border-default rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-surface-50 border-b border-border-default">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Zone
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Distance Range
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider text-center">
                  Order
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                {canEdit && (
                  <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default bg-background-secondary">
              {globalTiers.map(renderTierRow)}
              {zoneTiers.map(renderTierRow)}
            </tbody>
          </table>
        </div>
      )}

      <PricingTierModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={editingTier}
      />

      <DeleteConfirmModal
        tier={deletingTier}
        isOpen={!!deletingTier}
        onClose={() => setDeletingTier(null)}
      />
    </div>
  );
}
