import { PaginatedResponse, SearchFilters } from "../../data/types/api";
import apiClient, { ApiResponse, apiRequest } from "./axios-config";
import { AxiosResponse } from "axios";

export abstract class BaseRepository<T> {
  protected endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  protected async get<U>(path: string = ''): Promise<U> {
    return apiRequest(() => 
      apiClient.get<ApiResponse<U>>(`${this.endpoint}${path}`)
    );
  }

  protected async post<U>(path: string = '', data?: any): Promise<U> {
    return apiRequest(() => 
      apiClient.post<ApiResponse<U>>(`${this.endpoint}${path}`, data)
    );
  }

  protected async put<U>(path: string = '', data?: any): Promise<U> {
    return apiRequest(() => 
      apiClient.put<ApiResponse<U>>(`${this.endpoint}${path}`, data)
    );
  }

  protected async deleteRequest<U>(path: string = ''): Promise<U> {
    return apiRequest(() => 
      apiClient.delete<ApiResponse<U>>(`${this.endpoint}${path}`)
    );
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

    const path = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<PaginatedResponse<T>>(path);
  }

  async getById(id: string): Promise<T> {
    return this.get<T>(`/${id}`);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.post<T>('', data);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.put<T>(`/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return this.deleteRequest<void>(`/${id}`);
  }

  async bulkAction(action: string, ids: string[], data?: any): Promise<void> {
    return this.post<void>('/bulk-action', { action, ids, data });
  }
}