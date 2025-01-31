import React from "react";
import { Table, Tag, Spin } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { EmployeeDetails } from "../../types/Employee";
import { calculateAge, capitalizeFirstLetterOfEachWord } from "../../utils/helperMethods";
import { useGetEmployeesQuery } from "../../store/services/employeeApi";

const columns: TableColumnsType<EmployeeDetails> = [
  {
    title: "Name",
    dataIndex: "name",
    filterSearch: true,
    onFilter: (value, record) => record.firstName!.includes(value as string),
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
    filterSearch: true,
    onFilter: (value, record) => record.email!.includes(value as string),
    width: "20%",
  },
  // {
  //   title: "Age",
  //   dataIndex: "age",
  //   sorter: (a, b) => calculateAge(a.dob!) - calculateAge(b.dob!),
  //   width: "10%",
  // },
  {
    title: "Position",
    dataIndex: "position",
    filters: [
      { text: "Manager", value: "Manager" },
      { text: "Software Engineer", value: "Software Engineer" },
      { text: "HR Specialist", value: "HR Specialist" },
    ],
    onFilter: (value, record) => record.position!.includes(value as string),
    filterSearch: true,
    width: "15%",
  },
  {
    title: "Department",
    dataIndex: "department",
    filters: [
      { text: "Engineering", value: "Engineering" },
      { text: "Human Resources", value: "Human Resources" },
      { text: "Marketing", value: "Marketing" },
    ],
    onFilter: (value, record) => record.department!.includes(value as string),
    width: "15%",
  },
  // {
  //   title: "Hire Date",
  //   dataIndex: "hireDate",
  //   sorter: (a, b) =>
  //     new Date(a.hireDate!).getTime() - new Date(b.hireDate!).getTime(),
  //   width: "10%",
  // },
  {
    title: "Status",
    dataIndex: "status",
    filters: [
      { text: "Active", value: "Active" },
      { text: "On Leave", value: "On Leave" },
      { text: "Resigned", value: "Resigned" },
    ],
    onFilter: (value, record) => record.status!.includes(value as string),
    width: "10%",
    render: (status) => {
      let color = "green"; // Default color for "Active"
      if (status === "On Leave") {
        color = "orange";
      } else if (status === "Resigned") {
        color = "red";
      }
      return <Tag color={color}>{status}</Tag>;
    },
  },
];

const onChange: TableProps<EmployeeDetails>["onChange"] = (
  pagination,
  filters,
  sorter,
  extra
) => {
  console.log("params", pagination, filters, sorter, extra);
};

const EmployeeListTable: React.FC = () => {
  const { data, error, isLoading } = useGetEmployeesQuery(undefined);

  // if (isLoading) return <Spin />; // Display Ant Design's default spinner
  if (error) return <div>Error loading data</div>;

  const employeeData = data?.map((employee: EmployeeDetails, index: any) => ({
    key: employee.id,
    name: capitalizeFirstLetterOfEachWord(`${employee.firstName} ${employee.lastName}`),
    age: calculateAge(employee.dob!),
    position: employee.position || "N/A",
    department: employee.department || "N/A",
    address: employee.address || "N/A",
    email: employee.email || "N/A",
    hireDate: new Date(employee.hireDate!).toLocaleDateString(),
    status: employee.status || "Active", // Assume status is active unless specified
  }));

  return (
    <div className="w-full">
      <Table
        scroll={{ x: 600 }}
        columns={columns}
        dataSource={employeeData}
        onChange={onChange}
        loading={isLoading}
      />
    </div>
  );
};

export default EmployeeListTable;
