import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { FeatureRequestRepository } from '../../api/repositories/feature-request-repository';
import { PaginatedResponse } from '@/app/data/types/api';
import { 
  FeatureRequestResponseDto, 
  FeatureRequestFilterDto, 
  CreateFeatureRequestDto, 
  UpdateFeatureRequestStatusDto,
  FeatureRequestStats
} from '@/app/data/types/feature-request';

const featureRequestRepo = new FeatureRequestRepository();

export const FEATURE_REQUEST_QUERY_KEYS = {
  all: ['feature-requests'] as const,
  lists: () => [...FEATURE_REQUEST_QUERY_KEYS.all, 'list'] as const,
  list: (filters?: FeatureRequestFilterDto) => [...FEATURE_REQUEST_QUERY_KEYS.lists(), filters] as const,
  details: () => [...FEATURE_REQUEST_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...FEATURE_REQUEST_QUERY_KEYS.details(), id] as const,
  myRequests: () => [...FEATURE_REQUEST_QUERY_KEYS.all, 'my-requests'] as const,
  stats: () => [...FEATURE_REQUEST_QUERY_KEYS.all, 'stats'] as const,
};

export function useFeatureRequests(filters?: FeatureRequestFilterDto): UseQueryResult<PaginatedResponse<FeatureRequestResponseDto>, Error> {
  return useQuery({
    queryKey: FEATURE_REQUEST_QUERY_KEYS.list(filters),
    queryFn: () => featureRequestRepo.getFeatureRequests(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useFeatureRequest(id: string): UseQueryResult<FeatureRequestResponseDto, Error> {
  return useQuery({
    queryKey: FEATURE_REQUEST_QUERY_KEYS.detail(id),
    queryFn: () => featureRequestRepo.getFeatureRequest(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
    retry: 2,
  });
}

export function useMyFeatureRequests(): UseQueryResult<FeatureRequestResponseDto[], Error> {
  return useQuery({
    queryKey: FEATURE_REQUEST_QUERY_KEYS.myRequests(),
    queryFn: () => featureRequestRepo.getMyFeatureRequests(),
    staleTime: 2 * 60 * 1000,
    retry: 2,
  });
}

export function useFeatureRequestStats(): UseQueryResult<FeatureRequestStats, Error> {
  return useQuery({
    queryKey: FEATURE_REQUEST_QUERY_KEYS.stats(),
    queryFn: () => featureRequestRepo.getFeatureRequestStats(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

export function useCreateFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFeatureRequestDto) =>
      featureRequestRepo.createFeatureRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.myRequests() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.stats() });
    },
  });
}

export function useUpdateFeatureRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeatureRequestStatusDto }) =>
      featureRequestRepo.updateFeatureRequestStatus(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.stats() });
    },
  });
}

export function useDeleteFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureRequestRepo.deleteFeatureRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.myRequests() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.stats() });
    },
  });
}

export function useUpvoteFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureRequestRepo.upvoteFeatureRequest(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.detail(variables) });
    },
  });
}

export function useDownvoteFeatureRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => featureRequestRepo.downvoteFeatureRequest(id),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FEATURE_REQUEST_QUERY_KEYS.detail(variables) });
    },
  });
}