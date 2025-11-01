"use client";

import { XMarkIcon, ClockIcon, UserGroupIcon, CheckCircleIcon, PlayIcon, PauseIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { 
  SurveyResponseDto, 
  SurveyStatus, 
  QuestionType,
  AdminSurveyRepository
} from '../../../lib/api/repositories/admin-survey-repository';
import { useAdminSurvey } from '../../../lib/hooks/api-hooks.ts/use-admin-surveys';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string | null;
}

const SurveyDetailsModal = ({ isOpen, onClose, surveyId }: Props) => {
  const { data: surveyResponse, isLoading, error } = useAdminSurvey(surveyId || '', isOpen && !!surveyId);
  
  const survey = surveyResponse?.data;

  const getStatusBadge = (status: SurveyStatus) => {
    const statusConfig = {
      [SurveyStatus.Draft]: { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: 'Draft' },
      [SurveyStatus.Active]: { color: 'bg-success-100 text-success-800', icon: PlayIcon, label: 'Active' },
      [SurveyStatus.Paused]: { color: 'bg-warning-100 text-warning-800', icon: PauseIcon, label: 'Paused' },
      [SurveyStatus.Completed]: { color: 'bg-primary-100 text-primary-800', icon: CheckCircleIcon, label: 'Completed' },
      [SurveyStatus.Archived]: { color: 'bg-gray-100 text-gray-600', icon: ArchiveBoxIcon, label: 'Archived' }
    };

    const config = statusConfig[status];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    const typeLabels = {
      [QuestionType.ShortText]: 'Short Text',
      [QuestionType.LongText]: 'Long Text',
      [QuestionType.MultipleChoice]: 'Multiple Choice (Single)',
      [QuestionType.MultipleSelect]: 'Multiple Choice (Multiple)',
      [QuestionType.Rating]: 'Rating Scale',
      [QuestionType.YesNo]: 'Yes/No',
      [QuestionType.Dropdown]: 'Dropdown'
    };
    return typeLabels[type] || 'Unknown';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen || !surveyId) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-text-secondary">Loading survey details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg p-6">
          <div className="text-center">
            <p className="text-danger-600 mb-4">Failed to load survey details</p>
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-text-primary">Survey Details</h2>
            {getStatusBadge(survey.status)}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-100 rounded-soft transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary border-b border-border-light pb-2">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-tertiary mb-1">Title</label>
                    <p className="text-text-primary">{survey.title}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-text-tertiary mb-1">Description</label>
                    <p className="text-text-secondary text-sm leading-relaxed">{survey.description}</p>
                  </div>

                  {survey.incentiveDescription && (
                    <div>
                      <label className="block text-sm font-medium text-text-tertiary mb-1">Incentive</label>
                      <p className="text-primary-600 font-medium">💰 {survey.incentiveDescription}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-tertiary mb-1">Survey Period</label>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-text-tertiary">Start:</span> <span className="text-text-primary">{formatDate(survey.startDate)}</span></p>
                      <p><span className="text-text-tertiary">End:</span> <span className="text-text-primary">{formatDate(survey.endDate)}</span></p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-tertiary mb-1">Settings</label>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${survey.allowMultipleSubmissions ? 'bg-success-500' : 'bg-gray-300'}`} />
                        <span className="text-text-secondary">Multiple submissions {survey.allowMultipleSubmissions ? 'allowed' : 'not allowed'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${survey.requireAuthentication ? 'bg-success-500' : 'bg-gray-300'}`} />
                        <span className="text-text-secondary">Authentication {survey.requireAuthentication ? 'required' : 'not required'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-tertiary mb-1">Created</label>
                    <div className="text-sm">
                      <p className="text-text-primary">{formatDate(survey.createdAt)}</p>
                      <p className="text-text-tertiary">by {survey.createdByUserName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary border-b border-border-light pb-2">
                Statistics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-surface-100 rounded-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-soft">
                      <UserGroupIcon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">Total Responses</p>
                      <p className="text-2xl font-bold text-text-primary">{survey.totalResponses}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-100 rounded-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success-100 rounded-soft">
                      <CheckCircleIcon className="w-5 h-5 text-success-600" />
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">Completion Rate</p>
                      <p className="text-2xl font-bold text-text-primary">{survey.completionRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-100 rounded-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-info-100 rounded-soft">
                      <ClockIcon className="w-5 h-5 text-info-600" />
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">Questions</p>
                      <p className="text-2xl font-bold text-text-primary">{survey.questions.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-text-primary border-b border-border-light pb-2">
                Questions ({survey.questions.length})
              </h3>
              
              <div className="space-y-4">
                {survey.questions.map((question, index) => (
                  <div key={question.id} className="bg-surface-100 border border-border-light rounded-card p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-1 rounded-soft">
                          Q{index + 1}
                        </span>
                        <span className="bg-surface-200 text-text-tertiary text-xs px-2 py-1 rounded-soft">
                          {getQuestionTypeLabel(question.type)}
                        </span>
                        {question.isRequired && (
                          <span className="bg-danger-100 text-danger-700 text-xs px-2 py-1 rounded-soft">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-text-primary">{question.text}</h4>
                      
                      {question.description && (
                        <p className="text-sm text-text-tertiary italic">{question.description}</p>
                      )}

                      {question.options.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-medium text-text-tertiary mb-2">Options:</p>
                          <div className="space-y-1">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-surface-300 rounded-full" />
                                <span className="text-text-secondary">{option}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.validationRules && (
                        <div className="mt-3 text-xs text-text-tertiary">
                          <p className="font-medium mb-1">Validation Rules:</p>
                          <div className="space-y-1">
                            {question.validationRules.minRating && question.validationRules.maxRating && (
                              <p>• Rating range: {question.validationRules.minRating} - {question.validationRules.maxRating}</p>
                            )}
                            {question.validationRules.minLength && (
                              <p>• Minimum length: {question.validationRules.minLength} characters</p>
                            )}
                            {question.validationRules.maxLength && (
                              <p>• Maximum length: {question.validationRules.maxLength} characters</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border-light">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyDetailsModal;