import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  AdminSurveyRepository, 
  SurveyFilterDto, 
  CreateSurveyDto, 
  SurveyResponseDto,
  SurveyResponseFilterDto 
} from '../../api/repositories/admin-survey-repository';

const adminSurveyRepository = new AdminSurveyRepository();

// Query keys
export const surveyKeys = {
  all: ['admin-surveys'] as const,
  lists: () => [...surveyKeys.all, 'list'] as const,
  list: (filters: SurveyFilterDto) => [...surveyKeys.lists(), filters] as const,
  details: () => [...surveyKeys.all, 'detail'] as const,
  detail: (id: string) => [...surveyKeys.details(), id] as const,
  analytics: (id: string) => [...surveyKeys.all, 'analytics', id] as const,
  responses: (id: string, filters: SurveyResponseFilterDto) => [...surveyKeys.all, 'responses', id, filters] as const,
};

// Get all surveys with filters
export const useAdminSurveys = (filters: SurveyFilterDto) => {
  return useQuery({
    queryKey: surveyKeys.list(filters),
    queryFn: () => adminSurveyRepository.getAllSurveys(filters),
    staleTime: 30000, // 30 seconds
  });
};

// Get survey by ID
export const useAdminSurvey = (surveyId: string, enabled = true) => {
  return useQuery({
    queryKey: surveyKeys.detail(surveyId),
    queryFn: () => adminSurveyRepository.getSurveyById(surveyId),
    enabled: !!surveyId && enabled,
    staleTime: 60000, // 1 minute
  });
};

// Get survey analytics
export const useAdminSurveyAnalytics = (surveyId: string, enabled = true) => {
  return useQuery({
    queryKey: surveyKeys.analytics(surveyId),
    queryFn: () => adminSurveyRepository.getSurveyAnalytics(surveyId),
    enabled: !!surveyId && enabled,
    staleTime: 30000, // 30 seconds
  });
};

// Get survey responses
export const useAdminSurveyResponses = (surveyId: string, filters: SurveyResponseFilterDto, enabled = true) => {
  console.log('🎯 useAdminSurveyResponses called with:', { surveyId, enabled, filters });
  
  return useQuery({
    queryKey: surveyKeys.responses(surveyId, filters),
    queryFn: () => {
      console.log('🚀 Survey responses query function executing...');
      return adminSurveyRepository.getSurveyResponses(surveyId, filters);
    },
    enabled: !!surveyId && enabled,
    staleTime: 30000 // 30 seconds
  });
};

// Create survey mutation
export const useCreateAdminSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateSurveyDto) => adminSurveyRepository.createSurvey(dto),
    onSuccess: () => {
      // Invalidate and refetch surveys list
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
    },
  });
};

// Update survey mutation
export const useUpdateAdminSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ surveyId, dto }: { surveyId: string; dto: CreateSurveyDto }) => 
      adminSurveyRepository.updateSurvey(surveyId, dto),
    onSuccess: (_, { surveyId }) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: surveyKeys.detail(surveyId) });
      queryClient.invalidateQueries({ queryKey: surveyKeys.analytics(surveyId) });
    },
  });
};

// Delete survey mutation
export const useDeleteAdminSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (surveyId: string) => adminSurveyRepository.deleteSurvey(surveyId),
    onSuccess: (_, surveyId) => {
      // Invalidate and refetch surveys list
      queryClient.invalidateQueries({ queryKey: surveyKeys.lists() });
      // Remove the deleted survey from cache
      queryClient.removeQueries({ queryKey: surveyKeys.detail(surveyId) });
      queryClient.removeQueries({ queryKey: surveyKeys.analytics(surveyId) });
    },
  });
};