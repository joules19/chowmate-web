import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { RatingRepository } from '../../api/repositories/rating-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import {
  VendorRatingDto,
  RiderRatingDto,
  RatingFilters
} from '@/app/data/types/rating';

// Create singleton instance
const ratingRepo = new RatingRepository();

export const RATING_QUERY_KEYS = {
  all: ['ratings'] as const,
  vendors: () => [...RATING_QUERY_KEYS.all, 'vendors'] as const,
  vendorReviews: (vendorId: string, filters?: RatingFilters) => [...RATING_QUERY_KEYS.vendors(), vendorId, 'reviews', filters] as const,
  riders: () => [...RATING_QUERY_KEYS.all, 'riders'] as const,
  riderReviews: (riderId: string, filters?: RatingFilters) => [...RATING_QUERY_KEYS.riders(), riderId, 'reviews', filters] as const,
};

export function useVendorReviews(vendorId: string, filters?: RatingFilters): UseQueryResult<PaginatedResponse<VendorRatingDto>, Error> {
  return useQuery({
    queryKey: RATING_QUERY_KEYS.vendorReviews(vendorId, filters),
    queryFn: () => ratingRepo.getVendorReviews(vendorId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!vendorId,
    retry: 2,
  });
}

export function useRiderReviews(riderId: string, filters?: RatingFilters): UseQueryResult<PaginatedResponse<RiderRatingDto>, Error> {
  return useQuery({
    queryKey: RATING_QUERY_KEYS.riderReviews(riderId, filters),
    queryFn: () => ratingRepo.getRiderReviews(riderId, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!riderId,
    retry: 2,
  });
}
