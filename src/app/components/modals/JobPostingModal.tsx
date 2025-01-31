import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import { Button } from "../ui/Button1";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { JobPosting, JobPostingDetails } from "../../types/onboarding";
import { usePostJobMutation } from "../../store/services/recruitmentApi";
import { message } from "antd";
import { useGetDepartmentsQuery } from "../../store/services/setupApi";

const JobModes = [
  { value: "1", label: "Full-time" },
  { value: "2", label: "Part-time" },
  { value: "3", label: "Internship" },
];

const WorkModes = [
  { value: "1", label: "Onsite" },
  { value: "2", label: "Remote" },
  { value: "3", label: "Hybrid" },
];

interface JobPostingModalProps {
  show: boolean;
  handleClose: () => void;
  currentPosting: JobPostingDetails | null;
  onSave: (posting: JobPostingDetails) => void;
}

const JobPostingModal: React.FC<JobPostingModalProps> = ({
  show,
  handleClose,
  currentPosting,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [
    postJob,
    { isLoading: isJobPosting, data: postJobSuccess, error: postJobFailure },
  ] = usePostJobMutation();
  const { data: departments, isLoading: loadingDepartments } =
    useGetDepartmentsQuery(undefined);

  const [departmentOptions, setDepartmentOptions] = useState([]);

  // Populate department options once departments are fetched
  useEffect(() => {
    if (departments) {
      const options = departments.map((dept: { id: string; name: string }) => ({
        value: dept.id,
        label: dept.name,
      }));
      setDepartmentOptions(options);
    }
  }, [departments]);

  useEffect(() => {
    if (postJobSuccess) {
      message.success("Application created successfully");
      handleClose();
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      return;
    } else if (postJobFailure) {
      message.error("Application creation failed");
    }
  }, [postJobSuccess]);

  // Formik setup
  const formik = useFormik<JobPostingDetails>({
    initialValues: {
      jobTitle: currentPosting?.jobTitle || "",
      departmentId: currentPosting?.departmentId || "",
      companyAddress: currentPosting?.companyAddress || "",
      description: currentPosting?.description || "",
      qualifications: currentPosting?.qualifications || [""],
      responsibilities: currentPosting?.responsibilities || [""],
      benefits: currentPosting?.benefits || [""],
      status: currentPosting?.status || "Open",
      postingDate:
        currentPosting?.postingDate || new Date().toISOString().split("T")[0],
      minSalaryRange: currentPosting?.minSalaryRange || "",
      maxSalaryRange: currentPosting?.maxSalaryRange || "",
      jobMode: currentPosting?.jobMode || "",
      workMode: currentPosting?.workMode || "",
    },
    validationSchema: Yup.object({
      jobTitle: Yup.string().required("Job Title is required"),
      departmentId: Yup.string().required("Department is required"),
      companyAddress: Yup.string().required("Company Address is required"),
      description: Yup.string().required("Description is required"),
      qualifications: Yup.array()
        .of(Yup.string().required("Qualification is required"))
        .min(1, "At least one qualification is required"),
      responsibilities: Yup.array()
        .of(Yup.string().required("Requirement is required"))
        .min(1, "At least one requirement is required"),
      benefits: Yup.array()
        .of(Yup.string().required("Benefit is required"))
        .min(1, "At least one benefit is required"),
      status: Yup.string().required("Status is required"),
      minSalaryRange: Yup.number()
        .min(0, "Salary must be positive")
        .required("Minimum salary is required"),
      maxSalaryRange: Yup.number()
        .min(
          Yup.ref("minSalaryRange"),
          "Maximum salary must be greater than minimum salary"
        )
        .required("Maximum salary is required"),
      jobMode: Yup.string().required("Job type is required"),
      workMode: Yup.string().required("Work location type is required"),
    }),
    onSubmit: (values) => {
      const newPosting: JobPostingDetails = {
        ...values,
        jobMode: parseInt(values.jobMode.toString()),
        workMode: parseInt(values.workMode.toString()),
        qualifications: values.qualifications.filter((q) => q.trim() !== ""),
        responsibilities: values.responsibilities.filter(
          (r) => r.trim() !== ""
        ),
        benefits: values.benefits.filter((b) => b.trim() !== ""),
      };
      postJob(newPosting);
    },
  });

  const handleAddField = (
    field: "qualifications" | "responsibilities" | "benefits"
  ) => {
    formik.setFieldValue(field, [...formik.values[field], ""]);
  };

  const handleRemoveField = (
    field: "qualifications" | "responsibilities" | "benefits",
    index: number
  ) => {
    const newFieldValues = formik.values[field].filter((_, i) => i !== index);
    formik.setFieldValue(field, newFieldValues);
  };

  const renderDynamicFields = (
    field: "qualifications" | "responsibilities" | "benefits",
    values: string[],
    label: string
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {values.map((value, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            id={`${field}-${index}`}
            name={`${field}[${index}]`}
            value={value}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="flex-grow mr-2 p-2 border-[.8px] border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-1"
            required
          />
          <button
            type="button"
            onClick={() => handleAddField(field)}
            className="text-green-500 py-1 px-2 rounded"
          >
            <PlusCircleIcon className="w-4 h-4" />
          </button>
          {values.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveField(field, index)}
              className="text-red-500 py-1 px-2 rounded"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      {formik.touched[field] && formik.errors[field] && (
        <p className="mt-1 text-xs text-red-500">{formik.errors[field]}</p>
      )}
    </div>
  );

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {currentPosting ? "Edit Job Posting" : "Add New Job Posting"}
            </h3>
            <form onSubmit={formik.handleSubmit}>
              <InputField
                label="Job Title"
                id="jobTitle"
                name="jobTitle"
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.jobTitle && formik.errors.jobTitle}
              />
              <SelectField
                label="Department"
                id="departmentId"
                name="departmentId"
                value={formik.values.departmentId}
                options={departmentOptions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={
                  formik.touched.departmentId && formik.errors.departmentId
                }
              />
              <InputField
                label="Company Address"
                id="companyAddress"
                name="companyAddress"
                value={formik.values.companyAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={
                  formik.touched.companyAddress && formik.errors.companyAddress
                }
              />
              <TextAreaField
                label="Description"
                id="description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.description && formik.errors.description}
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Salary Range
                </label>
                <div className="flex space-x-2">
                  <InputField
                    id="minSalaryRange"
                    name="minSalaryRange"
                    value={formik.values.minSalaryRange}
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={
                      formik.touched.minSalaryRange &&
                      formik.errors.minSalaryRange
                    }
                  />
                  <InputField
                    id="maxSalaryRange"
                    name="maxSalaryRange"
                    value={formik.values.maxSalaryRange}
                    type="number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={
                      formik.touched.maxSalaryRange &&
                      formik.errors.maxSalaryRange
                    }
                  />
                </div>
              </div>
              <SelectField
                label="Job Type"
                id="jobMode"
                name="jobMode"
                value={formik.values.jobMode.toString()}
                options={WorkModes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.jobMode && formik.errors.jobMode}
              />
              <SelectField
                label="Work Location Type"
                id="workMode"
                name="workMode"
                value={formik.values.workMode.toString()}
                options={JobModes}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                error={formik.touched.workMode && formik.errors.workMode}
              />
              {renderDynamicFields(
                "qualifications",
                formik.values.qualifications,
                "Qualifications"
              )}
              {renderDynamicFields(
                "responsibilities",
                formik.values.responsibilities,
                "responsibilities"
              )}
              {renderDynamicFields(
                "benefits",
                formik.values.benefits,
                "Benefits"
              )}

              <div className="flex justify-end space-x-2 mt-4">
                <div className="flex gap-2 w-[308px] h-[38px]">
                  <div className="flex flex-1">
                    <Button
                      onClick={handleClose}
                      mode="outline"
                      buttonText="Close"
                      defaultColor="primary-1"
                      hoverColor="primary-2"
                    />
                  </div>
                  <div className="flex flex-1">
                    <Button
                      mode={"solid"}
                      buttonText="Save"
                      loading={isJobPosting}
                      defaultColor="primary-1"
                      hoverColor="primary-2"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default JobPostingModal;
