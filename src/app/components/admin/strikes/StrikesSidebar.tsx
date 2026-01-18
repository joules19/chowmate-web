"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldExclamationIcon, ShieldCheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function StrikesSidebar() {
    const pathname = usePathname();

    const links = [
        {
            name: 'Strikes Management',
            href: '/control/strikes',
            icon: ShieldExclamationIcon,
        },
        {
            name: 'Disputed Strikes',
            href: '/control/strikes/disputes',
            icon: ShieldCheckIcon,
        },
    ];

    return (
        <div className="bg-surface-0 rounded-card shadow-soft p-4 sm:p-6 border border-border-light">
            <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
                Strike Management
            </h3>
            <nav className="space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                                    : 'text-text-secondary hover:bg-surface-50 hover:text-text-primary'
                            }`}
                        >
                            <Icon className="h-5 w-5 mr-3" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-6 pt-6 border-t border-border-light">
                <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-3">
                    Strike System Info
                </h4>
                <div className="space-y-3 text-xs text-text-secondary">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-orange-500 mr-2">⚠️</div>
                        <p>Strikes are warnings given to vendors for policy violations.</p>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-red-500 mr-2">🎯</div>
                        <p>When threshold is reached (default: 3), a deduction is automatically created.</p>
                    </div>
                    <div className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-purple-500 mr-2">⚖️</div>
                        <p>Vendors can dispute strikes by providing evidence and explanation.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
