"use client";

import { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
    DeductionDto,
    CreateDeductionRequest,
    UpdateDeductionRequest,
    DeductionPriority,
} from '@/app/data/types/deductions';
import { useCreateDeduction, useUpdateDeduction } from '@/app/lib/hooks/api-hooks/use-deductions';
import { VendorSummary } from '@/app/data/types/vendor';
import { AuthService }from '@/app/lib/auth/auth-service';
import { XMarkIcon } from '@heroicons/react/24/outline';


interface DeductionFormProps {
    deduction?: DeductionDto;
    vendor: VendorSummary;
    onClose: () => void;
}

const DeductionSchema = Yup.object().shape({
    amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
    description: Yup.string().required('Description is required'),
    reason: Yup.string().required('Reason is required'),
    priority: Yup.string().oneOf(Object.values(DeductionPriority)).required('Priority is required'),
    notes: Yup.string(),
});

export default function DeductionForm({ deduction, vendor, onClose }: DeductionFormProps) {
    const createDeduction = useCreateDeduction();
    const updateDeduction = useUpdateDeduction();
    const user = AuthService.getUser();

    const initialValues = {
        amount: deduction?.amount || 0,
        description: deduction?.description || '',
        reason: deduction?.reason || '',
        priority: deduction?.priority || DeductionPriority.Medium,
        notes: (deduction as any)?.notes || '',
    };

    const handleSubmit = (values: any) => {
        const adminUserId = user?.id || '';
        const adminUserName = `${user?.firstName} ${user?.lastName}`.trim() || 'Admin';

        if (deduction) {
            const updateRequest: UpdateDeductionRequest = {
                ...values,
                adminUserId,
                adminUserName,
            };
            updateDeduction.mutate({ deductionId: deduction.id, request: updateRequest });
        } else {
            const createRequest: CreateDeductionRequest = {
                ...values,
                vendorId: vendor.id,
                adminUserId,
                adminUserName,
                priorityOrder: 0,
            };
            createDeduction.mutate(createRequest);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold">{deduction ? 'Edit Deduction' : 'Create Deduction'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={DeductionSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
                                <Field type="number" name="amount" className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2" />
                                <ErrorMessage name="amount" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description</label>
                                <Field type="text" name="description" className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2" />
                                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium text-text-secondary">Reason</label>
                                <Field as="textarea" name="reason" rows={3} className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2" />
                                <ErrorMessage name="reason" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-text-secondary">Priority</label>
                                <Field as="select" name="priority" className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2">
                                    {Object.values(DeductionPriority).map((priority) => (
                                        <option key={priority} value={priority}>{priority}</option>
                                    ))}
                                </Field>
                                <ErrorMessage name="priority" component="div" className="text-red-500 text-sm mt-1" />
                            </div>
                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-text-secondary">Notes (Admin only)</label>
                                <Field as="textarea" name="notes" rows={3} className="mt-1 block w-full rounded-md border-border-default shadow-sm p-2" />
                                <ErrorMessage name="notes" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button type="button" onClick={onClose} className="w-full sm:w-auto px-4 py-2.5 bg-surface-0 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 hover:border-border-medium focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium">
                                    {isSubmitting ? 'Saving...' : 'Save Deduction'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
