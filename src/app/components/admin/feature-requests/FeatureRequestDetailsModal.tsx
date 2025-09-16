"use client";

import { Modal, Tag, Divider, Button, Space } from 'antd';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { FeatureRequestResponseDto, FeatureRequestStatus, FeatureRequestPriority } from '@/app/data/types/feature-request';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  featureRequest: FeatureRequestResponseDto | null;
  onStatusChange?: (featureRequest: FeatureRequestResponseDto) => void;
}

export default function FeatureRequestDetailsModal({
  isOpen,
  onClose,
  featureRequest,
  onStatusChange
}: Props) {
  if (!featureRequest) return null;

  const getStatusIcon = (status: FeatureRequestStatus) => {
    const icons = {
      [FeatureRequestStatus.PENDING]: <ClockIcon className="w-5 h-5" />,
      [FeatureRequestStatus.UNDER_REVIEW]: <ArrowPathIcon className="w-5 h-5" />,
      [FeatureRequestStatus.APPROVED]: <CheckCircleIcon className="w-5 h-5" />,
      [FeatureRequestStatus.REJECTED]: <XCircleIcon className="w-5 h-5" />,
      [FeatureRequestStatus.IMPLEMENTED]: <CheckCircleIcon className="w-5 h-5" />
    };
    return icons[status];
  };

  const getStatusColor = (status: FeatureRequestStatus) => {
    const colors = {
      [FeatureRequestStatus.PENDING]: 'orange',
      [FeatureRequestStatus.UNDER_REVIEW]: 'blue',
      [FeatureRequestStatus.APPROVED]: 'green',
      [FeatureRequestStatus.REJECTED]: 'red',
      [FeatureRequestStatus.IMPLEMENTED]: 'purple'
    };
    return colors[status];
  };

  const getPriorityColor = (priority: FeatureRequestPriority) => {
    const colors = {
      [FeatureRequestPriority.LOW]: 'default',
      [FeatureRequestPriority.MEDIUM]: 'orange',
      [FeatureRequestPriority.HIGH]: 'red',
      [FeatureRequestPriority.CRITICAL]: 'volcano'
    };
    return colors[priority];
  };

  return (
    <Modal
      title="Feature Request Details"
      open={isOpen}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        ...(onStatusChange ? [
          <Button 
            key="update-status" 
            type="primary" 
            onClick={() => onStatusChange(featureRequest)}
          >
            Update Status
          </Button>
        ] : [])
      ]}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            {featureRequest.title}
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <Tag 
              icon={getStatusIcon(featureRequest.status)} 
              color={getStatusColor(featureRequest.status)}
            >
              {featureRequest.status}
            </Tag>
            <Tag color={getPriorityColor(featureRequest.priority)}>
              {featureRequest.priority} Priority
            </Tag>
            <Tag color="blue">
              {featureRequest.category.replace(/([A-Z])/g, ' $1').trim()}
            </Tag>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
          <p className="text-gray-700 leading-relaxed">
            {featureRequest.description}
          </p>
        </div>

        {/* Expected Benefit */}
        {featureRequest.expectedBenefit && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Expected Benefit</h3>
            <p className="text-gray-700 leading-relaxed">
              {featureRequest.expectedBenefit}
            </p>
          </div>
        )}

        <Divider />

        {/* Submission Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Submission Details</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Submitted by:</span>
                <span className="text-sm font-medium">
                  {featureRequest.submittedByName || 'Unknown User'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Submitted on:</span>
                <span className="text-sm font-medium">
                  {new Date(featureRequest.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Community Feedback</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <HandThumbUpIcon className="w-5 h-5 text-green-600" />
                <span className="text-lg font-semibold text-green-600">
                  {featureRequest.upvotes}
                </span>
                <span className="text-sm text-gray-600">upvotes</span>
              </div>
              <div className="flex items-center gap-2">
                <HandThumbDownIcon className="w-5 h-5 text-red-600" />
                <span className="text-lg font-semibold text-red-600">
                  {featureRequest.downvotes}
                </span>
                <span className="text-sm text-gray-600">downvotes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Information */}
        {(featureRequest.reviewedBy || featureRequest.reviewNotes) && (
          <>
            <Divider />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Review Information</h3>
              {featureRequest.reviewedBy && (
                <div className="mb-2">
                  <span className="text-sm text-gray-600">Reviewed by:</span>
                  <span className="text-sm font-medium ml-2">
                    {featureRequest.reviewedByName || featureRequest.reviewedBy}
                  </span>
                  {featureRequest.reviewedAt && (
                    <span className="text-sm text-gray-500 ml-2">
                      on {new Date(featureRequest.reviewedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
              {featureRequest.reviewNotes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">{featureRequest.reviewNotes}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Implementation Info */}
        {(featureRequest.estimatedImplementationDate || featureRequest.implementedAt) && (
          <>
            <Divider />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Implementation Timeline</h3>
              <div className="space-y-2">
                {featureRequest.estimatedImplementationDate && (
                  <div>
                    <span className="text-sm text-gray-600">Estimated implementation:</span>
                    <span className="text-sm font-medium ml-2">
                      {new Date(featureRequest.estimatedImplementationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {featureRequest.implementedAt && (
                  <div>
                    <span className="text-sm text-gray-600">Implemented on:</span>
                    <span className="text-sm font-medium ml-2">
                      {new Date(featureRequest.implementedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Attachments */}
        {featureRequest.attachments && featureRequest.attachments.length > 0 && (
          <>
            <Divider />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
              <div className="space-y-2">
                {featureRequest.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Attachment {index + 1}
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}