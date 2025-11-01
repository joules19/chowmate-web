"use client";

import { useState } from 'react';
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  PlayIcon,
  PauseIcon,
  CheckIcon,
  ClockIcon,
  ArchiveBoxIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { 
  SurveyResponseDto, 
  SurveyFilterDto, 
  SurveyStatus,
  AdminSurveyRepository
} from '../../../lib/api/repositories/admin-survey-repository';
import { useAdminSurveys, useDeleteAdminSurvey } from '../../../lib/hooks/api-hooks.ts/use-admin-surveys';
import { PagedResponse } from '../../../data/types/api';

interface Props {
  filters: SurveyFilterDto;
  onFiltersChange: (filters: SurveyFilterDto) => void;
  onViewDetails?: (surveyId: string) => void;
  onEdit?: (survey: SurveyResponseDto) => void;
  onViewAnalytics?: (surveyId: string) => void;
  onViewResponses?: (surveyId: string) => void;
  onCreateSurvey?: () => void;
}

const SurveyManagementTable = ({ 
  filters, 
  onFiltersChange, 
  onViewDetails, 
  onEdit, 
  onViewAnalytics, 
  onViewResponses, 
  onCreateSurvey 
}: Props) => {
  const [selectedSurveys, setSelectedSurveys] = useState<string[]>([]);
  
  // API hooks
  const { data: surveysResponse, isLoading, error } = useAdminSurveys(filters);
  const deleteSurveyMutation = useDeleteAdminSurvey();

  const surveys = surveysResponse?.data || { data: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false };

  const getStatusBadge = (status: SurveyStatus) => {
    const statusConfig = {
      [SurveyStatus.Draft]: { color: 'bg-gray-100 text-gray-800', icon: ClockIcon, label: 'Draft' },
      [SurveyStatus.Active]: { color: 'bg-success-100 text-success-800', icon: PlayIcon, label: 'Active' },
      [SurveyStatus.Paused]: { color: 'bg-warning-100 text-warning-800', icon: PauseIcon, label: 'Paused' },
      [SurveyStatus.Completed]: { color: 'bg-primary-100 text-primary-800', icon: CheckIcon, label: 'Completed' },
      [SurveyStatus.Archived]: { color: 'bg-gray-100 text-gray-600', icon: ArchiveBoxIcon, label: 'Archived' }
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
      day: 'numeric'
    });
  };

  const handleSelectAll = () => {
    if (selectedSurveys.length === surveys.data.length) {
      setSelectedSurveys([]);
    } else {
      setSelectedSurveys(surveys.data.map(survey => survey.id));
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (window.confirm('Are you sure you want to delete this survey? This action cannot be undone.')) {
      try {
        await deleteSurveyMutation.mutateAsync(surveyId);
        // Remove from selected surveys if it was selected
        setSelectedSurveys(prev => prev.filter(id => id !== surveyId));
      } catch (error) {
        console.error('Failed to delete survey:', error);
        alert('Failed to delete survey. Please try again.');
      }
    }
  };

  const handleSelectSurvey = (surveyId: string) => {
    setSelectedSurveys(prev => 
      prev.includes(surveyId) 
        ? prev.filter(id => id !== surveyId)
        : [...prev, surveyId]
    );
  };

  const handleViewDetails = (surveyId: string) => {
    onViewDetails?.(surveyId);
  };

  const handleEdit = (survey: SurveyResponseDto) => {
    onEdit?.(survey);
  };

  const handleViewAnalytics = (surveyId: string) => {
    onViewAnalytics?.(surveyId);
  };

  const handleViewResponses = (surveyId: string) => {
    onViewResponses?.(surveyId);
  };

  const handleSort = (column: string) => {
    const newSortOrder = filters.sortBy === column && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ ...filters, sortBy: column, sortOrder: newSortOrder });
  };

  const handlePageChange = (newPage: number) => {
    onFiltersChange({ ...filters, page: newPage });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-sm text-text-secondary mt-2">Loading surveys...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-danger-50 border border-danger-200 rounded-card p-4">
        <p className="text-danger-700">Failed to load surveys. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary tracking-tight">
            Survey Management
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Create and manage customer surveys
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <button
            onClick={() => onCreateSurvey?.()}
            className="w-full xs:w-auto px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
          >
            <span className="hidden sm:inline">Create Survey</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {selectedSurveys.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-card p-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-sm text-primary-700">
              {selectedSurveys.length} survey{selectedSurveys.length !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 text-xs font-medium">
                Bulk Export
              </button>
              <button className="px-3 py-1.5 bg-danger-500 text-text-inverse rounded-button hover:bg-danger-600 text-xs font-medium">
                Bulk Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-0 rounded-card shadow-soft border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border-light">
            <thead className="bg-surface-100">
              <tr>
                <th className="w-4 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedSurveys.length === surveys.data.length && surveys.data.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary-500 border-border-default rounded focus:ring-primary-500"
                  />
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-200"
                  onClick={() => handleSort('title')}
                >
                  Survey
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-200"
                  onClick={() => handleSort('status')}
                >
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Period
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Responses
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-200"
                  onClick={() => handleSort('completionRate')}
                >
                  Completion
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:bg-surface-200"
                  onClick={() => handleSort('createdAt')}
                >
                  Created
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-text-tertiary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface-0 divide-y divide-border-light">
              {surveys.data.map((survey) => (
                <tr key={survey.id} className="hover:bg-surface-50">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedSurveys.includes(survey.id)}
                      onChange={() => handleSelectSurvey(survey.id)}
                      className="w-4 h-4 text-primary-500 border-border-default rounded focus:ring-primary-500"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-text-primary">
                        {survey.title}
                      </p>
                      <p className="text-xs text-text-tertiary truncate max-w-xs">
                        {survey.description}
                      </p>
                      {survey.incentiveDescription && (
                        <p className="text-xs text-primary-600 mt-1">
                          💰 {survey.incentiveDescription}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(survey.status)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-text-secondary">
                      <div>Start: {formatDate(survey.startDate)}</div>
                      <div>End: {formatDate(survey.endDate)}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4 text-text-tertiary" />
                      <span className="text-sm font-medium text-text-primary">
                        {survey.totalResponses}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-surface-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full" 
                          style={{ width: `${survey.completionRate}%` }}
                        />
                      </div>
                      <span className="text-xs text-text-secondary min-w-0">
                        {survey.completionRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-text-secondary">
                      <div>{formatDate(survey.createdAt)}</div>
                      <div className="text-text-tertiary">{survey.createdByUserName}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleViewDetails(survey.id)}
                        className="p-1.5 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-soft transition-colors"
                        title="View Details"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(survey)}
                        className="p-1.5 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-soft transition-colors"
                        title="Edit Survey"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewAnalytics(survey.id)}
                        className="p-1.5 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-soft transition-colors"
                        title="View Analytics"
                      >
                        <ChartBarIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewResponses(survey.id)}
                        className="p-1.5 text-text-tertiary hover:text-primary-600 hover:bg-primary-50 rounded-soft transition-colors"
                        title="View Responses"
                      >
                        <UserGroupIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSurvey(survey.id)}
                        disabled={deleteSurveyMutation.isPending}
                        className="p-1.5 text-text-tertiary hover:text-danger-600 hover:bg-danger-50 rounded-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Survey"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {surveys.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border-light">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="text-sm text-text-secondary">
                Showing {((filters.page - 1) * filters.pageSize) + 1} to {Math.min(filters.page * filters.pageSize, surveys.totalCount)} of {surveys.totalCount} surveys
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={!surveys.hasPreviousPage}
                  className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={!surveys.hasNextPage}
                  className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded-button hover:bg-surface-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurveyManagementTable;