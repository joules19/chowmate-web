import { BaseRepository } from '../base-repository';
import { Advertisement, AdvertisementFilters, CreateAdvertisementRequest, UpdateAdvertisementRequest } from '@/app/data/types/advertisement';
import { PaginatedResponse } from '@/app/data/types/api';

export class AdvertisementRepository extends BaseRepository<Advertisement> {
  constructor() {
    super('/api/admin/advertisements');
  }

  async getAdvertisements(filters?: AdvertisementFilters): Promise<PaginatedResponse<Advertisement>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const path = queryParams.toString() ? `?${queryParams}` : '';

    // Call the API and get the response
    const response = await this.get<Advertisement[]>(path);

    // The API returns data directly as an array, so we need to transform it to PaginatedResponse format
    const items = Array.isArray(response) ? response : [];

    // Since the current API doesn't return pagination info, we'll create a mock pagination structure
    // This should be updated when the API supports proper pagination
    return {
      items: items,
      totalCount: items.length,
      pageNumber: filters?.pageNumber || 1,
      pageSize: filters?.pageSize || 10
    };
  }

  async createAdvertisement(data: CreateAdvertisementRequest): Promise<Advertisement> {
    return this.create(data as Partial<Advertisement>);
  }

  async createAdvertisementWithFormData(formData: FormData): Promise<CreateAdvertisementRequest> {
    return this.post<CreateAdvertisementRequest>('', formData);
  }

  async updateAdvertisement(id: string, data: UpdateAdvertisementRequest): Promise<Advertisement> {
    return this.update(id, data as Partial<Advertisement>);
  }

  async updateAdvertisementWithFormData(id: string, formData: FormData): Promise<Advertisement> {
    return this.put<Advertisement>(`/${id}`, formData);
  }

  async toggleStatus(id: string): Promise<Advertisement> {
    return this.put<Advertisement>(`/${id}/toggle-status`);
  }

  async deleteAdvertisement(id: string): Promise<void> {
    return this.delete(id);
  }
}