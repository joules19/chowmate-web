import React, { useEffect, useState } from "react";
import { CloudArrowDownIcon, XCircleIcon } from "@heroicons/react/24/outline";
import axiosInstance from "../../lib/axiosInterceptor";
import { message } from "antd";
import { Button } from "../ui/Button1";
import { Link, useNavigate } from "react-router-dom";
import { PathEnum } from "../../enums/Common";

interface BulkUploadModalProps {
  isOpen: boolean;
  handleClose: () => void;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  handleClose,
}) => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (uploadSuccess) {
      message.success("Employees uploaded successfully!");
      setTimeout(() => {
        window.location.href = PathEnum.Admin.Employees.List;
      }, 1500);
    } else if (uploadSuccess === false) {
      message.error("Failed to upload employees. Please try again.");
    }
  }, [uploadSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const response = await axiosInstance.post(
        "/employees/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total!
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      // Ensure progress reaches 100% only after the upload finishes
      setUploadProgress(100);
      setUploadSuccess(true);
    } catch (error) {
      setUploadSuccess(false);
      console.error("Failed to upload employees", error);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = async () => {
    setLoading(true); // Show spinner while downloading
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const response = await axiosInstance({
        url: "employees/download-template", // C# API endpoint
        method: "GET",
        responseType: "blob", // Important to get the response as a blob (binary data)
      });

      // Create a blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a download link and click it programmatically
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "EmployeeTemplate.xlsx"; // File name to download
      link.click();
    } catch (error) {
      console.error("Error downloading template", error);
    } finally {
      setLoading(false); // Hide spinner after download completes
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <button className="absolute top-4 right-4" onClick={handleClose}>
          <XCircleIcon className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Bulk Upload Employees</h2>

        {/* Upload input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Employee File
          </label>
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary-2 hover:file:bg-blue-100"
          />
        </div>

        {/* Upload button */}
        <div className="flex gap-2 w-full h-[38px]">
          <Button
            mode="solid"
            buttonText={isUploading ? "Uploading..." : "Upload Employee File"}
            onClick={handleUpload}
            defaultColor="primary-1"
            hoverColor="primary-2"
            disabled={!file || isUploading}
            loading={isUploading}
          />
        </div>

        {/* Download template button */}
        <Link
          onClick={downloadTemplate}
          to="#"
          className="w-full flex   rounded-md mt-2  py-[6px] text-sm font-semibold text-primary-1  hover:text-primary-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-1"
        >
          {loading ? (
            "Downloading..."
          ) : (
            <div className="flex items-center gap-2">
              <CloudArrowDownIcon className="w-5 h-5" /> Download Template
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default BulkUploadModal;
