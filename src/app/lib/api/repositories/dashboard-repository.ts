import { AdminDashboardStats, DashboardAnalytics, OrderStatusData, RevenueData } from '@/app/data/types/dashboard';
import { BaseRepository } from '../base-repository';
import { ActivityFilters, ActivityLog, PaginatedActivities } from '@/app/data/types/activities';

export interface DashboardStatsFilters extends Record<string, unknown> {
    startDate?: string;
    endDate?: string;
}

export interface RevenueDataFilters {
    timeRange?: '7d' | '30d' | '90d' | '1y';
    startDate?: string;
    endDate?: string;
}

export interface OrderStatusFilters {
    startDate?: string;
    endDate?: string;
}

export class DashboardRepository extends BaseRepository<AdminDashboardStats> {
    constructor() {
        super('api/admin');
    }

    async getDashboardStats(filters?: DashboardStatsFilters): Promise<AdminDashboardStats> {
        const queryParams = new URLSearchParams();

        if (filters?.startDate) {
            queryParams.append('startDate', filters.startDate);
        }
        if (filters?.endDate) {
            queryParams.append('endDate', filters.endDate);
        }

        const endpoint = `/dashboard/stats${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<AdminDashboardStats>(endpoint);
    }

    async getRevenueData(filters?: RevenueDataFilters): Promise<RevenueData[]> {
        const queryParams = new URLSearchParams();

        if (filters?.timeRange) {
            queryParams.append('timeRange', filters.timeRange);
        }
        if (filters?.startDate) {
            queryParams.append('startDate', filters.startDate);
        }
        if (filters?.endDate) {
            queryParams.append('endDate', filters.endDate);
        }

        const endpoint = `/dashboard/revenue${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<RevenueData[]>(endpoint);
    }

    async getOrderStatusData(filters?: OrderStatusFilters): Promise<OrderStatusData[]> {
        const queryParams = new URLSearchParams();

        if (filters?.startDate) {
            queryParams.append('startDate', filters.startDate);
        }
        if (filters?.endDate) {
            queryParams.append('endDate', filters.endDate);
        }

        const endpoint = `/dashboard/order-status${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<OrderStatusData[]>(endpoint);
    }

    async getDashboardAnalytics(filters?: RevenueDataFilters): Promise<DashboardAnalytics> {
        const queryParams = new URLSearchParams();

        if (filters?.timeRange) {
            queryParams.append('timeRange', filters.timeRange);
        }
        if (filters?.startDate) {
            queryParams.append('startDate', filters.startDate);
        }
        if (filters?.endDate) {
            queryParams.append('endDate', filters.endDate);
        }

        const endpoint = `/dashboard/analytics${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<DashboardAnalytics>(endpoint);
    }

    async getRecentActivities(filters?: ActivityFilters): Promise<PaginatedActivities> {
        const queryParams = new URLSearchParams();

        if (filters?.type) queryParams.append('type', filters.type);
        if (filters?.severity) queryParams.append('severity', filters.severity);
        if (filters?.fromDate) queryParams.append('fromDate', filters.fromDate);
        if (filters?.toDate) queryParams.append('toDate', filters.toDate);
        if (filters?.pageNumber) queryParams.append('pageNumber', filters.pageNumber.toString());
        if (filters?.pageSize) queryParams.append('pageSize', filters.pageSize.toString());

        const endpoint = `/activities/recent${queryParams.toString() ? `?${queryParams}` : ''}`;
        return this.get<PaginatedActivities>(endpoint);
    }

    async getUserActivities(userId: string, limit: number = 10): Promise<ActivityLog[]> {
        const endpoint = `/activities/user/${userId}?limit=${limit}`;
        return this.get<ActivityLog[]>(endpoint);
    }

    async getEntityActivities(entityType: string, entityId: string, limit: number = 10): Promise<ActivityLog[]> {
        const endpoint = `/activities/entity/${entityType}/${entityId}?limit=${limit}`;
        return this.get<ActivityLog[]>(endpoint);
    }

    async exportDashboardReport(filters?: DashboardStatsFilters): Promise<Blob> {
        return this.post<Blob>('/export', filters || {});
    }
}