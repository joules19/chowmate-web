"use client";

import { DisputeStatus } from "@/app/data/types/deductions";

interface StatusBadgeProps {
    status: DisputeStatus;
}

const statusStyles: Record<DisputeStatus, { text: string, className: string }> = {
    [DisputeStatus.Pending]: { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    [DisputeStatus.UnderReview]: { text: 'Under Review', className: 'bg-blue-100 text-blue-800' },
    [DisputeStatus.Approved]: { text: 'Approved', className: 'bg-green-100 text-green-800' },
    [DisputeStatus.Rejected]: { text: 'Rejected', className: 'bg-red-100 text-red-800' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { text, className } = statusStyles[status] || { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };

    return (
        <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${className}`}
        >
            {text}
        </span>
    );
}
