import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { CustomerRepository } from '../../api/repositories/customer-repository';
import {
    Customer,
    CustomerSummary,
    CustomerFilters,
    CustomerOrderHistory,
    CustomerStats,
    SuspendCustomerRequest,
    UpdateCustomerStatusRequest,
    DeleteCustomerRequest,
    CustomerActionRequest
} from '@/app/data/types/customer';
import { PaginatedResponse } from '@/app/data/types/api';

// Create singleton instance
const customerRepo = new CustomerRepository();

export const CUSTOMER_QUERY_KEYS = {
    all: ['customers'] as const,
    lists: () => [...CUSTOMER_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: CustomerFilters) => [...CUSTOMER_QUERY_KEYS.lists(), filters] as const,
    details: () => [...CUSTOMER_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...CUSTOMER_QUERY_KEYS.details(), id] as const,
    orders: (id: string, filters?: Record<string, unknown>) => [...CUSTOMER_QUERY_KEYS.detail(id), 'orders', filters] as const,
    activities: (id: string, limit?: number) => [...CUSTOMER_QUERY_KEYS.detail(id), 'activities', limit] as const,
    stats: (dateFrom?: string, dateTo?: string) => [...CUSTOMER_QUERY_KEYS.all, 'stats', dateFrom, dateTo] as const,
};

export function useCustomers(filters?: CustomerFilters): UseQueryResult<PaginatedResponse<CustomerSummary>, Error> {
    return useQuery({
        queryKey: CUSTOMER_QUERY_KEYS.list(filters),
        queryFn: () => customerRepo.getAllCustomers(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useCustomer(customerId: string): UseQueryResult<Customer, Error> {
    return useQuery({
        queryKey: CUSTOMER_QUERY_KEYS.detail(customerId),
        queryFn: () => customerRepo.getCustomerById(customerId),
        staleTime: 5 * 60 * 1000,
        enabled: !!customerId,
        retry: 2,
    });
}

export function useCustomerOrders(customerId: string, filters?: Record<string, unknown>): UseQueryResult<PaginatedResponse<CustomerOrderHistory>, Error> {
    return useQuery({
        queryKey: CUSTOMER_QUERY_KEYS.orders(customerId, filters),
        queryFn: () => customerRepo.getCustomerOrders(customerId, filters),
        staleTime: 5 * 60 * 1000,
        enabled: !!customerId,
        retry: 2,
    });
}

export function useCustomerStats(dateFrom?: string, dateTo?: string): UseQueryResult<CustomerStats, Error> {
    return useQuery({
        queryKey: CUSTOMER_QUERY_KEYS.stats(dateFrom, dateTo),
        queryFn: () => customerRepo.getCustomerStats(dateFrom, dateTo),
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
        retry: 2,
    });
}

export function useCustomerActivities(customerId: string, limit: number = 20) {
    return useQuery({
        queryKey: CUSTOMER_QUERY_KEYS.activities(customerId, limit),
        queryFn: () => customerRepo.getCustomerActivities(customerId, limit),
        staleTime: 5 * 60 * 1000,
        enabled: !!customerId,
        retry: 2,
    });
}

// Mutation hooks for customer actions
export function useSuspendCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, request }: { customerId: string; request: SuspendCustomerRequest }) =>
            customerRepo.suspendCustomer(customerId, request),
        onSuccess: (data, variables) => {
            // Invalidate and refetch customer queries
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(variables.customerId) });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() });
        },
    });
}

export function useActivateCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, request }: { customerId: string; request?: CustomerActionRequest }) =>
            customerRepo.activateCustomer(customerId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(variables.customerId) });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() });
        },
    });
}

export function useUpdateCustomerStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId, request }: { customerId: string; request: UpdateCustomerStatusRequest }) =>
            customerRepo.updateCustomerStatus(customerId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(variables.customerId) });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() });
        },
    });
}

export function useDeleteCustomer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ customerId }: { customerId: string; request: DeleteCustomerRequest }) =>
            customerRepo.deleteCustomer(customerId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.lists() });
            queryClient.removeQueries({ queryKey: CUSTOMER_QUERY_KEYS.detail(variables.customerId) });
            queryClient.invalidateQueries({ queryKey: CUSTOMER_QUERY_KEYS.stats() });
        },
    });
}