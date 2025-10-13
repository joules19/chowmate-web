import { useMutation, useQuery } from '@tanstack/react-query';
import { SurveyRepository, Survey, SubmitSurveyRequest, SubmitSurveyResponse, CanSubmitResponse } from '@/app/lib/api/repositories/survey-repository';

const surveyRepository = new SurveyRepository();

// Query keys
export const surveyKeys = {
  all: ['surveys'] as const,
  survey: (id: string) => [...surveyKeys.all, 'survey', id] as const,
  activeSurveys: () => [...surveyKeys.all, 'active'] as const,
  canSubmit: (surveyId: string, sessionId?: string) => [...surveyKeys.all, 'can-submit', surveyId, sessionId] as const,
};

// Get single survey
export const useSurvey = (surveyId: string) => {
  return useQuery({
    queryKey: surveyKeys.survey(surveyId),
    queryFn: () => surveyRepository.getSurvey(surveyId),
    enabled: !!surveyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry for 404s (survey not found)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 3;
    }
  });
};

// Get active surveys
export const useActiveSurveys = () => {
  return useQuery({
    queryKey: surveyKeys.activeSurveys(),
    queryFn: () => surveyRepository.getActiveSurveys(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Check if user can submit survey
export const useCanSubmitSurvey = (surveyId: string, sessionId?: string) => {
  return useQuery({
    queryKey: surveyKeys.canSubmit(surveyId, sessionId),
    queryFn: () => surveyRepository.canSubmitSurvey(surveyId, sessionId),
    enabled: !!surveyId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

// Submit survey response
export const useSubmitSurveyResponse = () => {
  return useMutation({
    mutationFn: (request: SubmitSurveyRequest) => 
      surveyRepository.submitSurveyResponse(request),
    onSuccess: (data, variables) => {
      // Invalidate can-submit query for this survey
      // queryClient.invalidateQueries({
      //   queryKey: surveyKeys.canSubmit(variables.surveyId, variables.sessionId)
      // });
      
      console.log('Survey response submitted successfully:', data);
    },
    onError: (error) => {
      console.error('Error submitting survey response:', error);
    },
  });
};