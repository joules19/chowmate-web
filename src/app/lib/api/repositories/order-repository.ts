import { BaseRepository } from "../base-repository";
import { AllOrdersDto, AssignmentResultDto, AssignRiderToOrderRequest, AvailableRiderDto, Order, OrderStatus, PendingOrderDto } from "../../../data/types/order";
import { PaginatedResponse } from "../../../data/types/api";

export interface OrderFilters {
  search?: string;
  status?: OrderStatus | string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('api/admin/orders');
  }

  /**
   * Get all orders with full details using AllOrdersDto structure
   */
  async getAllOrders(filters?: OrderFilters): Promise<PaginatedResponse<AllOrdersDto>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<PaginatedResponse<AllOrdersDto>>(endpoint);
  }

  /**
   * Get all orders that are currently in preparing or noriderfound status
   */
  async getOrdersPendingAssignment(): Promise<PendingOrderDto[]> {
    return this.get<PendingOrderDto[]>('/pending-assignment');
  }



  /**
   * Manually assign a rider to an order
   */
  async assignRiderToOrder(request: AssignRiderToOrderRequest): Promise<AssignmentResultDto> {
    return this.post<AssignmentResultDto>('/assign-rider', request);
  }

  async replaceOrderRider(request: AssignRiderToOrderRequest): Promise<AssignmentResultDto> {
    return this.post<AssignmentResultDto>('/replace-rider', request);
  }

  async updateStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    return this.put<Order>(`/${id}/status`, { status, notes });
  }

  async assignRider(id: string, riderId: string): Promise<Order> {
    return this.post<Order>(`/${id}/assign-rider`, { riderId });
  }

  async cancel(id: string, reason: string): Promise<Order> {
    return this.post<Order>(`/${id}/cancel`, { reason });
  }

  async refund(id: string, amount?: number, reason?: string): Promise<Order> {
    return this.post<Order>(`/${id}/refund`, { amount, reason });
  }

  async getTracking(id: string): Promise<any> {
    return this.get<any>(`/${id}/tracking`);
  }

  async getLiveOrders(): Promise<Order[]> {
    return this.get<Order[]>('/live');
  }

  async getOrderAnalytics(dateRange?: { from: string; to: string }): Promise<any> {
    const queryParams = new URLSearchParams();

    if (dateRange) {
      queryParams.append('from', dateRange.from);
      queryParams.append('to', dateRange.to);
    }

    const endpoint = `/analytics${queryParams.toString() ? `?${queryParams}` : ''}`;
    return this.get<any>(endpoint);
  }
}