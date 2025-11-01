"use client";

import { XMarkIcon, ChartBarIcon, UserGroupIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import {
  SurveyAnalyticsDto,
  SurveyQuestionAnalyticsDto
} from '../../../lib/api/repositories/admin-survey-repository';
import { useAdminSurveyAnalytics } from '../../../lib/hooks/api-hooks.ts/use-admin-surveys';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string | null;
}

const SurveyAnalyticsModal = ({ isOpen, onClose, surveyId }: Props) => {
  // API hook
  const { data: analyticsResponse, isLoading, error } = useAdminSurveyAnalytics(surveyId || '', isOpen && !!surveyId);

  const analytics = analyticsResponse?.data;


  const getBarWidth = (count: number, maxCount: number) => {
    return Math.max((count / maxCount) * 100, 2);
  };

  if (!isOpen || !surveyId) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-2 text-text-secondary">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-surface-0 rounded-card shadow-soft-lg p-6">
          <div className="text-center">
            <p className="text-danger-600 mb-4">Failed to load survey analytics</p>
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
      <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <div className="flex items-center gap-3">
            <ChartBarIcon className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-xl font-semibold text-text-primary">Survey Analytics</h2>
              <p className="text-sm text-text-tertiary">{analytics.title}</p>
            </div>
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
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary-50 border border-primary-200 rounded-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500 rounded-soft">
                    <UserGroupIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-700">Total Responses</p>
                    <p className="text-2xl font-bold text-primary-900">{analytics.totalResponses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-success-50 border border-success-200 rounded-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success-500 rounded-soft">
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-success-700">Completed</p>
                    <p className="text-2xl font-bold text-success-900">{analytics.completedResponses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-warning-50 border border-warning-200 rounded-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning-500 rounded-soft">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-warning-700">Completion Rate</p>
                    <p className="text-2xl font-bold text-warning-900">{analytics.completionRate}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-info-50 border border-info-200 rounded-card p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info-500 rounded-soft">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-info-700">Emails Sent</p>
                    <p className="text-2xl font-bold text-info-900">{analytics.emailsSent}</p>
                  </div>
                </div>
              </div>
            </div>


            {/* Question Analytics */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-text-primary">Question Analytics</h3>

              {analytics.questions?.map((question, index) => (
                <div key={question.id} className="bg-surface-100 rounded-card p-6">
                  <div className="mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-text-primary mb-1">
                          Q{index + 1}: {question.text}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-text-tertiary">
                          <span>{question.totalAnswers} answered</span>
                          {question.averageRating > 0 && (
                            <span className="text-primary-600 font-medium">
                              Avg: {question.averageRating.toFixed(1)}/5
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(question.optionCounts || {}).map(([option, count], responseIndex) => (
                      <div key={responseIndex} className="flex items-center gap-4">
                        <div className="w-24 text-sm text-text-secondary truncate" title={option}>
                          {option}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-surface-200 rounded-full h-3">
                              <div
                                className="bg-primary-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${getBarWidth(count as number, Math.max(...Object.values(question.optionCounts || {})) as number)}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-medium text-text-primary">{count}</span>
                              <span className="text-xs text-text-tertiary">
                                ({question.totalAnswers > 0 ? ((count as number / question.totalAnswers) * 100).toFixed(1) : 0}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {question.topAnswers && question.topAnswers.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-sm font-medium text-text-secondary mb-2">Top Responses:</h5>
                        <div className="space-y-1">
                          {question.topAnswers.slice(0, 3).map((answer, idx) => (
                            <div key={idx} className="text-sm text-text-secondary bg-surface-200 rounded-soft px-2 py-1">
                              "{answer}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-border-light">
          <div className="text-sm text-text-tertiary">
            Last updated: {new Date().toLocaleString()}
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              Export Report
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyAnalyticsModal;