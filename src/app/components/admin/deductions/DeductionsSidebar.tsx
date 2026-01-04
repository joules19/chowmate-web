"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReceiptRefundIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

export default function DeductionsSidebar() {
    const pathname = usePathname();

    const sidebarItems = [
        {
            name: 'All Deductions',
            href: '/control/deductions',
            icon: ReceiptRefundIcon,
        },
        {
            name: 'Disputed Deductions',
            href: '/control/deductions/disputes',
            icon: ShieldExclamationIcon,
        },
    ];

    return (
        <nav className="space-y-1">
            {sidebarItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`
                            flex items-center px-3 py-2.5 rounded-lg transition-colors
                            ${isActive
                                ? 'bg-primary-50 text-primary-700 font-medium'
                                : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                            }
                        `}
                    >
                        <Icon className="h-5 w-5 mr-3" />
                        <span>{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}