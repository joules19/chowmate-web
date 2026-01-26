import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { StrikeRepository } from '../../api/repositories/strike-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import {
    StrikeDto,
    StrikeDetailsDto,
    CreateStrikeRequest,
    ResolveStrikeRequest,
    ReviewStrikeDisputeRequest,
    StrikeFilters,
    DisputedStrikeFilters,
    StrikeSummaryDto,
} from '@/app/data/types/strikes';

// Create singleton instance
const strikeRepo = new StrikeRepository();

export const STRIKE_QUERY_KEYS = {
    all: ['strikes'] as const,
    lists: () => [...STRIKE_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: StrikeFilters) => [...STRIKE_QUERY_KEYS.lists(), filters] as const,
    details: () => [...STRIKE_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...STRIKE_QUERY_KEYS.details(), id] as const,
    disputes: (filters?: DisputedStrikeFilters) => [...STRIKE_QUERY_KEYS.all, 'disputes', filters] as const,
    summary: (vendorId: string) => [...STRIKE_QUERY_KEYS.all, 'summary', vendorId] as const,
};

export function useStrikes(filters?: StrikeFilters): UseQueryResult<PaginatedResponse<StrikeDto>, Error> {
    return useQuery({
        queryKey: STRIKE_QUERY_KEYS.list(filters),
        queryFn: () => strikeRepo.getAllStrikes(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useStrike(strikeId: string): UseQueryResult<StrikeDetailsDto, Error> {
    return useQuery({
        queryKey: STRIKE_QUERY_KEYS.detail(strikeId),
        queryFn: () => strikeRepo.getStrikeById(strikeId),
        staleTime: 5 * 60 * 1000,
        enabled: !!strikeId,
        retry: 2,
    });
}

export function useDisputedStrikes(filters?: DisputedStrikeFilters): UseQueryResult<PaginatedResponse<StrikeDetailsDto>, Error> {
    return useQuery({
        queryKey: STRIKE_QUERY_KEYS.disputes(filters),
        queryFn: () => strikeRepo.listDisputedStrikes(filters),
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
        retry: 3,
    });
}

export function useVendorStrikeSummary(vendorId: string): UseQueryResult<StrikeSummaryDto, Error> {
    return useQuery({
        queryKey: STRIKE_QUERY_KEYS.summary(vendorId),
        queryFn: () => strikeRepo.getVendorStrikeSummary(vendorId),
        staleTime: 2 * 60 * 1000,
        enabled: !!vendorId,
        retry: 2,
    });
}

import { useToast } from '@/app/providers/ToastProvider';

// Mutation hooks for strike actions
export function useCreateStrike() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (request: CreateStrikeRequest) =>
            strikeRepo.createStrike(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STRIKE_QUERY_KEYS.lists() });
            showToast('Strike created successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to create strike', 'error');
        }
    });
}

export function useResolveStrike() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ strikeId, request }: { strikeId: string; request: ResolveStrikeRequest }) =>
            strikeRepo.resolveStrike(strikeId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: STRIKE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STRIKE_QUERY_KEYS.detail(variables.strikeId) });
            showToast('Strike resolved successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to resolve strike', 'error');
        }
    });
}

export function useReviewStrikeDispute() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ strikeId, request }: { strikeId: string; request: ReviewStrikeDisputeRequest }) =>
            strikeRepo.reviewStrikeDispute(strikeId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: STRIKE_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: STRIKE_QUERY_KEYS.disputes() });
            queryClient.invalidateQueries({ queryKey: STRIKE_QUERY_KEYS.detail(variables.strikeId) });
            showToast('Strike dispute reviewed successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to review dispute', 'error');
        }
    });
}
