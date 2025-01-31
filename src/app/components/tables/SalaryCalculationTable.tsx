// import React, { useState, useEffect } from "react";
// import { Table } from "antd";
// import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

// interface SalaryRecord {
//   id: number;
//   employeeId: string;
//   employeeName: string;
//   baseSalary: number;
//   effectiveDate: string;
//   adjustmentType: "Increment" | "Decrement" | "Bonus" | "Initial";
//   adjustmentAmount: number;
//   reason: string;
// }

// const columns = [
//   {
//     title: "Employee ID",
//     dataIndex: "employeeId",
//     key: "employeeId",
//     width: "20%",
//   },
//   {
//     title: "Employee Name",
//     dataIndex: "employeeName",
//     key: "employeeName",
//     width: "20%",
//   },
//   {
//     title: "Current Salary",
//     dataIndex: "currentSalary",
//     key: "currentSalary",
//     width: "20%",
//     render: (_: any, record: any) =>
//       `$${record.baseSalary + record.adjustmentAmount}`,
//   },
//   {
//     title: "Effective Date",
//     dataIndex: "effectiveDate",
//     key: "effectiveDate",
//     width: "15%",
//   },
//   {
//     title: "Actions",
//     dataIndex: "actions",
//     key: "actions",
//     width: "10%",
//     render: (_: any, record: any) => (
//       <div className="flex space-x-2">
//         <button className="text-primary-1" onClick={() => handleEdit(record)}>
//           <PencilSquareIcon className="w-4 h-4" />
//         </button>
//         <button
//           className="text-red-500"
//           onClick={() => handleDelete(record.id)}
//         >
//           <TrashIcon className="w-4 h-4" />
//         </button>
//       </div>
//     ),
//   },
// ];

// const SalaryTable: React.FC = () => {
//   const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);

//   useEffect(() => {
//     // Fetch records from storage or API
//     const savedRecords = localStorage.getItem("salaryRecords");
//     if (savedRecords) {
//       setSalaryRecords(JSON.parse(savedRecords));
//     }
//   }, []);

//   return (
//     <Table
//       columns={columns}
//       dataSource={salaryRecords}
//       rowKey="id"
//       pagination={{ pageSize: 5 }}
//       className="w-full"
//     />
//   );
// };

// export default SalaryTable;
