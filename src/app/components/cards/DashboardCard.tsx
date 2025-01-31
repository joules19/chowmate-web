import React from "react";
import { Card, Typography } from "antd";
import { formatter1 } from "../../utils/helperMethods";

// Define the props for the DashboardCard component
interface DashboardCardProps {
  icon: any; // Correct typing for the icon component
  color: string;
  title: string;
  count?: any;
  isMoney?: boolean;
  amount?: string | number;
}

// Create the DashboardCard component
const DashboardCard: React.FC<DashboardCardProps> = ({
  count,
  title,
  icon: Icon,
  color,
  isMoney,
}) => {
  return (
    <div className="col-12 col-md-4 mb-3 mb-md-0">
      <Card
        bordered={true}
        bodyStyle={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Render the passed icon with the specified color */}
        <Icon style={{ fontSize: "2.5rem", color }} />

        {/* Card Title */}
        <Typography.Title
          level={5}
          style={{ color: "#686868", marginTop: "10px" }}
        >
          {title}
        </Typography.Title>

        {/* Card Content */}
        {!isMoney && (
          <Typography.Text
            strong
            style={{ color: "#282828", fontSize: "2rem" }}
          >
            {count}
          </Typography.Text>
        )}
        {isMoney && (
          <Typography.Text
            strong
            style={{ color: "#282828", fontSize: "2rem" }}
          >
            {formatter1(count!)}
          </Typography.Text>
        )}
      </Card>
    </div>
  );
};

export default DashboardCard;
