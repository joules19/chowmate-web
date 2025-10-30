import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { PromotionRepository } from '@/app/lib/api/repositories/promotion-repository';

// Create singleton instance
const promotionRepo = new PromotionRepository();

// Query Keys
const PROMOTION_KEYS = {
  all: ['promotions'] as const,
  lists: () => [...PROMOTION_KEYS.all, 'list'] as const,
  list: (filters: PromotionFilters) => [...PROMOTION_KEYS.lists(), filters] as const,
  details: () => [...PROMOTION_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PROMOTION_KEYS.details(), id] as const,
  stats: () => [...PROMOTION_KEYS.all, 'stats'] as const,
  eligibleProducts: () => [...PROMOTION_KEYS.all, 'eligible-products'] as const,
  vendors: () => [...PROMOTION_KEYS.all, 'vendors'] as const,
  categories: () => [...PROMOTION_KEYS.all, 'categories'] as const,
};

// Query Hooks
export const usePromotions = (filters: PromotionFilters) => {
  return useQuery({
    queryKey: PROMOTION_KEYS.list(filters),
    queryFn: () => promotionRepo.getPromotions(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePromotion = (id: string) => {
  return useQuery({
    queryKey: PROMOTION_KEYS.detail(id),
    queryFn: () => promotionRepo.getPromotion(id),
    enabled: !!id,
  });
};

export const usePromotionStats = () => {
  return useQuery({
    queryKey: PROMOTION_KEYS.stats(),
    queryFn: () => promotionRepo.getPromotionStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEligibleProducts = (params?: {
  vendorId?: string;
  categoryId?: string;
  excludeExisting?: boolean;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...PROMOTION_KEYS.eligibleProducts(), params],
    queryFn: () => promotionRepo.getEligibleProducts(params),
    enabled: !!(params?.search || params?.vendorId || params?.categoryId || params?.excludeExisting),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useVendors = () => {
  return useQuery({
    queryKey: PROMOTION_KEYS.vendors(),
    queryFn: () => promotionRepo.getVendors(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: PROMOTION_KEYS.categories(),
    queryFn: () => promotionRepo.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation Hooks
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProductPromotionDto) => promotionRepo.createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.eligibleProducts() });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductPromotionDto }) =>
      promotionRepo.updatePromotion(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionRepo.deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.eligibleProducts() });
    },
  });
};

export const useTogglePromotionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => promotionRepo.togglePromotionStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
    },
  });
};

export const useCreateBulkPromotions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BulkPromotionDto) => promotionRepo.createBulkPromotions(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.eligibleProducts() });
    },
  });
};

export const useBulkDeletePromotions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => promotionRepo.bulkDeletePromotions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.eligibleProducts() });
    },
  });
};

export const useBulkDeactivatePromotions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) => promotionRepo.bulkDeactivatePromotions(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PROMOTION_KEYS.stats() });
    },
  });
};