"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { message } from "antd";
import { useCreateAvatarPreset } from "@/app/lib/hooks/api-hooks.ts/use-avatar-presets";

interface AvatarPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AvatarPresetModal({ isOpen, onClose }: AvatarPresetModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateAvatarPreset();

  const handleClose = () => {
    setName("");
    setUrl("");
    setDisplayOrder("0");
    setErrors({});
    onClose();
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = "Name is required.";
    else if (name.trim().length > 100) next.name = "Name must be 100 characters or fewer.";

    if (!url.trim()) next.url = "URL is required.";
    else if (url.trim().length > 500) next.url = "URL must be 500 characters or fewer.";
    else {
      try {
        new URL(url.trim());
      } catch {
        next.url = "Must be a valid URL.";
      }
    }

    const order = parseInt(displayOrder, 10);
    if (isNaN(order)) next.displayOrder = "Display order must be a number.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      await createMutation.mutateAsync({
        name: name.trim(),
        url: url.trim(),
        displayOrder: parseInt(displayOrder, 10),
      });
      message.success("Avatar preset added successfully.");
      handleClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      const msg = error?.response?.data?.message || "";
      message.error(msg || "Failed to add avatar preset.");
    }
  };

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
                <div className="flex items-center justify-between mb-5">
                  <Dialog.Title className="text-lg font-semibold text-text-primary">
                    Add Avatar Preset
                  </Dialog.Title>
                  <button
                    onClick={handleClose}
                    className="text-text-tertiary hover:text-text-secondary p-1 rounded transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Cool Cat"
                      maxLength={100}
                      className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary placeholder-text-tertiary transition-colors"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Image URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      maxLength={500}
                      className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary placeholder-text-tertiary transition-colors"
                    />
                    {errors.url && (
                      <p className="text-xs text-red-500 mt-1">{errors.url}</p>
                    )}
                    {url && !errors.url && (
                      <div className="mt-2 flex items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt="Preview"
                          className="h-10 w-10 rounded-full object-cover border border-border-default"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                        <span className="text-xs text-text-tertiary">Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={displayOrder}
                      onChange={(e) => setDisplayOrder(e.target.value)}
                      placeholder="0"
                      className="w-full border border-border-default rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background-tertiary text-text-primary transition-colors"
                    />
                    <p className="text-xs text-text-tertiary mt-1">Lower value = shown first. Defaults to 0.</p>
                    {errors.displayOrder && (
                      <p className="text-xs text-red-500 mt-1">{errors.displayOrder}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 border border-border-default text-text-secondary rounded-lg text-sm hover:bg-surface-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={createMutation.isPending}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {createMutation.isPending ? (
                      "Saving..."
                    ) : (
                      <>
                        <CheckIcon className="h-4 w-4" />
                        Add Preset
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
