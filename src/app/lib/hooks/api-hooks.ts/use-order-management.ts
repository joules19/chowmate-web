import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RepositoryFactory } from '../../api/repository-factory';
import { AssignmentResultDto, AssignRiderToOrderRequest } from '@/app/data/types/order';
import { OrderFilters } from '../../api/repositories/order-repository';

const orderRepository = RepositoryFactory.order;

// Hook for fetching orders pending assignment (preparing/noriderfound status)
export const usePendingOrdersAssignment = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['orders', 'pending-assignment'],
    queryFn: () => orderRepository.getOrdersPendingAssignment(),
    refetchInterval: options?.enabled ? 45000 : false, // 45s when enabled, off when page not active
    staleTime: 15000, // Consider data stale after 15 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
};



// Hook for assigning rider to order
export const useAssignRiderToOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AssignRiderToOrderRequest) =>
      orderRepository.assignRiderToOrder(request),
    onSuccess: (data: AssignmentResultDto) => {
      // Invalidate and refetch pending orders and available riders
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending-assignment'] });
      queryClient.invalidateQueries({ queryKey: ['riders', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // Refresh general orders list

      return data;
    },
  });
};

// Hook for assigning rider to order
export const useReplaceOrderRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AssignRiderToOrderRequest) =>
      orderRepository.replaceOrderRider(request),
    onSuccess: (data: AssignmentResultDto) => {
      // Invalidate and refetch pending orders and available riders
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending-assignment'] });
      queryClient.invalidateQueries({ queryKey: ['riders', 'available'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // Refresh general orders list

      return data;
    },
  });
};

// Hook for fetching live orders (for tracking)
export const useLiveOrders = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['orders', 'live'],
    queryFn: () => orderRepository.getLiveOrders(),
    refetchInterval: options?.enabled ? 30000 : false, // 30s when enabled, off when not active
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    enabled: options?.enabled ?? true,
  });
};

// Hook for fetching paginated orders with filters
export const useOrders = (filters: OrderFilters = {}, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['orders', 'paginated', filters],
    queryFn: () => orderRepository.getAllOrders(filters),
    staleTime: 30000, // Consider data stale after 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: false, // Don't refetch on window focus for performance
    refetchInterval: options?.enabled ? 5 * 60 * 1000 : false, // 5 minutes when enabled, off otherwise
    enabled: options?.enabled ?? true,
  });
};

// Hook for order analytics
export const useOrderAnalytics = (dateRange?: { from: string; to: string }) => {
  return useQuery({
    queryKey: ['orders', 'analytics', dateRange],
    queryFn: () => orderRepository.getOrderAnalytics(dateRange),
    enabled: !!dateRange, // Only fetch when date range is provided
  });
};

// Hook for cancelling an order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cancellationReason }: { id: string; cancellationReason: string }) =>
      orderRepository.cancel(id, cancellationReason),
    onSuccess: () => {
      // Invalidate and refetch all order-related queries
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'pending-assignment'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'live'] });
      queryClient.invalidateQueries({ queryKey: ['orders', 'analytics'] });
    },
  });
};