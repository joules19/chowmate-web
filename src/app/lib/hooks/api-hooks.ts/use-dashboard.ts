import { AdminDashboardStats } from '@/app/data/types/api';
import { RevenueData, OrderStatusData, DashboardAnalytics } from '@/app/data/types/dashboard';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DashboardRepository, DashboardStatsFilters, RevenueDataFilters, OrderStatusFilters } from '../../api/repositories/dashboard-repository';
import { ActivityFilters, ActivityLog, PaginatedActivities } from '@/app/data/types/activities';

// Create singleton instance
const dashboardRepo = new DashboardRepository();

export const DASHBOARD_QUERY_KEYS = {
    stats: (filters?: DashboardStatsFilters) => ['dashboard', 'stats', filters] as const,
    revenue: (filters?: RevenueDataFilters) => ['dashboard', 'revenue', filters] as const,
    orderStatus: (filters?: OrderStatusFilters) => ['dashboard', 'order-status', filters] as const,
    analytics: (filters?: RevenueDataFilters) => ['dashboard', 'analytics', filters] as const,
    activities: (filters?: ActivityFilters) => ['dashboard', 'activities', filters] as const,
    userActivities: (userId: string, limit?: number) => ['dashboard', 'user-activities', userId, limit] as const,
    entityActivities: (entityType: string, entityId: string, limit?: number) =>
        ['dashboard', 'entity-activities', entityType, entityId, limit] as const,
};

export function useDashboardStats(filters?: DashboardStatsFilters): UseQueryResult<AdminDashboardStats, Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.stats(filters),
        queryFn: () => dashboardRepo.getDashboardStats(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useRevenueData(filters?: RevenueDataFilters): UseQueryResult<RevenueData[], Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.revenue(filters),
        queryFn: () => dashboardRepo.getRevenueData(filters),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useOrderStatusData(filters?: OrderStatusFilters): UseQueryResult<OrderStatusData[], Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.orderStatus(filters),
        queryFn: () => dashboardRepo.getOrderStatusData(filters),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useDashboardAnalytics(filters?: RevenueDataFilters): UseQueryResult<DashboardAnalytics, Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.analytics(filters),
        queryFn: () => dashboardRepo.getDashboardAnalytics(filters),
        staleTime: 5 * 60 * 1000,
        refetchInterval: 10 * 60 * 1000,
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });


}

export function useRecentActivities(filters?: ActivityFilters): UseQueryResult<PaginatedActivities, Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.activities(filters),
        queryFn: () => dashboardRepo.getRecentActivities(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes (more frequent for activities)
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useUserActivities(userId: string, limit: number = 10): UseQueryResult<ActivityLog[], Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.userActivities(userId, limit),
        queryFn: () => dashboardRepo.getUserActivities(userId, limit),
        staleTime: 5 * 60 * 1000,
        enabled: !!userId, // Only run if userId is provided
        retry: 2,
    });
}

export function useEntityActivities(
    entityType: string,
    entityId: string,
    limit: number = 10
): UseQueryResult<ActivityLog[], Error> {
    return useQuery({
        queryKey: DASHBOARD_QUERY_KEYS.entityActivities(entityType, entityId, limit),
        queryFn: () => dashboardRepo.getEntityActivities(entityType, entityId, limit),
        staleTime: 5 * 60 * 1000,
        enabled: !!(entityType && entityId), // Only run if both are provided
        retry: 2,
    });
}