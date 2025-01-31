import React from "react";
import { Table, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { JobApplications } from "../../types/onboarding";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatStringToDate } from "../../utils/helperMethods";

interface ApplicationTableProps {
  applications: JobApplications[];
  onEdit: (application: JobApplications) => void;
  onDelete: (id: number) => void;
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications, onEdit, onDelete }) => {
  const columns: TableColumnsType<JobApplications> = [
    {
      title: "Applicant Name",
      dataIndex: "firstName",
      width: "20%",
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      width: "20%",
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
    },
    {
      title: "Status",
      dataIndex: "statusText",
      width: "15%",
      filters: [
        { text: "Applied", value: "Applied" },
        { text: "Screening", value: "Screening" },
        { text: "Interview", value: "Interview" },
        { text: "Offered", value: "Offered" },
        { text: "Hired", value: "Hired" },
        { text: "Rejected", value: "Rejected" },
      ],
      onFilter: (value, record) => record.statusText.includes(value as string),
      render: (statusText) => {
        let color = "";
        let label = "";

        if (statusText === "Applied") {
          color = "blue";
          label = "Applied";
        } else if (statusText === "Screening") {
          color = "orange";
          label = "Screening";
        } else if (statusText === "Interview") {
          color = "purple";
          label = "Interview";
        } else if (statusText === "Offered") {
          color = "green";
          label = "Offered";
        } else if (statusText === "Hired") {
          color = "cyan";
          label = "Hired";
        } else if (statusText === "Rejected") {
          color = "red";
          label = "Rejected";
        }

        return <Tag color={color}>{label}</Tag>;
      },
    }
    ,
    {
      title: "Date Applied",
      dataIndex: "applicationDate",
      width: "15%",
      render: (_, record) => (<>{formatStringToDate(record.applicationDate)}</>),
      sorter: (a, b) => new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime(),
    },
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
          {/* <button
            className="text-red-500 py-1 px-2 rounded"
            onClick={() => onDelete(record.id)}
          >
            <TrashIcon className="w-4 h-4" />
          </button> */}
        </div>
      ),
    },
  ];

  return (
    <Table
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={applications}
      rowKey="id"
      className="bg-white shadow-md rounded-lg"
    />
  );
};

export default ApplicationTable;
