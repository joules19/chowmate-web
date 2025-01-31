import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import { Button } from "../ui/Button1";

const jobModes = ["Full-time", "Part-time", "Contract", "Internship"];

interface JobHistory {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  jobMode: string;
  responsibilities: string;
}

const JobHistoryForm: React.FC = () => {
  const formik = useFormik<JobHistory>({
    initialValues: {
      companyName: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      jobMode: "",
      responsibilities: "",
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Company name is required"),
      jobTitle: Yup.string().required("Job title is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date().min(
        Yup.ref("startDate"),
        "End date can't be before start date"
      ),
      jobMode: Yup.string().required("Job type is required"),
      responsibilities: Yup.string().required("Responsibilities are required"),
    }),
    onSubmit: (values) => {},
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 mb-6">
          <InputField
            label="Company Name"
            id="companyName"
            name="companyName"
            value={formik.values.companyName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.companyName && formik.errors.companyName}
          />
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
          <InputField
            label="Start Date"
            id="startDate"
            name="startDate"
            type="date"
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.startDate && formik.errors.startDate}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6">
          <InputField
            label="End Date"
            id="endDate"
            name="endDate"
            type="date"
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && formik.errors.endDate}
          />
          <SelectField
            label="Job Type"
            id="jobMode"
            name="jobMode"
            value={formik.values.jobMode}
            options={jobModes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.jobMode && formik.errors.jobMode}
          />
          <InputField
            label="Responsibilities"
            id="responsibilities"
            name="responsibilities"
            value={formik.values.responsibilities}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={
              formik.touched.responsibilities && formik.errors.responsibilities
            }
            as="textarea"
            rows={4}
          />
        </div>
      </div>
      <div className="w-[150px] h-[38px]">
        <Button
          mode="solid"
          buttonText="Add Job History"
          defaultColor="primary-1"
          hoverColor="primary-2"
        />
      </div>
    </form>
  );
};

export default JobHistoryForm;
