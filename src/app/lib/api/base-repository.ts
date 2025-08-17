import { ApiResponse, PaginatedResponse, SearchFilters } from "../../data/types/api";

export abstract class BaseRepository<T> {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async request<U>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<U>> {
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  async getAll(filters?: SearchFilters): Promise<PaginatedResponse<T>> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString() ? `?${queryParams}` : '';
    const response = await this.request<PaginatedResponse<T>>(endpoint);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch data');
    }
    
    return response.data;
  }

  async getById(id: string): Promise<T> {
    const response = await this.request<T>(`/${id}`);
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to fetch item');
    }
    
    return response.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await this.request<T>('', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create item');
    }
    
    return response.data;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const response = await this.request<T>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to update item');
    }
    
    return response.data;
  }

  async delete(id: string): Promise<void> {
    const response = await this.request<void>(`/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete item');
    }
  }

  async bulkAction(action: string, ids: string[], data?: any): Promise<void> {
    const response = await this.request<void>('/bulk-action', {
      method: 'POST',
      body: JSON.stringify({ action, ids, data }),
    });
    
    if (!response.success) {
      throw new Error(response.message || 'Bulk action failed');
    }
  }
}