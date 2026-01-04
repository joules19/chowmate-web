import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { DeductionRepository } from '../../api/repositories/deduction-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import {
    DeductionDto,
    DeductionDetailsDto,
    CreateDeductionRequest,
    UpdateDeductionRequest,
    CancelDeductionRequest,
    ReviewDisputeRequest,
    DeductionFilters,
} from '@/app/data/types/deductions';

// Create singleton instance
const deductionRepo = new DeductionRepository();

export const DEDUCTION_QUERY_KEYS = {
    all: ['deductions'] as const,
    lists: () => [...DEDUCTION_QUERY_KEYS.all, 'list'] as const,
    list: (filters?: DeductionFilters) => [...DEDUCTION_QUERY_KEYS.lists(), filters] as const,
    details: () => [...DEDUCTION_QUERY_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...DEDUCTION_QUERY_KEYS.details(), id] as const,
    disputes: (filters?: DeductionFilters) => [...DEDUCTION_QUERY_KEYS.all, 'disputes', filters] as const,
};

export function useDeductions(filters?: DeductionFilters): UseQueryResult<PaginatedResponse<DeductionDto>, Error> {
    return useQuery({
        queryKey: DEDUCTION_QUERY_KEYS.list(filters),
        queryFn: () => deductionRepo.getAllDeductions(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
        refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
        retry: 3,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    });
}

export function useDeduction(deductionId: string): UseQueryResult<DeductionDetailsDto, Error> {
    return useQuery({
        queryKey: DEDUCTION_QUERY_KEYS.detail(deductionId),
        queryFn: () => deductionRepo.getDeductionById(deductionId),
        staleTime: 5 * 60 * 1000,
        enabled: !!deductionId,
        retry: 2,
    });
}

export function useDisputedDeductions(filters?: DeductionFilters): UseQueryResult<PaginatedResponse<DeductionDto>, Error> {
    return useQuery({
        queryKey: DEDUCTION_QUERY_KEYS.disputes(filters),
        queryFn: () => deductionRepo.listDisputedDeductions(filters),
        staleTime: 2 * 60 * 1000,
        refetchInterval: 5 * 60 * 1000,
        retry: 3,
    });
}

import { useToast } from '@/app/providers/ToastProvider';

// Mutation hooks for deduction actions
export function useCreateDeduction() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (request: CreateDeductionRequest) =>
            deductionRepo.createDeduction(request),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.lists() });
            showToast('Deduction created successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to create deduction', 'error');
        }
    });
}

export function useUpdateDeduction() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ deductionId, request }: { deductionId: string; request: UpdateDeductionRequest }) =>
            deductionRepo.updateDeduction(deductionId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.detail(variables.deductionId) });
            showToast('Deduction updated successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to update deduction', 'error');
        }
    });
}

export function useCancelDeduction() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ deductionId, request }: { deductionId: string; request: CancelDeductionRequest }) =>
            deductionRepo.cancelDeduction(deductionId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.detail(variables.deductionId) });
            showToast('Deduction cancelled successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to cancel deduction', 'error');
        }
    });
}

export function useReviewDispute() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: ({ deductionId, request }: { deductionId: string; request: ReviewDisputeRequest }) =>
            deductionRepo.reviewDispute(deductionId, request),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.disputes() });
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.detail(variables.deductionId) });
            showToast('Dispute reviewed successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to review dispute', 'error');
        }
    });
}

export function useProcessDeductionsForVendor() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (vendorId: string) =>
            deductionRepo.processDeductionsForVendor(vendorId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.lists() });
            showToast('Deductions processed successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to process deductions', 'error');
        }
    });
}

export function useProcessSingleDeduction() {
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    return useMutation({
        mutationFn: (deductionId: string) =>
            deductionRepo.processSingleDeduction(deductionId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.lists() });
            queryClient.invalidateQueries({ queryKey: DEDUCTION_QUERY_KEYS.detail(variables) });
            showToast('Deduction processed successfully', 'success');
        },
        onError: (error: any) => {
            showToast(error.message || 'Failed to process deduction', 'error');
        }
    });
}
