export interface AdminDashboardStats {
    totalCustomers: number;
    totalVendors: number;
    totalRiders: number;
    totalOrders: number;
    pendingVendors: number;
    activeOrders: number;
    revenue: number;
    growthRate: number;
}

export interface RevenueData {
    day: string;
    revenue: number;
}

export interface OrderStatusData {
    status: string;
    count: number;
    color: string;
    percentage: number;
}

export interface DashboardAnalytics {
    stats: AdminDashboardStats;
    revenueData: {
        [key: string]: RevenueData[];
    };
    orderStatusData: OrderStatusData[];
}