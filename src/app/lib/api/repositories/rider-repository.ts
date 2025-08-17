import { BaseRepository } from "../base-repository";
import { Rider, RiderStatus } from "../../../data/types/entities";
import { ApiResponse } from "../../../data/types/api";

export class RiderRepository extends BaseRepository<Rider> {
  constructor() {
    super('/api/admin/riders');
  }

  async approve(id: string, notes?: string): Promise<Rider> {
    const response = await this.request<Rider>(`/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to approve rider');
    }
    
    return response.data;
  }

  async reject(id: string, reason: string): Promise<Rider> {
    const response = await this.request<Rider>(`/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to reject rider');
    }
    
    return response.data;
  }

  async suspend(id: string, reason: string): Promise<Rider> {
    const response = await this.request<Rider>(`/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to suspend rider');
    }
    
    return response.data;
  }

  async activate(id: string): Promise<Rider> {
    const response = await this.request<Rider>(`/${id}/activate`, {
      method: 'POST',
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to activate rider');
    }
    
    return response.data;
  }

  async updateStatus(id: string, status: RiderStatus, notes?: string): Promise<Rider> {
    const response = await this.request<Rider>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update rider status');
    }
    
    return response.data;
  }

  async getLocation(id: string): Promise<any> {
    const response = await this.request<any>(`/${id}/location`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch rider location');
    }
    
    return response.data;
  }

  async getOnlineRiders(): Promise<Rider[]> {
    const response = await this.request<Rider[]>('/online');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch online riders');
    }
    
    return response.data;
  }

  async getPerformanceMetrics(id: string, dateRange?: { from: string; to: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (dateRange) {
      queryParams.append('from', dateRange.from);
      queryParams.append('to', dateRange.to);
    }

    const endpoint = `/${id}/performance${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<any>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch performance metrics');
    }
    
    return response.data;
  }

  async getDeliveryHistory(id: string, filters?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/${id}/deliveries${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<any>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch delivery history');
    }
    
    return response.data;
  }
}