import React from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { OnboardingStep } from "../../types/onboarding";

// Define columns based on OnboardingStep schema
const columns: TableColumnsType<OnboardingStep> = [
  {
    title: "Step Name",
    dataIndex: "stepName",
    width: "30%",
    filterSearch: true,
  },
  {
    title: "Description",
    dataIndex: "description",
    width: "30%",
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    width: "20%",
    sorter: (a, b) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "10%",
    filters: [
      { text: "Not Started", value: "Not Started" },
      { text: "In Progress", value: "In Progress" },
      { text: "Completed", value: "Completed" },
    ],
    onFilter: (value, record) => record.status.includes(value as string),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    width: "10%",
    render: (_, record) => (
      <div className="flex space-x-2">
        <button
          className="text-blue-500 py-1 px-2 rounded"
          onClick={() => console.log("Edit", record)}
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button
          className="text-red-500 py-1 px-2 rounded"
          onClick={() => console.log("Delete", record.id)}
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

// Sample data for OnboardingStep
const data: OnboardingStep[] = [
  {
    id: 1,
    stepName: "Introduction to Team",
    description: "Meet the team and learn about the project.",
    dueDate: "2024-09-20",
    status: "Not Started",
  },
  {
    id: 2,
    stepName: "Complete Documentation",
    description: "Read and understand the documentation.",
    dueDate: "2024-09-25",
    status: "In Progress",
  },
  {
    id: 3,
    stepName: "Setup Development Environment",
    description: "Install necessary tools and clone the repository.",
    dueDate: "2024-09-15",
    status: "Completed",
  },
];

// Handle table changes (filters, sorting, pagination)
const onChange: TableProps<OnboardingStep>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("Table parameters", pagination, filters, sorter, extra);
};

// Component to render the table
const OnboardingStepTable: React.FC = () => (
  <div className="w-full">
    <Table
      scroll={{ x: 500 }}
      columns={columns}
      dataSource={data}
      onChange={onChange}
      rowKey="id"
      className="bg-white shadow-md rounded-lg"
    />
  </div>
);

export default OnboardingStepTable;
