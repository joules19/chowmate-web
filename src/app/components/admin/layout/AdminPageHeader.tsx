import React from 'react';

interface AdminPageHeaderProps {
    title: string;
    subtitle: string;
    icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & { title?: string | undefined; titleId?: string | undefined; } & React.RefAttributes<SVGSVGElement>>;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({ title, subtitle, icon: Icon }) => {
    return (
        <div className="border-b border-gray-200 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div className="flex-1 min-w-0">
                <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">
                    {title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    {subtitle}
                </p>
            </div>
            <div className="mt-4 flex sm:mt-0 sm:ml-4">
                <span className="p-2 bg-gray-100 rounded-full">
                    <Icon className="h-6 w-6 text-gray-500" />
                </span>
            </div>
        </div>
    );
};

export default AdminPageHeader;
