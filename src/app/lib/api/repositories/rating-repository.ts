import {
  VendorRatingDto,
  RiderRatingDto,
  RatingFilters
} from '@/app/data/types/rating';
import apiClient, { apiRequest, ApiResponse } from '../axios-config';
import { PaginatedResponse } from '@/app/data/types/api';

export class RatingRepository {
  async getVendorReviews(vendorId: string, filters?: RatingFilters): Promise<PaginatedResponse<VendorRatingDto>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `api/vendor-rating/vendor/${vendorId}?${queryParams}`
      : `api/vendor-rating/vendor/${vendorId}`;

    return apiRequest(() =>
      apiClient.get<ApiResponse<PaginatedResponse<VendorRatingDto>>>(endpoint)
    );
  }

  async getRiderReviews(riderId: string, filters?: RatingFilters): Promise<PaginatedResponse<RiderRatingDto>> {
    const queryParams = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = queryParams.toString()
      ? `api/rider-rating/rider/${riderId}?${queryParams}`
      : `api/rider-rating/rider/${riderId}`;

    return apiRequest(() =>
      apiClient.get<ApiResponse<PaginatedResponse<RiderRatingDto>>>(endpoint)
    );
  }
}
