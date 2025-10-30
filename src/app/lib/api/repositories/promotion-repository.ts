import { BaseRepository } from '../base-repository';
import apiClient, { ApiResponse, apiRequest } from '../axios-config';
import { 
  ProductPromotion, 
  PromotionFilters, 
  CreateProductPromotionDto, 
  UpdateProductPromotionDto,
  BulkPromotionDto,
  PromotionStats,
  EligibleProduct,
  Vendor,
  Category
} from '@/app/data/types/promotion';
import { PaginatedResponse } from '@/app/data/types/api';

export class PromotionRepository extends BaseRepository<ProductPromotion> {
  constructor() {
    super('/api/admin/product-promotions');
  }

  async getPromotions(filters?: PromotionFilters): Promise<PaginatedResponse<ProductPromotion>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const path = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<PaginatedResponse<ProductPromotion>>(path);
  }

  async getPromotion(id: string): Promise<ProductPromotion> {
    return this.get<ProductPromotion>(`/${id}`);
  }

  async getPromotionStats(): Promise<PromotionStats> {
    return this.get<PromotionStats>('/stats');
  }

  async createPromotion(data: CreateProductPromotionDto): Promise<ProductPromotion> {
    return this.post<ProductPromotion>('', data);
  }

  async updatePromotion(id: string, data: UpdateProductPromotionDto): Promise<ProductPromotion> {
    return this.put<ProductPromotion>(`/${id}`, data);
  }

  async deletePromotion(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }

  async togglePromotionStatus(id: string): Promise<{ isActive: boolean }> {
    return this.patch<{ isActive: boolean }>(`/${id}/toggle-status`, {});
  }

  async createBulkPromotions(data: BulkPromotionDto): Promise<{ createdCount: number; skippedCount: number; errors: string[] }> {
    return this.post<{ createdCount: number; skippedCount: number; errors: string[] }>('/bulk', data);
  }

  async bulkDeletePromotions(promotionIds: string[]): Promise<void> {
    // For DELETE requests with body data, we need to handle it differently
    return apiRequest(() =>
      apiClient.delete<ApiResponse<void>>('/api/admin/product-promotions/bulk', { data: promotionIds })
    ) as Promise<void>;
  }

  async bulkDeactivatePromotions(promotionIds: string[]): Promise<void> {
    return this.patch<void>('/bulk/deactivate', promotionIds as any);
  }

  async getEligibleProducts(params?: {
    vendorId?: string;
    categoryId?: string;
    excludeExisting?: boolean;
    search?: string;
  }): Promise<EligibleProduct[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.vendorId) queryParams.append('vendorId', params.vendorId);
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.excludeExisting !== undefined) queryParams.append('excludeExisting', params.excludeExisting.toString());
    if (params?.search) queryParams.append('search', params.search);

    const path = queryParams.toString() ? `/eligible-products?${queryParams}` : '/eligible-products';
    return this.get<EligibleProduct[]>(path);
  }

  async getVendors(): Promise<Vendor[]> {
    // This might need to be adjusted based on your actual vendors API endpoint
    return this.get<Vendor[]>('/../vendors/dropdown');
  }

  async getCategories(): Promise<Category[]> {
    // This might need to be adjusted based on your actual categories API endpoint
    return this.get<Category[]>('/../categories/dropdown');
  }
}