import { BaseRepository } from '../base-repository';
import { ApiResponse, PagedResponse } from '../../../data/types/api';

// Enums matching the backend
export enum SurveyStatus {
  Draft = 0,
  Active = 1,
  Paused = 2,
  Completed = 3,
  Archived = 4
}

export enum QuestionType {
  ShortText = 1,
  LongText = 2,
  MultipleChoice = 3,
  MultipleSelect = 4,
  Rating = 5,
  YesNo = 6,
  Dropdown = 7
}

export enum ResponseStatus {
  InProgress = 1,
  Completed = 2,
  Abandoned = 3
}

// DTOs matching the backend
export interface ValidationRulesDto {
  minRating?: number | null;
  maxRating?: number | null;
  minLength?: number | null;
  maxLength?: number | null;
  required?: boolean | null;
}

export interface SurveyQuestionResponseDto {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  isRequired: boolean;
  description: string;
  options: string[];
  validationRules?: ValidationRulesDto | null;
}

export interface SurveyResponseDto {
  id: string;
  title: string;
  description: string;
  status: SurveyStatus;
  startDate?: string;
  endDate?: string;
  allowMultipleSubmissions: boolean;
  requireAuthentication: boolean;
  incentiveDescription: string;
  createdAt: string;
  createdByUserName?: string;
  questions: SurveyQuestionResponseDto[];
  totalResponses: number;
  completionRate: number;
}

export interface SurveyAnswerDetailDto {
  id: string;
  questionId: string;
  questionText: string;
  questionType: QuestionType;
  answerText?: string;
  selectedOptions?: string[];
  numericValue?: number;
}

export interface SurveyResponseDetailDto {
  id: string;
  surveyId: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  sessionId?: string;
  startedAt: string;
  completedAt?: string;
  status: ResponseStatus;
  ipAddress?: string;
  userAgent?: string;
  rewardCode?: string;
  emailSent: boolean;
  emailSentAt?: string;
  answers: SurveyAnswerDetailDto[];
}

export interface SurveyQuestionAnalyticsDto {
  id: string;
  text: string;
  totalAnswers: number;
  optionCounts: Record<string, number>;
  averageRating: number;
  topAnswers: string[];
}

export interface SurveyAnalyticsDto {
  surveyId: string;
  title: string;
  totalResponses: number;
  completedResponses: number;
  completionRate: number;
  emailsSent: number;
  questionAnalytics: Record<string, any>;
  firstResponseAt?: string;
  lastResponseAt?: string;
  questions: SurveyQuestionAnalyticsDto[];
}

// Filter DTOs
export interface SurveyFilterDto {
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  status?: SurveyStatus;
  searchTerm?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
}

export interface SurveyResponseFilterDto {
  status?: ResponseStatus;
  startDateFrom?: string;
  startDateTo?: string;
  completedDateFrom?: string;
  completedDateTo?: string;
  emailSent?: boolean;
  userId?: string;
  userEmail?: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Create/Update DTOs
export interface CreateSurveyQuestionDto {
  text: string;
  type: QuestionType;
  isRequired: boolean;
  description: string;
  options: string[];
  validationRules?: ValidationRulesDto | null;
  order: number;
}

export interface CreateSurveyDto {
  title: string;
  description: string;
  incentiveDescription?: string;
  startDate?: string;
  endDate?: string;
  allowMultipleSubmissions: boolean;
  requireAuthentication: boolean;
  questions: CreateSurveyQuestionDto[];
  [key: string]: unknown;
}

export interface UpdateSurveyDto extends CreateSurveyDto {
  id: string;
}

// Repository
export class AdminSurveyRepository extends BaseRepository<SurveyResponseDto> {
  constructor() {
    super('/api/common/survey');
  }

  async getAllSurveys(filters: SurveyFilterDto): Promise<ApiResponse<PagedResponse<SurveyResponseDto>>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', filters.page.toString());
      queryParams.append('pageSize', filters.pageSize.toString());
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);
      
      if (filters.status !== undefined) queryParams.append('status', filters.status.toString());
      if (filters.searchTerm) queryParams.append('searchTerm', filters.searchTerm);
      if (filters.startDateFrom) queryParams.append('startDateFrom', filters.startDateFrom);
      if (filters.startDateTo) queryParams.append('startDateTo', filters.startDateTo);
      if (filters.endDateFrom) queryParams.append('endDateFrom', filters.endDateFrom);
      if (filters.endDateTo) queryParams.append('endDateTo', filters.endDateTo);

