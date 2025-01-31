import React from "react";
import { Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { ApplicantInterview, JobApplications } from "../../types/onboarding";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";

interface InterviewTableProps {
  interviews: ApplicantInterview[];
  onEdit: (interview: ApplicantInterview) => void;
  onDelete: (id: number) => void;
}

const InterviewTable: React.FC<InterviewTableProps> = ({ interviews, onEdit, onDelete }) => {
  const columns: TableColumnsType<ApplicantInterview> = [
    {
      title: "Applicant Name",
      dataIndex: "fullname",
      width: "20%",
      sorter: (a, b) => a.fullname.localeCompare(b.fullname),
    },
    {
      title: "Phone",
      dataIndex: "applicatMobile",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "applicantEmail",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "statusName",
      width: "15%",
      filters: [
        { text: "Scheduled", value: "Scheduled" },
        { text: "Interviewed", value: "Interviewed" },
      ],
      onFilter: (value, record) => record.statusName.includes(value as string),
      render: (statusName) => {
        let color = "";
        let label = "";

        if (statusName === "Scheduled") {
          color = "orange";
          label = "Scheduled";
        } else if (statusName === "Interviewed") {
          color = "green";
          label = "Interviewed";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    // {
    //   title: "Date Applied",
    //   dataIndex: "dateCreated",
    //   width: "15%",
    //   render: (_, record) => (<>{formatStringToDate(record.dateCreated)}</>),
    //   sorter: (a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime(),
    // },
    {
      title: "Actions",
      dataIndex: "actions",
      width: "10%",
      render: (_, record) => (
        <div className="flex space-x-2">
          <button
            className="text-primary-1 py-1 px-2 rounded"
            onClick={() => onEdit(record)}
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];


  return (
    <Table
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={interviews}
      rowKey="id"
      className="bg-white shadow-md rounded-lg"
    />
  );
};

export default InterviewTable;
