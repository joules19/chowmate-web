import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { VendorRepository } from '../../api/repositories/vendor-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import { Zone } from '@/app/data/types/location';

import { ActivateVendorRequest, ApproveVendorRequest, AssignVendorToZoneRequest, RejectVendorRequest, SendInstructionRequest, SuspendVendorRequest, UpdateVendorStatusRequest, VendorDetails, VendorFilters, VendorStats, VendorSummary, VendorZoneAssignment } from '@/app/data/types/vendor';

// Create singleton instance
const vendorRepo = new VendorRepository();

export const VENDOR_QUERY_KEYS = {
    all: ['vendors'] as const,
    lists: () => [...VENDOR_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: VendorFilters) => [...VENDOR_QUERY_KEYS.lists(), filters] as const,
    details: () => [...VENDOR_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...VENDOR_QUERY_KEYS.details(), id] as const,
    zones: (id: string) => [...VENDOR_QUERY_KEYS.detail(id), 'zones'] as const,
    stats: (dateFrom?: string, dateTo?: string) => [...VENDOR_QUERY_KEYS.all, 'stats', dateFrom, dateTo] as const,
    activities: (id: string, limit?: number) => [...VENDOR_QUERY_KEYS.detail(id), 'activities', limit] as const,
};

export function useVendors(filters?: VendorFilters): UseQueryResult<PaginatedResponse<VendorSummary>, Error> {
    return useQuery({
        queryKey: VENDOR_QUERY_KEYS.list(filters),
        queryFn: () => vendorRepo.getAllVendors(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useVendor(vendorId: string): UseQueryResult<VendorDetails, Error> {
    return useQuery({
        queryKey: VENDOR_QUERY_KEYS.detail(vendorId),
        queryFn: () => vendorRepo.getVendorById(vendorId),
        staleTime: 5 * 60 * 1000,
        enabled: !!vendorId,
        retry: 2,
    });
}

export function useVendorZones(vendorId: string): UseQueryResult<VendorZoneAssignment[], Error> {
    return useQuery({
        queryKey: VENDOR_QUERY_KEYS.zones(vendorId),
        queryFn: () => vendorRepo.getVendorZoneAssignments(vendorId),
        staleTime: 5 * 60 * 1000,
        enabled: !!vendorId,
        retry: 2,
    });
}

export function useAvailableZones(): UseQueryResult<Zone[], Error> {
    return useQuery({
        queryKey: ['availableZones'],
        queryFn: () => vendorRepo.getAvailableZones(),
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
        retry: 2,
    });
}

export function useVendorStats(dateFrom?: string, dateTo?: string): UseQueryResult<VendorStats, Error> {
    return useQuery({
        queryKey: VENDOR_QUERY_KEYS.stats(dateFrom, dateTo),
        queryFn: () => vendorRepo.getVendorStats(dateFrom, dateTo),
        staleTime: 10 * 60 * 1000, // 10 minutes
        refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
        retry: 2,
    });
}

export function useVendorActivities(vendorId: string, limit: number = 20) {
    return useQuery({
        queryKey: VENDOR_QUERY_KEYS.activities(vendorId, limit),
        queryFn: () => vendorRepo.getVendorActivities(vendorId, limit),
        staleTime: 5 * 60 * 1000,
        enabled: !!vendorId,
        retry: 2,
    });
}

// Mutation hooks for vendor actions
export function useApproveVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: ApproveVendorRequest }) =>
            vendorRepo.approveVendor(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats() });
        },
    });
}

export function useRejectVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: RejectVendorRequest }) =>
            vendorRepo.rejectVendor(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats() });
        },
    });
}

export function useSuspendVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: SuspendVendorRequest }) =>
            vendorRepo.suspendVendor(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats() });
        },
    });
}

export function useActivateVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: ActivateVendorRequest }) =>
            vendorRepo.activateVendor(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats() });
        },
    });
}

export function useUpdateVendorStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: UpdateVendorStatusRequest }) =>
            vendorRepo.updateVendorStatus(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats() });
        },
    });
}

export function useAssignVendorToZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: AssignVendorToZoneRequest }) =>
            vendorRepo.assignVendorToZone(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.zones(variables.vendorId) });
        },
    });
}

export function useRemoveVendorFromZone() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, zoneId }: { vendorId: string; zoneId: string }) =>
            vendorRepo.removeVendorFromZone(vendorId, zoneId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.zones(variables.vendorId) });
        },
    });
}

export function useSendInstructionToVendor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, request }: { vendorId: string; request: SendInstructionRequest }) =>
            vendorRepo.sendInstruction(vendorId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.activities(variables.vendorId) });
        },
    });
}

export function useSendBackToPending() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ vendorId, message }: { vendorId: string; message: string }) =>
            vendorRepo.sendBackToPending(vendorId, message),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.detail(variables.vendorId) });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.stats() });
            queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.activities(variables.vendorId) });
        },
    });
}