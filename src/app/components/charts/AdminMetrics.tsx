import React from "react";
import { Card, Tag, List } from "antd";

interface MetricsItem {
  title: string;
  count: number;
  color: string;
}

const metrics: MetricsItem[] = [
  { title: "Open Positions", count: 3, color: "blue" },
  { title: "Ongoing Interviews", count: 0, color: "cyan" },
  { title: "Pending Reviews", count: 0, color: "orange" },
  { title: "Upcoming Trainings", count: 0, color: "green" },
  { title: "Leave Requests", count: 0, color: "red" },
];

const AdminMetrics: React.FC = () => {
  return (
    <div className="col-12 col-lg-6">
      <Card title="Admin Metrics" bordered={true}>
        <List
          dataSource={metrics}
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
    </div>
  );
};

export default AdminMetrics;
