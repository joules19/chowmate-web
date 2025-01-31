import React from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ComplianceItem } from "../../types/payroll";

const columns: TableColumnsType<ComplianceItem> = [
  {
    title: "Regulation Type",
    dataIndex: "regulationType",
    width: "25%",
    filterSearch: true,
  },
  {
    title: "Due Date",
    dataIndex: "dueDate",
    width: "20%",
  },
  {
    title: "Responsible Person",
    dataIndex: "responsiblePerson",
    width: "20%",
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "15%",
    filters: [
      { text: "Completed", value: "Completed" },
      { text: "Pending", value: "Pending" },
      { text: "Overdue", value: "Overdue" },
    ],
    onFilter: (value, record) => record.status!.includes(value as string),
  },
  {
    title: "Actions",
    dataIndex: "actions",
    width: "10%",
    render: (_, record) => (
      <div className="flex space-x-2">
        <button
          className="text-primary-1 py-1 px-2 rounded"
          onClick={() => console.log("Edit", record)}
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>
        <button
          className="text-red-500 py-1 px-2 rounded"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

const data: ComplianceItem[] = [
  {
    id: 1,
    regulationType: "Type 1",
    description: "Develop and maintain user interfaces.",
    status: "Overdue",
    responsiblePerson: "Sam Adeniran",
    dueDate: "2024-09-01",
  },
];

const onChange: TableProps<ComplianceItem>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
};

const ComplianceTable: React.FC = () => (
  <div className="w-full">
    <Table
      scroll={{ x: 1200 }}
      columns={columns}
      dataSource={data}
      onChange={onChange}
      rowKey="id"
      className="bg-white shadow-md rounded-lg"
    />
  </div>
);

export default ComplianceTable;
