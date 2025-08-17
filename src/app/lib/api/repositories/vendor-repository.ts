import { BaseRepository } from "../base-repository";
import { Vendor, VendorStatus } from "../../../data/types/entities";
import { ApiResponse } from "../../../data/types/api";

export class VendorRepository extends BaseRepository<Vendor> {
  constructor() {
    super('/api/admin/vendors');
  }

  async approve(id: string, notes?: string): Promise<Vendor> {
    const response = await this.request<Vendor>(`/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to approve vendor');
    }
    
    return response.data;
  }

  async reject(id: string, reason: string): Promise<Vendor> {
    const response = await this.request<Vendor>(`/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to reject vendor');
    }
    
    return response.data;
  }

  async suspend(id: string, reason: string): Promise<Vendor> {
    const response = await this.request<Vendor>(`/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to suspend vendor');
    }
    
    return response.data;
  }

  async activate(id: string): Promise<Vendor> {
    const response = await this.request<Vendor>(`/${id}/activate`, {
      method: 'POST',
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to activate vendor');
    }
    
    return response.data;
  }

  async updateStatus(id: string, status: VendorStatus, notes?: string): Promise<Vendor> {
    const response = await this.request<Vendor>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update vendor status');
    }
    
    return response.data;
  }

  async getAnalytics(id: string): Promise<any> {
    const response = await this.request<any>(`/${id}/analytics`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch vendor analytics');
    }
    
    return response.data;
  }

  async getOrderHistory(id: string, filters?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/${id}/orders${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<any>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch order history');
    }
    
    return response.data;
  }
}