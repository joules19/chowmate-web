export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
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
  totalUsers: number;
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