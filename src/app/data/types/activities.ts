export interface ActivityLog {
    id: string;
    type: string;
    title: string;
    description: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    entityId?: string;
    entityType?: string;
    entityName?: string;
    severity: string;
    ipAddress?: string;
    additionalData?: Record<string, unknown>;
    timestamp: string;
    timeAgo: string;
    icon: string;
    iconColor: string;
}

export interface ActivityFilters {
    type?: string;
    severity?: string;
    fromDate?: string;
    toDate?: string;
    pageNumber?: number;
    pageSize?: number;
}

export interface PaginatedActivities {
    data: ActivityLog[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}