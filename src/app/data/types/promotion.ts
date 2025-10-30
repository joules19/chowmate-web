import { BaseEntity } from './base-entity';

export interface ProductPromotion extends BaseEntity {
  id: string;
  productId: string;
  productName: string;
  vendorId: string;
  vendorName: string;
  categoryName: string;
  basePrice: number;
  discountPercentage?: number;
  discountAmount?: number;
  discountedPrice: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProductPromotionDto {
  productId: string;
  discountPercentage?: number;
  discountAmount?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
  [key: string]: unknown;
}

export interface UpdateProductPromotionDto {
  discountPercentage?: number;
  discountAmount?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  description?: string;
  [key: string]: unknown;
}

export interface BulkPromotionDto {
  productIds: string[];
  vendorId?: string;
  categoryId?: string;
  discountPercentage?: number;
  discountAmount?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  [key: string]: unknown;
}

export interface PromotionFilters {
  pageNumber: number;
  pageSize: number;
  vendorId?: string;
  categoryId?: string;
  isActive?: boolean;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PromotionStats {
  totalPromotions: number;
  activePromotions: number;
  expiredPromotions: number;
  scheduledPromotions: number;
  totalDiscountValue: number;
  productsWithPromotions: number;
  vendorsWithPromotions: number;
}

export interface EligibleProduct {
  id: string;
  productName: string;
  basePrice: number;
  vendorId: string;
  vendorName: string;
  categoryId: string;
  categoryName: string;
  hasActivePromotion: boolean;
}

export interface Vendor {
  id: string;
  businessName: string;
}

export interface Category {
  id: string;
  categoryName: string;
}