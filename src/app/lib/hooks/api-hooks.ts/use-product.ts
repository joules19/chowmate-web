import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import {
  ProductRepository,
  Product,
  ProductDetail,
  ProductFilters,
  ApproveProductRequest,
  RejectProductRequest,
  UpdateProductStatusRequest,
  ProductStats
} from '../../api/repositories/product-repository';
import { PaginatedResponse } from '@/app/data/types/api';

// Create singleton instance
const productRepo = new ProductRepository();

export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: ProductFilters) => [...PRODUCT_QUERY_KEYS.lists(), filters] as const,
  details: () => [...PRODUCT_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PRODUCT_QUERY_KEYS.details(), id] as const,
  stats: () => [...PRODUCT_QUERY_KEYS.all, 'stats'] as const,
};

export function useProducts(filters?: ProductFilters): UseQueryResult<PaginatedResponse<Product>, Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(filters),
    queryFn: () => productRepo.getAllProducts(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useProduct(productId: string): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(productId),
    queryFn: () => productRepo.getProductById(productId),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
    retry: 2,
  });
}

export function useProductDetails(productId: string): UseQueryResult<ProductDetail, Error> {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.detail(productId), 'full'],
    queryFn: () => productRepo.getProductDetails(productId),
    staleTime: 5 * 60 * 1000,
    enabled: !!productId,
    retry: 2,
  });
}

export function useProductStats(): UseQueryResult<ProductStats, Error> {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.stats(),
    queryFn: () => productRepo.getProductStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 2,
  });
}

// Mutation hooks for product actions
export function useApproveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, request }: { productId: string; request: ApproveProductRequest }) =>
      productRepo.approveProduct(productId, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() });
    },
  });
}

export function useRejectProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, request }: { productId: string; request: RejectProductRequest }) =>
      productRepo.rejectProduct(productId, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, request }: { productId: string; request: UpdateProductStatusRequest }) =>
      productRepo.updateProductStatus(productId, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.detail(variables.productId) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.stats() });
    },
  });
}