      const data = await this.get<PagedResponse<SurveyResponseDto>>(`?${queryParams.toString()}`);
      
      return {
        success: true,
        data: data,
        message: 'Surveys retrieved successfully'
      };
    } catch (error: any) {
      console.error('Get surveys error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch surveys',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async createSurvey(dto: CreateSurveyDto): Promise<ApiResponse<SurveyResponseDto>> {
    try {
      const data = await this.post<SurveyResponseDto>('', dto);
      
      return {
        success: true,
        data: data,
        message: 'Survey created successfully'
      };
    } catch (error: any) {
      console.error('Create survey error:', error);
      return {
        success: false,
        message: error.message || 'Failed to create survey',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async updateSurvey(surveyId: string, dto: CreateSurveyDto): Promise<ApiResponse<SurveyResponseDto>> {
    try {
      const data = await this.put<SurveyResponseDto>(`/${surveyId}`, dto);
      
      return {
        success: true,
        data: data,
        message: 'Survey updated successfully'
      };
    } catch (error: any) {
      console.error('Update survey error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update survey',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async deleteSurvey(surveyId: string): Promise<ApiResponse<void>> {
    try {
      await this.delete(`/${surveyId}`);
      
      return {
        success: true,
        message: 'Survey deleted successfully'
      };
    } catch (error: any) {
      console.error('Delete survey error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete survey',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async getSurveyAnalytics(surveyId: string): Promise<ApiResponse<SurveyAnalyticsDto>> {
    try {
      const data = await this.get<SurveyAnalyticsDto>(`/${surveyId}/analytics`);
      
      return {
        success: true,
        data: data,
        message: 'Survey analytics retrieved successfully'
      };
    } catch (error: any) {
      console.error('Get survey analytics error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch survey analytics',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async getSurveyResponses(
    surveyId: string, 
    filters: SurveyResponseFilterDto
  ): Promise<ApiResponse<PagedResponse<SurveyResponseDetailDto>>> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', filters.page.toString());
      queryParams.append('pageSize', filters.pageSize.toString());
      queryParams.append('sortBy', filters.sortBy);
      queryParams.append('sortOrder', filters.sortOrder);
      
      if (filters.status !== undefined) queryParams.append('status', filters.status.toString());
      if (filters.startDateFrom) queryParams.append('startDateFrom', filters.startDateFrom);
      if (filters.startDateTo) queryParams.append('startDateTo', filters.startDateTo);
      if (filters.completedDateFrom) queryParams.append('completedDateFrom', filters.completedDateFrom);
      if (filters.completedDateTo) queryParams.append('completedDateTo', filters.completedDateTo);
      if (filters.emailSent !== undefined) queryParams.append('emailSent', filters.emailSent.toString());
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.userEmail) queryParams.append('userEmail', filters.userEmail);

      const url = `/${surveyId}/responses?${queryParams.toString()}`;
      console.log('🔍 Fetching survey responses from:', `${this.endpoint}${url}`);
      console.log('🔍 Filters:', filters);
      
      const data = await this.get<PagedResponse<SurveyResponseDetailDto>>(url);
      
      console.log('✅ Survey responses data received:', data);
      
      return {
        success: true,
        data: data,
        message: 'Survey responses retrieved successfully'
      };
    } catch (error: any) {
      console.error('❌ Get survey responses error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch survey responses',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  async getSurveyById(surveyId: string): Promise<ApiResponse<SurveyResponseDto>> {
    try {
      const data = await this.get<SurveyResponseDto>(`/${surveyId}`);
      
      return {
        success: true,
        data: data,
        message: 'Survey retrieved successfully'
      };
    } catch (error: any) {
      console.error('Get survey error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch survey',
        errors: [error.message || 'Unknown error'],
        statusCode: error.status || 500
      };
    }
  }

  // Utility methods for type conversion
  static getStatusString(status: SurveyStatus): string {
    return SurveyStatus[status];
  }

  static getQuestionTypeString(type: QuestionType): string {
    return QuestionType[type];
  }

  static getResponseStatusString(status: ResponseStatus): string {
    return ResponseStatus[status];
  }
}