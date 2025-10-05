"use client";

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Advertisement, CreateAdvertisementFormData, UpdateAdvertisementRequest, AdvertisementUserType, AdvertisementBackgroundColor } from '@/app/data/types/advertisement';
import { useCreateAdvertisement, useUpdateAdvertisement } from '@/app/lib/hooks/api-hooks.ts/use-advertisement';
import { useVendors } from '@/app/lib/hooks/api-hooks.ts/use-vendor';
import { message } from 'antd';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  advertisement?: Advertisement; // If provided, it's edit mode
}

export default function CreateEditAdvertisementModal({ isOpen, onClose, advertisement }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [vendorId, setVendorId] = useState('');
  const [userType, setUserType] = useState<AdvertisementUserType>('customer');
  const [backgroundColor, setBackgroundColor] = useState<AdvertisementBackgroundColor>('default');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createMutation = useCreateAdvertisement();
  const updateMutation = useUpdateAdvertisement();
  const { data: vendorsResponse, isLoading: vendorsLoading } = useVendors({ pageSize: 1000 });

  const isEditMode = !!advertisement;
  const modalTitle = isEditMode ? 'Edit Advertisement' : 'Create Advertisement';

  // Reset form when modal opens/closes or advertisement changes
  useEffect(() => {
    if (isOpen) {
      if (advertisement) {
        setTitle(advertisement.title);
        setDescription(advertisement.description);
        setImagePreview(advertisement.imageUrl);
        setVendorId(advertisement.vendorId);
        setUserType(advertisement.userType);
        setBackgroundColor(
          typeof advertisement.backgroundColor === 'string'
            ? advertisement.backgroundColor
            : 'default'
        );
        setImageFile(null);
      } else {
        // Reset to defaults for create mode
        setTitle('');
        setDescription('');
        setImagePreview('');
        setImageFile(null);
        setVendorId('');
        setUserType('customer');
        setBackgroundColor('default');
      }
    }
  }, [isOpen, advertisement]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title.trim()) {
      message.error('Title is required');
      return;
    }
    if (!description.trim()) {
      message.error('Description is required');
      return;
    }
    if (!isEditMode && !imageFile) {
      message.error('Image is required');
      return;
    }
    if (!vendorId.trim()) {
      message.error('Vendor ID is required');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && advertisement) {
        // For updates, also use FormData if backend expects it
        if (imageFile) {
          // If new image is uploaded, use FormData
          const formData = new FormData();
          formData.append('title', title.trim());
          formData.append('description', description.trim());
          formData.append('image', imageFile);
          formData.append('vendorId', vendorId.trim());
          // Convert userType to backend enum values (Customer=1, Vendor=2, Rider=3)
          const userTypeValue = userType === 'customer' ? '1' : userType === 'vendor' ? '2' : '3';
          formData.append('userType', userTypeValue);
          // Convert backgroundColor to backend enum values (Default=1, Blue=2, Green=3, Orange=4, Purple=5, Pink=6)
          const backgroundColorMap = {
            'default': '1',
            'blue': '2',
            'green': '3',
            'orange': '4',
            'purple': '5',
            'pink': '6'
          };
          const backgroundColorValue = backgroundColorMap[backgroundColor as keyof typeof backgroundColorMap] || '1';
          formData.append('advertismentBackgroundColor', backgroundColorValue);

          // Debug: Log FormData contents
          console.log('Update FormData being sent:');
          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });

          // Use FormData for update
          await updateMutation.mutateAsync({
            advertisementId: advertisement.id,
            formData: formData
          });
        } else {
          // If no new image, still use FormData but without image
          const formData = new FormData();
          formData.append('title', title.trim());
          formData.append('description', description.trim());
          formData.append('vendorId', vendorId.trim());
          // Convert userType to backend enum values (Customer=1, Vendor=2, Rider=3)
          const userTypeValue = userType === 'customer' ? '1' : userType === 'vendor' ? '2' : '3';
          formData.append('userType', userTypeValue);
          // Convert backgroundColor to backend enum values (Default=1, Blue=2, Green=3, Orange=4, Purple=5, Pink=6)
          const backgroundColorMap = {
            'default': '1',
            'blue': '2',
            'green': '3',
            'orange': '4',
            'purple': '5',
            'pink': '6'
          };
          const backgroundColorValue = backgroundColorMap[backgroundColor as keyof typeof backgroundColorMap] || '1';
          formData.append('advertismentBackgroundColor', backgroundColorValue);

          console.log('Update FormData (no image) being sent:');
          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });

          await updateMutation.mutateAsync({
            advertisementId: advertisement.id,
            formData: formData
          });
        }
        message.success('Advertisement updated successfully');
      } else {
        if (!imageFile) {
          message.error('Image is required for new advertisements');
          return;
        }

        const formData = new FormData();
        formData.append('Title', title.trim());
        formData.append('Description', description.trim());
        formData.append('Image', imageFile);
        formData.append('vendorId', vendorId.trim());
        // Convert userType to backend enum values (Customer=1, Vendor=2, Rider=3)
        const userTypeValue = userType === 'customer' ? '1' : userType === 'vendor' ? '2' : '3';
        formData.append('userType', userTypeValue);
        // Convert backgroundColor to backend enum values (Default=1, Blue=2, Green=3, Orange=4, Purple=5, Pink=6)
        const backgroundColorMap = {
          'default': '1',
          'blue': '2',
          'green': '3',
          'orange': '4',
          'purple': '5',
          'pink': '6'
        };
        const backgroundColorValue = backgroundColorMap[backgroundColor as keyof typeof backgroundColorMap] || '1';
        formData.append('advertismentBackgroundColor', backgroundColorValue);

        // Debug: Log FormData contents
        console.log('FormData being sent:');
        formData.forEach((value, key) => {
          console.log(`${key}:`, value);
        });

        await createMutation.mutateAsync(formData);
        message.success('Advertisement created successfully');
      }

      onClose();
    } catch (error) {
      message.error(isEditMode ? 'Failed to update advertisement' : 'Failed to create advertisement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const backgroundColorOptions: { value: AdvertisementBackgroundColor; label: string; colorClass: string }[] = [
    { value: 'default', label: 'Default', colorClass: 'bg-gray-200' },
    { value: 'blue', label: 'Blue', colorClass: 'bg-blue-200' },
    { value: 'green', label: 'Green', colorClass: 'bg-green-200' },
    { value: 'orange', label: 'Orange', colorClass: 'bg-orange-200' },
    { value: 'purple', label: 'Purple', colorClass: 'bg-purple-200' },
    { value: 'pink', label: 'Pink', colorClass: 'bg-pink-200' }
  ];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-card bg-surface-0 p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-center justify-between mb-6">
                  <Dialog.Title as="h3" className="text-lg font-semibold text-text-primary">
                    {modalTitle}
                  </Dialog.Title>
                  <button
                    onClick={onClose}
                    className="text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1">
                      Title *
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter advertisement title"
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter advertisement description"
                      rows={3}
                      className="input-field"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-text-secondary mb-1">
                      Advertisement Image {!isEditMode && '*'}
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border-light border-dashed rounded-lg hover:border-primary-300 transition-colors">
                      <div className="space-y-1 text-center">
                        {imagePreview ? (
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="mx-auto h-32 w-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview('');
                                setImageFile(null);
                                const input = document.getElementById('image') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                              className="absolute -top-2 -right-2 bg-danger-500 text-white rounded-full p-1 hover:bg-danger-600"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <PhotoIcon className="mx-auto h-12 w-12 text-text-tertiary" />
                        )}
                        <div className="flex text-sm text-text-secondary">
                          <label
                            htmlFor="image"
                            className="relative cursor-pointer bg-surface-0 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500"
                          >
                            <span>{imagePreview ? 'Change image' : 'Upload an image'}</span>
                            <input
                              id="image"
                              name="image"
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                        <p className="text-xs text-text-tertiary">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Vendor Selection */}
                    <div>
                      <label htmlFor="vendorId" className="block text-sm font-medium text-text-secondary mb-1">
                        Vendor *
                      </label>
                      {vendorsLoading ? (
                        <div className="input-field flex items-center justify-center py-3">
                          <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                          Loading vendors...
                        </div>
                      ) : (
                        <select
                          id="vendorId"
                          value={vendorId}
                          onChange={(e) => setVendorId(e.target.value)}
                          className="input-field"
                          required
                        >
                          <option value="">Select a vendor</option>
                          {vendorsResponse?.items?.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.businessName}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* User Type */}
                    <div>
                      <label htmlFor="userType" className="block text-sm font-medium text-text-secondary mb-1">
                        Target User Type *
                      </label>
                      <select
                        id="userType"
                        value={userType}
                        onChange={(e) => setUserType(e.target.value as AdvertisementUserType)}
                        className="input-field"
                        required
                      >
                        <option value="customer">Customer</option>
                        <option value="vendor">Vendor</option>
                        <option value="rider">Rider</option>
                      </select>
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Background Color
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {backgroundColorOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${backgroundColor === option.value
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-border-light hover:border-primary-300'
                            }`}
                        >
                          <input
                            type="radio"
                            name="backgroundColor"
                            value={option.value}
                            checked={backgroundColor === option.value}
                            onChange={(e) => setBackgroundColor(e.target.value as AdvertisementBackgroundColor)}
                            className="sr-only"
                          />
                          <div className={`w-8 h-8 rounded border border-gray-300 ${option.colorClass}`} />
                          <span className="text-xs text-text-secondary mt-1">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-border-light">
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <ArrowPathIcon className="w-4 h-4 animate-spin mr-2" />
                      )}
                      {isSubmitting
                        ? (isEditMode ? 'Updating...' : 'Creating...')
                        : (isEditMode ? 'Update Advertisement' : 'Create Advertisement')
                      }
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}