import { RiderStatus } from '@/app/data/types/rider';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RiderFilters, ApproveRiderRequest, SuspendRiderRequest, RiderZoneAssignment, AssignRiderToZoneRequest } from '../../api/repositories/rider-repository';
import { RepositoryFactory } from '../../api/repository-factory';
import { VendorRepository } from '../../api/repositories/vendor-repository';

const riderRepository = RepositoryFactory.rider;
const vendorRepository = new VendorRepository(); // For accessing zones

// Hook for fetching all riders with filters
export const useRiders = (filters?: RiderFilters) => {
  return useQuery({
    queryKey: ['riders', filters],
    queryFn: () => riderRepository.getAllRiders(filters),
    staleTime: 10000, // Consider data stale after 10 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchInterval: 60000, // Auto-refresh every minute
  });
};

// Hook for fetching online riders
export const useOnlineRiders = () => {
  return useQuery({
    queryKey: ['riders', 'online'],
    queryFn: () => riderRepository.getOnlineRiders(),
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 5000, // Consider data stale after 5 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Hook for fetching available riders (without active assignments)
export const useAvailableRiders = () => {
  return useQuery({
    queryKey: ['riders', 'available'],
    queryFn: () => riderRepository.getAvailableRiders(),
    refetchInterval: 20000, // Refresh every 20 seconds
    staleTime: 5000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

// Hook for approving rider
export const useApproveRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: ApproveRiderRequest }) =>
      riderRepository.approve(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for rejecting rider
export const useRejectRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      riderRepository.reject(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for suspending rider
export const useSuspendRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: string; request: SuspendRiderRequest }) =>
      riderRepository.suspend(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for activating rider
export const useActivateRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => riderRepository.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for updating rider status
export const useUpdateRiderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: RiderStatus; notes?: string }) =>
      riderRepository.updateStatus(id, status, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for getting rider location
export const useRiderLocation = (riderId: string) => {
  return useQuery({
    queryKey: ['riders', riderId, 'location'],
    queryFn: () => riderRepository.getLocation(riderId),
    enabled: !!riderId,
    refetchInterval: 10000, // Refresh every 10 seconds for live location
    staleTime: 5000,
  });
};

// Hook for rider performance metrics
export const useRiderPerformanceMetrics = (
  riderId: string,
  dateRange?: { from: string; to: string }
) => {
  return useQuery({
    queryKey: ['riders', riderId, 'performance', dateRange],
    queryFn: () => riderRepository.getPerformanceMetrics(riderId, dateRange),
    enabled: !!riderId,
  });
};

// Hook for rider delivery history
export const useRiderDeliveryHistory = (riderId: string, filters?: any) => {
  return useQuery({
    queryKey: ['riders', riderId, 'deliveries', filters],
    queryFn: () => riderRepository.getDeliveryHistory(riderId, filters),
    enabled: !!riderId,
  });
};

// Hook for fetching rider zone assignments
export const useRiderZones = (riderId: string) => {
  return useQuery({
    queryKey: ['riders', riderId, 'zones'],
    queryFn: () => riderRepository.getRiderZoneAssignments(riderId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!riderId,
    retry: 2,
  });
};

// Hook for assigning rider to zone
export const useAssignRiderToZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ riderId, request }: { riderId: string; request: AssignRiderToZoneRequest }) =>
      riderRepository.assignRiderToZone(riderId, request),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['riders', variables.riderId, 'zones'] });
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for removing rider from zone
export const useRemoveRiderFromZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ riderId, zoneId }: { riderId: string; zoneId: string }) =>
      riderRepository.removeRiderFromZone(riderId, zoneId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['riders', variables.riderId, 'zones'] });
      queryClient.invalidateQueries({ queryKey: ['riders'] });
    },
  });
};

// Hook for fetching available zones (reuse from vendor)
export const useAvailableZones = () => {
  return useQuery({
    queryKey: ['availableZones'],
    queryFn: () => vendorRepository.getAvailableZones(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    retry: 2,
  });
};