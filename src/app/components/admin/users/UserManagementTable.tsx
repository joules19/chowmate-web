"use client";

import { useState, useEffect } from "react";
import DataTable, { Column } from "../shared/DataTable";
import { ApplicationUser } from "../../../data/types/entities";
import { SearchFilters, PaginatedResponse } from "../../../data/types/api";
import { RepositoryFactory } from "../../../lib/api/repository-factory";

interface Props {
  filters: SearchFilters;
}

export default function UserManagementTable({ filters }: Props) {
  const [users, setUsers] = useState<PaginatedResponse<ApplicationUser>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);

  const userRepository = RepositoryFactory.getUserRepository();

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userRepository.getAll(filters);
      setUsers(response);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers({
        data: mockUsers,
        total: mockUsers.length,
        page: 1,
        limit: 10,
        totalPages: Math.ceil(mockUsers.length / 10)
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    console.log('Sorting by:', key, order);
  };

  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    try {
      switch (action) {
        case 'suspend':
          await userRepository.suspend(userId, 'Administrative action');
          break;
        case 'activate':
          await userRepository.activate(userId);
          break;
        case 'delete':
          await userRepository.delete(userId);
          break;
      }
      fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const columns: Column<ApplicationUser>[] = [
    {
      key: 'firstName',
      label: 'Name',
      sortable: true,
      render: (user) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-700">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </span>
            </div>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      sortable: true
    },
    {
      key: 'roles',
      label: 'Roles',
      render: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              {role}
            </span>
          ))}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (user) => new Date(user.createdAt || '').toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserAction(user.id, 'suspend');
            }}
            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
          >
            Suspend
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserAction(user.id, 'activate');
            }}
            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
          >
            Activate
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUserAction(user.id, 'delete');
            }}
            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  return (
    <DataTable
      data={users.data}
      columns={columns}
      loading={loading}
      pagination={{
        page: users.page,
        limit: users.limit,
        total: users.total,
        totalPages: users.totalPages
      }}
      onSort={handleSort}
      onPageChange={handlePageChange}
      onRowClick={(user) => console.log('User clicked:', user)}
    />
  );
}

const mockUsers: ApplicationUser[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '+1234567890',
    roles: ['CUSTOMER'],
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    email: 'jane.smith@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    phoneNumber: '+1234567891',
    roles: ['VENDOR'],
    createdAt: '2024-01-14T09:15:00Z'
  },
  {
    id: '3',
    email: 'admin@chowmate.com',
    firstName: 'Admin',
    lastName: 'User',
    phoneNumber: '+1234567892',
    roles: ['ADMIN'],
    createdAt: '2024-01-10T08:00:00Z'
  }
];