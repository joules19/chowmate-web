"use client";

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useReviewStrikeDispute } from '@/app/lib/hooks/api-hooks/use-strikes';
import { AuthService } from '@/app/lib/auth/auth-service';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface DisputeReviewModalProps {
    strikeId: string;
    onClose: () => void;
}

const ReviewSchema = Yup.object().shape({
    resolutionNotes: Yup.string().required('Resolution notes are required'),
});

export default function DisputeReviewModal({ strikeId, onClose }: DisputeReviewModalProps) {
    const reviewDispute = useReviewStrikeDispute();
    const user = AuthService.getUser();

    const handleSubmit = (values: any, approve: boolean) => {
        const adminUserId = user?.id || '';
        const adminUserName = `${user?.firstName} ${user?.lastName}`.trim() || 'Admin';

        reviewDispute.mutate({
            strikeId,
            request: {
                approve,
                resolutionNotes: values.resolutionNotes,
                adminUserId,
                adminUserName,
            },
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-text-primary">Review Dispute</h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Approve or reject the vendor's dispute
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-blue-800">Review Guidelines</h3>
                            <div className="mt-2 text-sm text-blue-700">
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>Approve:</strong> Strike will be resolved, vendor wins the dispute</li>
                                    <li><strong>Reject:</strong> Strike remains active, dispute is denied</li>
                                    <li>Provide clear and detailed resolution notes for transparency</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <Formik
                    initialValues={{ resolutionNotes: '' }}
                    validationSchema={ReviewSchema}
                    onSubmit={(values) => {
                        // This will be handled by button clicks
                    }}
                >
                    {({ values, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="resolutionNotes" className="block text-sm font-medium text-text-secondary mb-2">
                                    Resolution Notes <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    as="textarea"
                                    name="resolutionNotes"
                                    rows={6}
                                    placeholder="Explain your decision to approve or reject this dispute. Be clear and professional..."
                                    className="block w-full rounded-md border-border-default shadow-sm p-3 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                                />
                                <ErrorMessage name="resolutionNotes" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (values.resolutionNotes.trim()) {
                                            handleSubmit(values, false);
                                        }
                                    }}
                                    disabled={isSubmitting || !values.resolutionNotes.trim()}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-red-500 text-white rounded-button hover:bg-red-600 active:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <XCircleIcon className="h-5 w-5 mr-2" />
                                    Reject Dispute
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (values.resolutionNotes.trim()) {
                                            handleSubmit(values, true);
                                        }
                                    }}
                                    disabled={isSubmitting || !values.resolutionNotes.trim()}
                                    className="w-full sm:w-auto px-4 py-2.5 bg-green-500 text-white rounded-button hover:bg-green-600 active:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                                    Approve Dispute
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
