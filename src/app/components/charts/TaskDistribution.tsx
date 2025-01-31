import React from "react";
import { Card } from "antd";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";


ChartJS.register(Title, Tooltip, Legend, ArcElement);

const taskDistribution = {
  labels: ["Completed", "In Progress", "Pending"],
  datasets: [
    {
      data: [65, 25, 10],
      backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      borderColor: ["#2E8BE3", "#E6B94D", "#E65B76"],
      borderWidth: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom" as const,
    },
    title: {
      display: true,
      text: "Task Distribution",
    },
  },
}


const TaskDistribution: React.FC = () => {
  return (
    <Card title="Task Distribution" bordered={true} className="h-full">
    <div className="h-64 flex justify-center items-center">
      <Pie data={taskDistribution} options={chartOptions} />
    </div>
  </Card>
  )
}

export default TaskDistribution;
