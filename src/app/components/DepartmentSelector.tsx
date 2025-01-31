import React from "react";
import { Select } from "antd";
import { mockDepartments } from "../data/mockDocument";

const { Option } = Select;

interface DepartmentSelectorProps {
  selectedDepartment: string;
  onSelectDepartment: (department: string) => void;
}

const DepartmentSelector: React.FC<DepartmentSelectorProps> = ({
  selectedDepartment,
  onSelectDepartment,
}) => {
  return (
    <div>
      <h3 className="font-bold mb-2">Select Department</h3>
      <Select
        style={{ width: "100%" }}
        value={selectedDepartment}
        onChange={onSelectDepartment}
      >
        {mockDepartments.map((department) => (
          <Option key={department} value={department}>
            {department}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default DepartmentSelector;