import React from "react";
import { Card, Tag, List } from "antd";

interface MetricsItem {
  title: string;
  count: number;
  color: string;
}

const employeeMetrics: MetricsItem[]  = [
  { title: "Upcoming Deadlines", count: 3, color: "blue" },
  { title: "Pending Tasks", count: 7, color: "orange" },
  { title: "Completed Projects", count: 12, color: "green" },
  { title: "Team Meetings", count: 2, color: "purple" },
];

const EmployeeMetrics: React.FC = () => {
  return (
    <Card title="Employee Metrics" bordered={true} className="h-full">
    <List
      dataSource={employeeMetrics}
      renderItem={({ title, count, color }) => (
        <List.Item
          actions={[
            <Tag color={color} key={title}>
              {count}
            </Tag>,
          ]}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {title}
        </List.Item>
      )}
    />
  </Card>
  );
};

export default EmployeeMetrics;
