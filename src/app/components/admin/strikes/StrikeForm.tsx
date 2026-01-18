"use client";

import { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useCreateStrike } from '@/app/lib/hooks/api-hooks/use-strikes';
import { VendorSummary } from '@/app/data/types/vendor';
import { AuthService } from '@/app/lib/auth/auth-service';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { CreateStrikeRequest } from '@/app/data/types/strikes';

interface StrikeFormProps {
    vendor: VendorSummary;
    onClose: () => void;
}

const StrikeSchema = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
    description: Yup.string().required('Description is required'),
    notes: Yup.string(),
});

export default function StrikeForm({ vendor, onClose }: StrikeFormProps) {
    const createStrike = useCreateStrike();
    const user = AuthService.getUser();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [evidenceImage, setEvidenceImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const initialValues = {
        reason: '',
        description: '',
        notes: '',
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            setEvidenceImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setEvidenceImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (values: any) => {
        const request: CreateStrikeRequest = {
            vendorId: vendor.id,
            reason: values.reason,
            description: values.description,
            notes: values.notes || undefined,
            evidenceImage: evidenceImage || undefined,
        };

        createStrike.mutate(request);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">Create Strike</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Issue a strike to {vendor.businessName}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={StrikeSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">
                                    Strike Reason <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="text"
                                    name="reason"
                                    placeholder="e.g., Late order delivery, Poor service quality"
                                    className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <ErrorMessage name="reason" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-secondary">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows={4}
                                    placeholder="Provide detailed information about the violation..."
                                    className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">
                                    Internal Notes (Admin only)
                                </label>
                                <Field
                                    as="textarea"
                                    name="notes"
                                    rows={3}
                                    placeholder="Internal notes for admin reference..."
                                    className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                                <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                    Evidence Image (Optional)
                                </label>
                                <div className="space-y-2">
                                    {!imagePreview ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
                                        >
                                            <PhotoIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                                            <p className="text-sm text-text-secondary">
                                                Click to upload evidence image
                                            </p>
                                            <p className="text-xs text-text-tertiary mt-1">
                                                PNG, JPG, WEBP up to 5MB
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Evidence preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                            >
                                                <XMarkIcon className="h-5 w-5" />
                                            </button>
                                            <p className="text-xs text-text-secondary mt-1">
                                                {evidenceImage?.name} ({(evidenceImage?.size / 1024).toFixed(2)} KB)
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800">Important</h3>
                                        <div className="mt-2 text-sm text-yellow-700">
                                            <p>
                                                When the strike threshold is reached (configured in system settings),
                                                an automatic deduction will be created. This strike cannot be edited after creation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-red-500 text-white rounded-button hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create Strike'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
