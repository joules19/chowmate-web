"use client";

import { useState } from 'react';
import SurveyManagementTable from '../../components/admin/surveys/SurveyManagementTable';
import SurveyFilters from '../../components/admin/surveys/SurveyFilters';
import CreateEditSurveyModal from '../../components/admin/surveys/CreateEditSurveyModal';
import SurveyDetailsModal from '../../components/admin/surveys/SurveyDetailsModal';
import SurveyAnalyticsModal from '../../components/admin/surveys/SurveyAnalyticsModal';
import SurveyResponsesModal from '../../components/admin/surveys/SurveyResponsesModal';
import PermissionGuard from '../../components/admin/guards/PermissionGuard';
import { Permission } from '../../data/types/permissions';
import { 
  SurveyFilterDto, 
  CreateSurveyDto, 
  SurveyResponseDto 
} from '../../lib/api/repositories/admin-survey-repository';
import { useCreateAdminSurvey, useUpdateAdminSurvey } from '../../lib/hooks/api-hooks.ts/use-admin-surveys';

const SurveysPage = () => {
  const [filters, setFilters] = useState<SurveyFilterDto>({
    page: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showResponsesModal, setShowResponsesModal] = useState(false);
  
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [editingSurvey, setEditingSurvey] = useState<SurveyResponseDto | null>(null);

  // API hooks
  const createSurveyMutation = useCreateAdminSurvey();
  const updateSurveyMutation = useUpdateAdminSurvey();

  const handleFiltersChange = (newFilters: SurveyFilterDto) => {
    setFilters(newFilters);
  };

  const handleCreateSurvey = async (data: CreateSurveyDto) => {
    try {
      const result = await createSurveyMutation.mutateAsync(data);
      if (result.success) {
        setShowCreateModal(false);
        // The query will automatically refresh due to the mutation's onSuccess handler
      } else {
        alert(result.message || 'Failed to create survey. Please try again.');
      }
    } catch (error) {
      console.error('Error creating survey:', error);
      alert('Failed to create survey. Please try again.');
    }
  };

  const handleEditSurvey = async (data: CreateSurveyDto) => {
    if (!selectedSurveyId) return;
    
    try {
      const result = await updateSurveyMutation.mutateAsync({ surveyId: selectedSurveyId, dto: data });
      if (result.success) {
        setShowEditModal(false);
        setEditingSurvey(null);
        setSelectedSurveyId(null);
        // The query will automatically refresh due to the mutation's onSuccess handler
      } else {
        alert(result.message || 'Failed to update survey. Please try again.');
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      alert('Failed to update survey. Please try again.');
    }
  };

  const handleViewDetails = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setShowDetailsModal(true);
  };

  const handleEdit = (survey: SurveyResponseDto) => {
    setEditingSurvey(survey);
    setSelectedSurveyId(survey.id);
    setShowEditModal(true);
  };

  const handleViewAnalytics = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setShowAnalyticsModal(true);
  };

  const handleViewResponses = (surveyId: string) => {
    setSelectedSurveyId(surveyId);
    setShowResponsesModal(true);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDetailsModal(false);
    setShowAnalyticsModal(false);
    setShowResponsesModal(false);
    setSelectedSurveyId(null);
    setEditingSurvey(null);
  };

  return (
    <PermissionGuard permission={Permission.VIEW_SURVEYS}>
      <div className="space-y-4 sm:space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary tracking-tight">
                Survey Management
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                Create, manage, and analyze customer surveys to gather valuable feedback
              </p>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full xs:w-auto px-4 py-2.5 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 active:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-soft hover:shadow-soft-md transition-all duration-200 text-sm font-medium"
              >
                <span className="hidden sm:inline">Create New Survey</span>
                <span className="sm:hidden">Create Survey</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <SurveyFilters 
          filters={filters} 
          onFiltersChange={handleFiltersChange} 
        />

        {/* Table Section */}
        <SurveyManagementTable 
          filters={filters} 
          onFiltersChange={handleFiltersChange}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
          onViewAnalytics={handleViewAnalytics}
          onViewResponses={handleViewResponses}
          onCreateSurvey={() => setShowCreateModal(true)}
        />

        {/* Modals */}
        <CreateEditSurveyModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateSurvey}
        />

        <CreateEditSurveyModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          survey={editingSurvey || undefined}
          onSave={handleEditSurvey}
        />

        <SurveyDetailsModal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          surveyId={selectedSurveyId}
        />

        <SurveyAnalyticsModal
          isOpen={showAnalyticsModal}
          onClose={() => setShowAnalyticsModal(false)}
          surveyId={selectedSurveyId}
        />

        <SurveyResponsesModal
          isOpen={showResponsesModal}
          onClose={() => setShowResponsesModal(false)}
          surveyId={selectedSurveyId}
        />
      </div>
    </PermissionGuard>
  );
};

export default SurveysPage;