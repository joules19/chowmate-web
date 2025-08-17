import { BaseRepository } from "../base-repository";
import { ApplicationUser } from "../../../data/types/entities";
import { ApiResponse } from "../../../data/types/api";

export class UserRepository extends BaseRepository<ApplicationUser> {
  constructor() {
    super('/api/admin/users');
  }

  async suspend(id: string, reason: string): Promise<ApplicationUser> {
    const response = await this.request<ApplicationUser>(`/${id}/suspend`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to suspend user');
    }
    
    return response.data;
  }

  async activate(id: string): Promise<ApplicationUser> {
    const response = await this.request<ApplicationUser>(`/${id}/activate`, {
      method: 'POST',
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to activate user');
    }
    
    return response.data;
  }

  async updateRoles(id: string, roles: string[]): Promise<ApplicationUser> {
    const response = await this.request<ApplicationUser>(`/${id}/roles`, {
      method: 'PATCH',
      body: JSON.stringify({ roles }),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update user roles');
    }
    
    return response.data;
  }

  async resetPassword(id: string): Promise<{ tempPassword: string }> {
    const response = await this.request<{ tempPassword: string }>(`/${id}/reset-password`, {
      method: 'POST',
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to reset password');
    }
    
    return response.data;
  }

  async getActivityLog(id: string, filters?: any): Promise<any> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/${id}/activity${queryParams.toString() ? `?${queryParams}` : ''}`;
    const response = await this.request<any>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch activity log');
    }
    
    return response.data;
  }

  async getUserStats(): Promise<any> {
    const response = await this.request<any>('/stats');
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch user statistics');
    }
    
    return response.data;
  }

  async exportUsers(filters?: any): Promise<Blob> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/export${queryParams.toString() ? `?${queryParams}` : ''}`;
    
    const token = this.getAuthToken();
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error('Failed to export users');
    }

    return response.blob();
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }
}