export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}

export interface EarningsPaginatedResponse<T> extends PaginatedResponse<T> {
  totalEarnings: number;
  totalPlatformEarnings: number;
  totalVendorEarnings: number;
  totalRiderEarnings: number;
  totalPages: number; // Added this as it's present in the C# DTO
}

export interface OrderPaginatedResponse<T> extends PaginatedResponse<T> {
  totalPendingOrders: number;
  totalActiveOrders: number;
  completedToday: number;
}


export interface PagedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

export interface SearchFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

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

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export interface RevenueChartData {
  daily: ChartDataPoint[];
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
}

export interface UserActivityData {
  newUsers: ChartDataPoint[];
  activeUsers: ChartDataPoint[];
  totalUsers: ChartDataPoint[];
}

export interface OrderAnalytics {
  ordersByStatus: ChartDataPoint[];
  orderTrends: ChartDataPoint[];
  averageOrderValue: number;
  conversionRate: number;
}