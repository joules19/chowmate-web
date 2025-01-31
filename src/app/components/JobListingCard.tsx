import React from 'react';
import { Card, Tooltip, Tag } from 'antd';
import { JobPosting, JobPostingDetails } from '../types/onboarding';
import { formatCurrencyRange } from '../utils/helperMethods';

interface JobListingCardProps {
  jobPosting: JobPostingDetails;
  onClick: () => void;
}

const JobListingCard: React.FC<JobListingCardProps> = ({ jobPosting, onClick }) => {
  return (


    <Tooltip title={jobPosting.jobTitle}>
      <Card
        title={<Tooltip title={jobPosting.jobTitle}>{jobPosting.jobTitle}</Tooltip>}
        extra={
          <a
            href="#"
            className="ml-3 text-xs font-medium text-primary-1 hover:text-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
            onClick={onClick}
          >
            View Applicants
          </a>
        }
        style={{ width: 320, margin: "16px", borderRadius: "8px" }}
        hoverable
      >
        <div style={{ marginBottom: "12px" }}>
          <p style={{ marginBottom: "6px" }}>
            <strong>Department:</strong> {jobPosting.department}
          </p>
          <p style={{ marginBottom: "6px" }}>
            <strong>Location:</strong> {jobPosting.companyAddress}
          </p>

          {/* Conditional Tag for Status */}
          <p style={{ marginBottom: "6px" }}>
            <strong>Status:</strong>&nbsp;
            {jobPosting.status === "Open" ? (
              <Tag color="green">Open</Tag>
            ) : jobPosting.status === "Closed" ? (
              <Tag color="red">Closed</Tag>
            ) : jobPosting.status === "On Hold" ? (
              <Tag color="orange">On Hold</Tag>
            ) : (
              <Tag>{jobPosting.status}</Tag>
            )}
          </p>

          <p style={{ marginBottom: "6px" }}>
            <strong>Salary:</strong> {formatCurrencyRange(jobPosting.minSalaryRange, jobPosting.maxSalaryRange)}
          </p>
        </div>
      </Card>
    </Tooltip>

  );
};

export default JobListingCard;