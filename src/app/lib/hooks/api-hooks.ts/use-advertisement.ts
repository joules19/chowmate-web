import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { AdvertisementRepository } from '../../api/repositories/advertisement-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import { Advertisement, AdvertisementFilters, CreateAdvertisementRequest, UpdateAdvertisementRequest } from '@/app/data/types/advertisement';

// Create singleton instance
const advertisementRepo = new AdvertisementRepository();

export const ADVERTISEMENT_QUERY_KEYS = {
    all: ['advertisements'] as const,
    lists: () => [...ADVERTISEMENT_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: AdvertisementFilters) => [...ADVERTISEMENT_QUERY_KEYS.lists(), filters] as const,
    details: () => [...ADVERTISEMENT_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...ADVERTISEMENT_QUERY_KEYS.details(), id] as const,
};

export function useAdvertisements(filters?: AdvertisementFilters): UseQueryResult<PaginatedResponse<Advertisement>, Error> {
    return useQuery({
        queryKey: ADVERTISEMENT_QUERY_KEYS.list(filters),
        queryFn: () => advertisementRepo.getAdvertisements(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useAdvertisement(advertisementId: string): UseQueryResult<Advertisement, Error> {
    return useQuery({
        queryKey: ADVERTISEMENT_QUERY_KEYS.detail(advertisementId),
        queryFn: () => advertisementRepo.getById(advertisementId),
        staleTime: 5 * 60 * 1000,
        enabled: !!advertisementId,
        retry: 2,
    });
}

// Mutation hooks for advertisement actions
export function useCreateAdvertisement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) =>
            advertisementRepo.createAdvertisementWithFormData(formData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_QUERY_KEYS.lists() });
        },
    });
}

export function useUpdateAdvertisement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ advertisementId, request, formData }: { 
            advertisementId: string; 
            request?: UpdateAdvertisementRequest;
            formData?: FormData;
        }) => {
            if (formData) {
                return advertisementRepo.updateAdvertisementWithFormData(advertisementId, formData);
            } else if (request) {
                return advertisementRepo.updateAdvertisement(advertisementId, request);
            }
            throw new Error('Either request or formData must be provided');
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_QUERY_KEYS.detail(variables.advertisementId) });
        },
    });
}

export function useToggleAdvertisementStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (advertisementId: string) =>
            advertisementRepo.toggleStatus(advertisementId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_QUERY_KEYS.detail(variables) });
        },
    });
}

export function useDeleteAdvertisement() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (advertisementId: string) =>
            advertisementRepo.deleteAdvertisement(advertisementId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADVERTISEMENT_QUERY_KEYS.lists() });
        },
    });
}