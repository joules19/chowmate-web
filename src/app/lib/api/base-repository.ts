import { PaginatedResponse, SearchFilters } from "../../data/types/api";
import apiClient, { ApiResponse, apiRequest } from "./axios-config";

// Define common data types for repository operations
interface BulkActionRequest {
  action: string;
  ids: string[];
  data?: Record<string, unknown>;
  [key: string]: unknown; // Add index signature to conform to Record<string, unknown>
}

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

  protected async post<U>(
    path: string = '',
    data?: Record<string, unknown> | FormData | string
  ): Promise<U> {
    return apiRequest(() =>
      apiClient.post<ApiResponse<U>>(`${this.endpoint}${path}`, data)
    );
  }

  protected async put<U>(
    path: string = '',
    data?: Record<string, unknown> | FormData | string
  ): Promise<U> {
    return apiRequest(() =>
      apiClient.put<ApiResponse<U>>(`${this.endpoint}${path}`, data)
    );
  }

  protected async patch<U>(
    path: string = '',
    data?: Record<string, unknown> | FormData | string
  ): Promise<U> {
    return apiRequest(() =>
      apiClient.patch<ApiResponse<U>>(`${this.endpoint}${path}`, data)
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
    return this.post<T>('', data as Record<string, unknown>);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.put<T>(`/${id}`, data as Record<string, unknown>);
  }

  async delete(id: string): Promise<void> {
    return this.deleteRequest<void>(`/${id}`);
  }

  async bulkAction(
    action: string,
    ids: string[],
    data?: Record<string, unknown>
  ): Promise<void> {
    const requestData: BulkActionRequest = { action, ids, data };
    return this.post<void>('/bulk-action', requestData);
  }
}