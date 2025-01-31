import React from "react";
import { Card, Spin, Empty } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { useGetDepartmentsQuery } from "../../store/services/setupApi";

// Register necessary Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const DepartmentDistribution: React.FC = () => {
  // Fetch departments from the API
  const { data: departments, isLoading, isError } = useGetDepartmentsQuery(undefined);

  // Handle different states
  if (isLoading) {
    return (
      <div className="col-12 col-lg-6 mb-3 mb-lg-0">
        <Card
          title="Department Distribution"
          bordered={true}
          style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
        >
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  if (isError || !departments || departments.length === 0) {
    return (
      <div className="col-12 col-lg-6 mb-3 mb-lg-0">
        <Card
          title="Department Distribution"
          bordered={true}
          style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}
        >
          <div className="fancy-placeholder">
            <h3 className="text-xl font-bold text-primary-1">No Departments Available</h3>
            <p className="text-sm text-primary-1">We couldn't load department data at the moment. Stay tuned for updates!</p>
            <div className="mt-4 text-primary-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-pie-chart"
                width="48"
                height="48"
              >
                <path d="M21.21 15.89A10 10 0 1 0 12 22v-9h9a9.99 9.99 0 0 0 .21 2.89z"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
              </svg>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = {
    labels: departments.map((dept: any) => dept.name),
    datasets: [
      {
        data: departments.map((dept: any) =>
          10
        ),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#8BC34A", "#FFC107"],
      },
    ],
  };

  return (
    <div className="col-12 col-lg-6 mb-3 mb-lg-0">
      <Card
        title="Department Distribution"
        bordered={true}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ height: "400px", width: "100%" }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DepartmentDistribution;
