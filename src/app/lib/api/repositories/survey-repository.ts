import { BaseRepository } from '../base-repository';
import { ApiResponse } from '@/app/data/types/api';

export interface ValidationRules {
  minRating?: number | null;
  maxRating?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  required?: boolean | null;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: number; // Backend returns numeric types: 1=ShortText, 2=LongText, 3=MultipleChoice, 4=MultipleSelect, 5=Rating, 6=YesNo, 7=Dropdown
  isRequired: boolean;
  description?: string;
  options?: string[];
  validationRules?: ValidationRules | null;
  order: number;
}

// Type mapping for converting numeric types to string types
export const QUESTION_TYPE_MAP = {
  1: 'ShortText',
  2: 'LongText', 
  3: 'MultipleChoice',
  4: 'MultipleSelect',
  5: 'Rating',
  6: 'YesNo',
  7: 'Dropdown'
} as const;

export type QuestionTypeString = typeof QUESTION_TYPE_MAP[keyof typeof QUESTION_TYPE_MAP];

export interface Survey {
  id: string;
  title: string;
  description: string;
  incentiveDescription?: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Archived';
  startDate?: string;
  endDate?: string;
  allowMultipleSubmissions: boolean;
  requireAuthentication: boolean;
  questions: SurveyQuestion[];
  totalResponses?: number;
  completionRate?: number;
  createdAt: string;
}

export interface SurveyAnswer {
  questionId: string;
  answerText?: string;
  selectedOptions?: string[];
  numericValue?: number;
}

export interface SubmitSurveyRequest extends Record<string, unknown> {
  surveyId: string;
  sessionId?: string;
  answers: SurveyAnswer[];
}

export interface SubmitSurveyResponse {
  id: string;
  message: string;
  emailSent: boolean;
}

export interface CanSubmitResponse {
  canSubmit: boolean;
  reason?: string;
}

export class SurveyRepository extends BaseRepository<Survey> {
  constructor() {
    super('/api/common/survey'); // Updated to match your backend
  }

  async getSurvey(surveyId: string): Promise<ApiResponse<Survey>> {
    try {
      // Use inherited get method from BaseRepository
      const data = await this.get<Survey>(`/${surveyId}`);
      
      return {
        success: true,
        data: data,
        message: 'Survey retrieved successfully'
      };
    } catch (error: any) {
      console.error('Survey fetch error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch survey',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async getActiveSurveys(): Promise<ApiResponse<Survey[]>> {
    try {
      // Use inherited get method from BaseRepository
      const data = await this.get<Survey[]>('/active');
      
      return {
        success: true,
        data: data,
        message: 'Active surveys retrieved successfully'
      };
    } catch (error: any) {
      console.error('Active surveys fetch error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch active surveys',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async submitSurveyResponse(request: SubmitSurveyRequest): Promise<ApiResponse<SubmitSurveyResponse>> {
    try {
      // Use inherited post method from BaseRepository
      const data = await this.post<SubmitSurveyResponse>(
        `/${request.surveyId}/submit`, 
        request
      );
      
      return {
        success: true,
        data: data,
        message: 'Survey response submitted successfully'
      };
    } catch (error: any) {
      console.error('Survey submission error:', error);
      return {
        success: false,
        message: error.message || 'Failed to submit survey response',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async canSubmitSurvey(surveyId: string, sessionId?: string): Promise<ApiResponse<CanSubmitResponse>> {
    try {
      // Build query parameters manually
      const queryParams = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
      const data = await this.get<CanSubmitResponse>(`/${surveyId}/can-submit${queryParams}`);
      
      return {
        success: true,
        data: data,
        message: 'Submission eligibility checked successfully'
      };
    } catch (error: any) {
      console.error('Can submit check error:', error);
      return {
        success: false,
        message: error.message || 'Failed to check submission eligibility',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }
}