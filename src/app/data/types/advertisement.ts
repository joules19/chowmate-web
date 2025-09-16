import { BaseEntity } from './base-entity';

export interface Advertisement extends BaseEntity {
  title: string;
  description: string;
  imageUrl: string;
  vendorId: string;
  vendorName?: string;
  businessType?: string;
  userType: 'customer' | 'vendor' | 'rider';
  backgroundColor: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'pink' | number;
  isActive: boolean;
  updatedAt?: string;
  modifiedAt?: string;
}

export interface CreateAdvertisementRequest extends Record<string, unknown> {
  title: string;
  description: string;
  imageUrl: string;
  vendorId: string;
  userType: 'customer' | 'vendor' | 'rider';
  backgroundColor?: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'pink';
}

export interface CreateAdvertisementFormData {
  title: string;
  description: string;
  image: File;
  vendorId: string;
  userType: 'customer' | 'vendor' | 'rider';
  backgroundColor?: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'pink';
}

export interface UpdateAdvertisementRequest extends Record<string, unknown> {
  title?: string;
  description?: string;
  imageUrl?: string;
  vendorId?: string;
  userType?: 'customer' | 'vendor' | 'rider';
  backgroundColor?: 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'pink';
}

export interface AdvertisementFilters extends Record<string, unknown> {
  search?: string;
  userType?: 'customer' | 'vendor' | 'rider';
  isActive?: boolean;
  vendorId?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type AdvertisementUserType = 'customer' | 'vendor' | 'rider';
export type AdvertisementBackgroundColor = 'default' | 'blue' | 'green' | 'orange' | 'purple' | 'pink';