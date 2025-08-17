import { BaseRepository } from "../base-repository";
import { Order, OrderStatus } from "../../../data/types/entities";
import { ApiResponse } from "../../../data/types/api";

export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super('/api/admin/orders');
  }

  async updateStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    const response = await this.request<Order>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update order status');
    }
    
    return response.data;
  }

  async assignRider(id: string, riderId: string): Promise<Order> {
    const response = await this.request<Order>(`/${id}/assign-rider`, {
      method: 'POST',
      body: JSON.stringify({ riderId }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to assign rider');
    }
    
    return response.data;
  }

  async cancel(id: string, reason: string): Promise<Order> {
    const response = await this.request<Order>(`/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to cancel order');
    }
    
    return response.data;
  }

  async refund(id: string, amount?: number, reason?: string): Promise<Order> {
    const response = await this.request<Order>(`/${id}/refund`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to process refund');
    }
    
    return response.data;
  }

  async getTracking(id: string): Promise<any> {
    const response = await this.request<any>(`/${id}/tracking`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch tracking data');
    }
    
    return response.data;
  }

  async getLiveOrders(): Promise<Order[]> {
    const response = await this.request<Order[]>('/live');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch live orders');
    }
    
    return response.data;
  }

  async getOrderAnalytics(dateRange?: { from: string; to: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (dateRange) {
      queryParams.append('from', dateRange.from);
      queryParams.append('to', dateRange.to);
    }

    const endpoint = `/analytics${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<any>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch order analytics');
    }
    
    return response.data;
  }
}