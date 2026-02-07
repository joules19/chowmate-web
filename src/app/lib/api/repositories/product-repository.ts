import { BaseRepository } from '../base-repository';
import { PaginatedResponse } from '@/app/data/types/api';

// Product types
export interface Product {
  id: string;
  productName: string;
  description?: string;
  basePrice: number;
  priceDescription?: string;
  status: string;
  vendorId: string;
  vendorName?: string;
  categoryId?: string;
  categoryName?: string;
  imageUrl?: string;
  createdAt: string;
  modifiedAt?: string;
  inStock: boolean;
  packId?: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isMain: boolean;
  displayOrder: number;
}

export interface ProductOption {
  id: string;
  name: string;
  additionalPrice: number;
  inStock: boolean;
  displayOrder: number;
}

export interface ProductOptionCategory {
  id: string;
  name: string;
  minOptions?: number;
  maxOptions?: number;
  isRequired: boolean;
  options: ProductOption[];
}

export interface ProductDetail {
  id: string;
  productName: string;
  description?: string;
  basePrice: number;
  priceDescription?: string;
  status: string;
  vendorId: string;
  vendorName?: string;
  categoryId?: string;
  categoryName?: string;
  createdAt: string;
  inStock: boolean;
  isAvailableForPickup: boolean;
  isAvailableForDelivery: boolean;
  preparationTime: string;
  images: ProductImage[];
  optionCategories: ProductOptionCategory[];
}

export interface ProductFilters {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
  vendorId?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ApproveProductRequest {
  notes?: string;
  notifyVendor?: boolean;
  [key: string]: unknown;
}

export interface RejectProductRequest {
  reason: string;
  notifyVendor?: boolean;
  [key: string]: unknown;
}

export interface UpdateProductStatusRequest {
  status: string;
  notes?: string;
  [key: string]: unknown;
}

export interface ProductStats {
  totalProducts: number;
  pendingApproval: number;
  active: number;
  rejected: number;
  outOfStock: number;
  discontinued: number;
}

export class ProductRepository extends BaseRepository<Product> {
  constructor() {
    super('api/admin/products');
  }

  async getAllProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (value instanceof Date) {
            queryParams.append(key, value.toISOString());
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    const endpoint = queryParams.toString() ? `?${queryParams}` : '';
    return this.get<PaginatedResponse<Product>>(endpoint);
  }

  async getProductById(productId: string): Promise<Product> {
    return this.get<Product>(`/${productId}`);
  }

  async getProductDetails(productId: string): Promise<ProductDetail> {
    return this.get<ProductDetail>(`/${productId}/details`);
  }

  async approveProduct(productId: string, request: ApproveProductRequest): Promise<{ id: string }> {
    return this.post<{ id: string }>(`/${productId}/approve`, request);
  }

  async rejectProduct(productId: string, request: RejectProductRequest): Promise<{ id: string }> {
    return this.post<{ id: string }>(`/${productId}/reject`, request);
  }

  async updateProductStatus(productId: string, request: UpdateProductStatusRequest): Promise<{ id: string }> {
    return this.put<{ id: string }>(`/${productId}/status`, request);
  }

  async getProductStats(): Promise<ProductStats> {
    return this.get<ProductStats>('/stats');
  }
}

export const productRepository = new ProductRepository();
