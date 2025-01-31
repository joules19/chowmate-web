import React from "react";
import { List } from "antd";
import { mockEmployees } from "../data/mockDocument";

interface EmployeeSelectorProps {
  selectedDepartment: string;
  onSelectEmployee: (employeeId: string) => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  selectedDepartment,
  onSelectEmployee,
}) => {
  const filteredEmployees = selectedDepartment === "All Departments"
    ? mockEmployees
    : mockEmployees.filter(employee => employee.department === selectedDepartment);

  return (
    <List
      header={<div className="font-bold">Select Employee</div>}
      bordered
      dataSource={filteredEmployees}
      renderItem={(employee) => (
        <List.Item
          className="cursor-pointer hover:bg-gray-100"
          onClick={() => onSelectEmployee(employee.id)}
        >
          {employee.name}
        </List.Item>
      )}
    />
  );
};

export default EmployeeSelector;