"use client";

import { useState } from 'react';
import { XMarkIcon, UserIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, EnvelopeIcon, EyeIcon, ArrowDownTrayIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { 
  SurveyResponseDetailDto, 
  SurveyResponseFilterDto, 
  ResponseStatus, 
  QuestionType,
  SurveyAnswerDetailDto
} from '../../../lib/api/repositories/admin-survey-repository';
import { ApiResponse, PagedResponse } from '../../../data/types/api';
import { useAdminSurveyResponses } from '../../../lib/hooks/api-hooks.ts/use-admin-surveys';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string | null;
}

const SurveyResponsesModal = ({ isOpen, onClose, surveyId }: Props) => {
  console.log('📋 SurveyResponsesModal rendered with:', { isOpen, surveyId });
  
  const [filters, setFilters] = useState<SurveyResponseFilterDto>({
    page: 1,
    pageSize: 10,
    sortBy: 'completedAt',
    sortOrder: 'desc'
  });
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponseDetailDto | null>(null);

  // API hook - only fetch when modal is open and surveyId exists
  const hookEnabled = isOpen && !!surveyId;
  console.log('🔧 Hook enabled status:', { isOpen, surveyId, hookEnabled });
  
  const { data: responsesResponse, isLoading, error } = useAdminSurveyResponses(
    surveyId || '', 
    filters, 
    hookEnabled
  ) as { data: ApiResponse<PagedResponse<SurveyResponseDetailDto>> | undefined, isLoading: boolean, error: any };
  
  const responses = responsesResponse?.data || {
    data: [] as SurveyResponseDetailDto[],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  };

  const getStatusBadge = (status: ResponseStatus) => {
    const statusConfig = {
      [ResponseStatus.InProgress]: { color: 'bg-warning-100 text-warning-800', icon: ClockIcon, label: 'In Progress' },
      [ResponseStatus.Completed]: { color: 'bg-success-100 text-success-800', icon: CheckCircleIcon, label: 'Completed' },
      [ResponseStatus.Abandoned]: { color: 'bg-danger-100 text-danger-800', icon: ExclamationTriangleIcon, label: 'Abandoned' }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startDate: string, endDate?: string) => {
    if (!endDate) return 'In progress';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.round((end.getTime() - start.getTime()) / 1000 / 60);
    return `${duration}m`;
  };

  const handleViewResponse = (response: SurveyResponseDetailDto) => {
    setSelectedResponse(response);
  };

  const handleCloseResponseDetail = () => {
    setSelectedResponse(null);
  };

  const handleFilterChange = (key: keyof SurveyResponseFilterDto, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const getQuestionTypeName = (questionType: QuestionType) => {
    switch (questionType) {
      case QuestionType.ShortText:
        return 'Short Text';
      case QuestionType.LongText:
        return 'Long Text';
      case QuestionType.MultipleChoice:
        return 'Multiple Choice';
      case QuestionType.MultipleSelect:
        return 'Multiple Select';
      case QuestionType.Rating:
        return 'Rating';
      case QuestionType.YesNo:
        return 'Yes/No';
      case QuestionType.Dropdown:
        return 'Dropdown';
      default:
        return 'Unknown';
    }
  };

  const renderAnswerValue = (answer: SurveyAnswerDetailDto) => {
    switch (answer.questionType) {
      case QuestionType.Rating:
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full ${
                  i < (answer.numericValue || 0) ? 'bg-yellow-400' : 'bg-gray-200'
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-text-secondary">
              {answer.numericValue}/5
            </span>
          </div>
        );
      case QuestionType.MultipleSelect:
        // Handle both selectedOptions array and answerText fallback
        const options = answer.selectedOptions || (answer.answerText ? [answer.answerText] : []);
        return (
          <div className="flex flex-wrap gap-1">
            {options.map((option, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs"
              >
                {option}
              </span>
            ))}
          </div>
        );
      case QuestionType.MultipleChoice:
      case QuestionType.Dropdown:
        return (
          <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded-soft text-xs">
            {answer.answerText || 'No selection'}
          </span>
        );
      case QuestionType.YesNo:
        return (
          <span className={`px-2 py-1 rounded-soft text-xs ${
            answer.answerText === 'Yes' 
              ? 'bg-success-100 text-success-800' 
              : 'bg-danger-100 text-danger-800'
          }`}>
            {answer.answerText}
          </span>
        );
      case QuestionType.ShortText:
      case QuestionType.LongText:
      default:
        return (
          <div className="max-w-md">
            <p className="text-sm text-text-primary whitespace-pre-wrap break-words" title={answer.answerText}>
              {answer.answerText || 'No answer'}
            </p>
          </div>
        );
    }
  };

  if (!isOpen || !surveyId) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-text-secondary">Loading survey responses...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg p-6">
          <div className="text-center">
            <p className="text-danger-600 mb-4">Failed to load survey responses</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary-500 text-white rounded-button hover:bg-primary-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (selectedResponse) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Response Details</h2>
              <p className="text-sm text-text-tertiary">Response ID: {selectedResponse.id}</p>
            </div>
            <button
              onClick={handleCloseResponseDetail}
              className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-100 rounded-soft transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
            <div className="space-y-6">
              {/* Response Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-text-primary">Respondent Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-text-tertiary">User:</span> <span className="text-text-primary">{selectedResponse.userName || 'Anonymous'}</span></div>
                    <div><span className="text-text-tertiary">Email:</span> <span className="text-text-primary">{selectedResponse.userEmail || 'N/A'}</span></div>
                    <div><span className="text-text-tertiary">Status:</span> {getStatusBadge(selectedResponse.status)}</div>
                    <div><span className="text-text-tertiary">IP Address:</span> <span className="text-text-primary">{selectedResponse.ipAddress}</span></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-text-primary">Response Timeline</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-text-tertiary">Started:</span> <span className="text-text-primary">{formatDate(selectedResponse.startedAt)}</span></div>
                    <div><span className="text-text-tertiary">Completed:</span> <span className="text-text-primary">{formatDate(selectedResponse.completedAt)}</span></div>
                    <div><span className="text-text-tertiary">Duration:</span> <span className="text-text-primary">{formatDuration(selectedResponse.startedAt, selectedResponse.completedAt)}</span></div>
                    {selectedResponse.rewardCode && (
                      <div><span className="text-text-tertiary">Reward Code:</span> <span className="text-primary-600 font-medium">{selectedResponse.rewardCode}</span></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Answers */}
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-4">Answers ({selectedResponse.answers.length})</h3>
                <div className="space-y-4">
                  {selectedResponse.answers.map((answer, index) => (
                    <div key={answer.id} className="bg-surface-100 border border-border-light rounded-card p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-text-primary">Q{index + 1}: {answer.questionText}</h4>
                        <span className="bg-surface-200 text-text-tertiary text-xs px-2 py-1 rounded-soft">
                          {getQuestionTypeName(answer.questionType)}
                        </span>
                      </div>
                      <div className="mt-2">
                        {renderAnswerValue(answer)}
                      </div>
                    </div>
                  ))}
                  
                  {selectedResponse.answers.length === 0 && (
                    <div className="text-center py-8 text-text-tertiary">
                      <p>No answers provided yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-border-light">
            <button
              onClick={handleCloseResponseDetail}
              className="px-4 py-2 text-text-secondary border border-border-default rounded-button hover:bg-surface-50"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Survey Responses</h2>
            <p className="text-sm text-text-tertiary">{responses.totalCount} total responses</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-100 rounded-soft transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border-light">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={filters.status?.toString() || ''}
              onChange={(e) => handleFilterChange('status', e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Statuses</option>
              <option value={ResponseStatus.Completed.toString()}>Completed</option>
              <option value={ResponseStatus.InProgress.toString()}>In Progress</option>
              <option value={ResponseStatus.Abandoned.toString()}>Abandoned</option>
            </select>

            <select
              value={filters.emailSent?.toString() || ''}
              onChange={(e) => handleFilterChange('emailSent', e.target.value === '' ? undefined : e.target.value === 'true')}
              className="px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Email Status</option>
              <option value="true">Email Sent</option>
              <option value="false">Email Not Sent</option>
            </select>

            <input
              type="date"
              placeholder="Start Date From"
              value={filters.startDateFrom || ''}
              onChange={(e) => handleFilterChange('startDateFrom', e.target.value)}
              className="px-3 py-2 bg-surface-50 border border-border-default rounded-button text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />

            <button className="px-4 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 text-sm font-medium">
              <ArrowDownTrayIcon className="w-4 h-4 inline mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-surface-100 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Respondent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Started
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Answers
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-0 divide-y divide-border-light">
              {(responses.data || []).map((response: SurveyResponseDetailDto) => (
                <tr key={response.id} className="hover:bg-surface-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-text-tertiary" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {response.userName || 'Anonymous'}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {response.userEmail || response.sessionId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(response.status)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(response.startedAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDate(response.completedAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {formatDuration(response.startedAt, response.completedAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">
                    {response.answers.length} answers
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {response.rewardCode && (
                        <span className="text-xs text-primary-600 font-mono">
                          {response.rewardCode}
                        </span>
                      )}
                      {response.emailSent ? (
                        <EnvelopeIcon className="w-4 h-4 text-success-500" title="Email sent" />
                      ) : (
                        <EnvelopeIcon className="w-4 h-4 text-gray-300" title="Email not sent" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleViewResponse(response)}
                      className="p-1.5 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-soft transition-colors"
                      title="View Response"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(responses.data || []).length === 0 && (
            <div className="text-center py-12 text-text-tertiary">
              <UserGroupIcon className="w-12 h-12 mx-auto mb-4 text-text-quaternary" />
              <p>No responses found.</p>
              <p className="text-xs mt-1">Responses will appear here once users start submitting the survey.</p>
            </div>
          )}
        </div>

        {responses.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border-light">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-sm text-text-secondary">
                Showing {((filters.page - 1) * filters.pageSize) + 1} to {Math.min(filters.page * filters.pageSize, responses.totalCount)} of {responses.totalCount} responses
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={!responses.hasPreviousPage}
                  className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={!responses.hasNextPage}
                  className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end p-6 border-t border-border-light">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary border border-border-default rounded-button hover:bg-surface-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyResponsesModal;