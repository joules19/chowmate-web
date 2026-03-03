"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, MagnifyingGlassIcon, CheckIcon } from "@heroicons/react/24/outline";
import { message } from "antd";
import {
  useCreatePricingTier,
  useUpdatePricingTier,
  useZoneSearch,
} from "@/app/lib/hooks/api-hooks.ts/use-settings";
import { DeliveryPricingTierDto, ZoneDto } from "@/app/data/types/settings";

interface PricingTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier?: DeliveryPricingTierDto | null;
}

export default function PricingTierModal({ isOpen, onClose, tier }: PricingTierModalProps) {
  const isEdit = !!tier;

  const [isZoneSpecific, setIsZoneSpecific] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneDto | null>(null);
  const [zoneSearch, setZoneSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showZoneDropdown, setShowZoneDropdown] = useState(false);
  const [minKm, setMinKm] = useState("");
  const [maxKm, setMaxKm] = useState("");
  const [fee, setFee] = useState("");
  const [sortOrder, setSortOrder] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createMutation = useCreatePricingTier();
  const updateMutation = useUpdatePricingTier();

  const { data: zoneResults, isFetching: zonesLoading } = useZoneSearch(
    debouncedSearch,
    showZoneDropdown
  );

  // Populate form when editing
  useEffect(() => {
    if (tier) {
      setIsZoneSpecific(!tier.isGlobal);
      setMinKm(String(tier.minKm));
      setMaxKm(String(tier.maxKm));
      setFee(String(tier.fee));
      setSortOrder(String(tier.sortOrder));
      setIsActive(tier.isActive);
      if (!tier.isGlobal && tier.zoneId && tier.zoneName) {
        setSelectedZone({
          id: tier.zoneId,
          name: tier.zoneName,
          zoneCode: "",
          description: "",
          isActive: true,
          deliveryFee: 0,
          estimatedDeliveryTime: "",
        });
      }
    }
  }, [tier]);

  // Debounce zone search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(zoneSearch);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [zoneSearch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowZoneDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsZoneSpecific(false);
    setSelectedZone(null);
    setZoneSearch("");
    setDebouncedSearch("");
    setShowZoneDropdown(false);
    setMinKm("");
    setMaxKm("");
    setFee("");
    setSortOrder("1");
    setIsActive(true);
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    const min = parseFloat(minKm);
    const max = parseFloat(maxKm);
    const feeNum = parseFloat(fee);
    const sort = parseInt(sortOrder, 10);

    if (isNaN(min) || min < 0) next.minKm = "Min Km must be 0 or greater.";
    if (isNaN(max) || max <= 0) next.maxKm = "Max Km must be greater than 0.";
    if (!isNaN(min) && !isNaN(max) && max <= min) next.maxKm = "Max Km must be greater than Min Km.";
    if (isNaN(feeNum) || feeNum < 0) next.fee = "Fee must be 0 or greater.";
    if (isNaN(sort) || sort < 1) next.sortOrder = "Sort order must be 1 or greater.";
    if (isZoneSpecific && !selectedZone) next.zone = "Please select a zone.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isEdit && tier) {
        await updateMutation.mutateAsync({
          id: tier.id,
          request: {
            minKm: parseFloat(minKm),
            maxKm: parseFloat(maxKm),
            fee: parseFloat(fee),
            isActive,
            sortOrder: parseInt(sortOrder, 10),
          },
        });
        message.success("Pricing tier updated successfully.");
      } else {
        await createMutation.mutateAsync({
          zoneId: isZoneSpecific ? selectedZone!.id : null,
          minKm: parseFloat(minKm),
          maxKm: parseFloat(maxKm),
          fee: parseFloat(fee),
          isActive,
          sortOrder: parseInt(sortOrder, 10),
        });
        message.success("Pricing tier created successfully.");
      }
      handleClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "";
      if (msg.toLowerCase().includes("overlapping")) {
        setErrors({ submit: "A tier covering this distance range already exists for this scope." });
      } else {
        message.error(msg || "Failed to save pricing tier.");
      }
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-background-secondary rounded-lg shadow-xl p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-lg font-semibold text-text-primary">
                    {isEdit ? "Edit Pricing Tier" : "Create Pricing Tier"}
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-text-tertiary hover:text-text-secondary p-1 rounded transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Scope toggle — only for create */}
                  {!isEdit && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Scope
                      </label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsZoneSpecific(false);
                            setSelectedZone(null);
                            setZoneSearch("");
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                            !isZoneSpecific
                              ? "bg-primary-600 text-white border-primary-600"
                              : "bg-background-tertiary text-text-secondary border-border-default hover:border-primary-300"
                          }`}
                        >
                          Global
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsZoneSpecific(true)}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                            isZoneSpecific
                              ? "bg-primary-600 text-white border-primary-600"
                              : "bg-background-tertiary text-text-secondary border-border-default hover:border-primary-300"
                          }`}
                        >
                          Zone-specific
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Zone search */}
                  {isZoneSpecific && !isEdit && (
                    <div ref={searchRef} className="relative">
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Zone <span className="text-red-500">*</span>
                      </label>
                      {selectedZone ? (
                        <div className="flex items-center justify-between border border-border-default rounded-lg px-3 py-2 bg-background-tertiary">
                          <div>
                            <span className="text-sm font-medium text-text-primary">
                              {selectedZone.name}
                            </span>
                            {selectedZone.zoneCode && (
                              <span className="ml-2 text-xs text-text-tertiary">
                                {selectedZone.zoneCode}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setSelectedZone(null);
                              setZoneSearch("");
                            }}
                            className="text-text-tertiary hover:text-text-secondary"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                            <input
                              type="text"
                              value={zoneSearch}
                              onChange={(e) => {
                                setZoneSearch(e.target.value);
                                setShowZoneDropdown(true);
                              }}
                              onFocus={() => setShowZoneDropdown(true)}
                              placeholder="Search zones (min 2 chars)..."
                              className="w-full border border-border-default rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary placeholder-text-tertiary transition-colors"
                            />
                          </div>
                          {showZoneDropdown && zoneSearch.length >= 2 && (
                            <div className="absolute z-10 w-full mt-1 bg-background-secondary border border-border-default rounded-lg shadow-lg max-h-48 overflow-y-auto">
                              {zonesLoading ? (
                                <div className="px-3 py-2 text-sm text-text-tertiary">
                                  Searching...
                                </div>
                              ) : zoneResults && zoneResults.length > 0 ? (
                                zoneResults.map((zone) => (
                                  <button
                                    key={zone.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedZone(zone);
                                      setShowZoneDropdown(false);
                                      setZoneSearch("");
                                      setErrors((prev) => ({ ...prev, zone: "" }));
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-surface-50 transition-colors flex items-center justify-between"
                                  >
                                    <span className="text-text-primary">{zone.name}</span>
                                    {zone.zoneCode && (
                                      <span className="text-xs text-text-tertiary">{zone.zoneCode}</span>
                                    )}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-text-tertiary">
                                  No zones found.
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                      {errors.zone && (
                        <p className="text-xs text-red-500 mt-1">{errors.zone}</p>
                      )}
                    </div>
                  )}

                  {/* Edit: show zone label (read-only) */}
                  {isEdit && tier && !tier.isGlobal && (
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">Zone</label>
                      <div className="border border-border-default rounded-lg px-3 py-2 bg-surface-50 text-sm text-text-secondary">
                        {tier.zoneName ?? "—"}
                        <span className="ml-1 text-xs text-text-tertiary">(cannot be changed)</span>
                      </div>
                    </div>
                  )}

                  {/* Min / Max Km */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Min Km <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={minKm}
                        onChange={(e) => setMinKm(e.target.value)}
                        placeholder="e.g. 0"
                        className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary placeholder-text-tertiary transition-colors"
                      />
                      {errors.minKm && (
                        <p className="text-xs text-red-500 mt-1">{errors.minKm}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Max Km <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        step={0.1}
                        value={maxKm}
                        onChange={(e) => setMaxKm(e.target.value)}
                        placeholder="e.g. 1.5"
                        className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary placeholder-text-tertiary transition-colors"
                      />
                      {errors.maxKm && (
                        <p className="text-xs text-red-500 mt-1">{errors.maxKm}</p>
                      )}
                    </div>
                  </div>

                  {/* Fee */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Fee (₦) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={fee}
                      onChange={(e) => setFee(e.target.value)}
                      placeholder="e.g. 400"
                      className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary placeholder-text-tertiary transition-colors"
                    />
                    {errors.fee && <p className="text-xs text-red-500 mt-1">{errors.fee}</p>}
                  </div>

                  {/* Sort Order + Active */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1">
                        Sort Order <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary transition-colors"
                      />
                      {errors.sortOrder && (
                        <p className="text-xs text-red-500 mt-1">{errors.sortOrder}</p>
                      )}
                    </div>
                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 cursor-pointer pb-2">
                        <button
                          type="button"
                          onClick={() => setIsActive((v) => !v)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${
                            isActive ? "bg-primary-600" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                              isActive ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-sm text-text-primary">Active</span>
                      </label>
                    </div>
                  </div>

                  {errors.submit && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                      {errors.submit}
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-border-default text-text-secondary rounded-lg text-sm hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {isPending ? (
                      "Saving..."
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        {isEdit ? "Update Tier" : "Create Tier"}
                      </>
                    )}
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
