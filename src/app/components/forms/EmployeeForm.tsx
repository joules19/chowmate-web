import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import FileInput from "../ui/FileInput";
import SelectField from "../ui/SelectField";
import { Button } from "../ui/Button1";
import axios, { Axios, AxiosError } from "axios"; // Axios for making API requests
import { toast } from "sonner";
import { Alert, message } from "antd";
import axiosInstance from "../../lib/axiosInterceptor";
import { Employee } from "../../types/Employee";

const EmployeeForm: React.FC = () => {
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch positions, departments, and states on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [positionsRes, departmentsRes, statesRes] =
          await Promise.allSettled([
            axiosInstance.get("setups/positions"), // Fetch positions
            axiosInstance.get("setups/departments"), // Fetch departments
            axiosInstance.get("setups/states"), // Fetch states
          ]);

        // Check if each result is fulfilled before accessing data
        if (positionsRes.status === "fulfilled") {
          setPositions(positionsRes.value.data); // Access value.data when fulfilled
        } else {
        }

        if (departmentsRes.status === "fulfilled") {
          setDepartments(departmentsRes.value.data);
        } else {
        }

        if (statesRes.status === "fulfilled") {
          setStates(statesRes.value.data);
        } else {
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  // Fetch LGAs when a state is selected
  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStateCode = e.target.value;
    formik.setFieldValue("state", selectedStateCode);

    try {
      const response = await axiosInstance.get(
        `setups/lga-by-state-code?stateCode=${selectedStateCode}`
      );
      setLgas(response.data);
    } catch (error) {}
  };
  // Formik setup
  const formik = useFormik<Employee>({
    initialValues: {
      firstName: "",
      lastName: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      dob: "",
      hireDate: "",
      address: "",
      state: "",
      lga: "",
      passport: null,
      resume: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("FirstName is required"),
      lastName: Yup.string().required("LastName is required"),
      position: Yup.string().required("Position is required"),
      department: Yup.string().required("Department is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().matches(
        /^(\+?\d{1,3}[- ]?)?\d{10}$/,
        "Phone number is not valid"
      ),
      // .required("Phone is required")
      dob: Yup.date().required("Date of Birth is required"),
      hireDate: Yup.date().required("Hire date is required"),
      address: Yup.string().required("Address is required"),
      state: Yup.string().required("State is required"),
      lga: Yup.string().required("LGA is required"),
    }),
    onSubmit: async (values) => {
      console.log(values);

      const formData = new FormData();

      // Append fields to formData
      formData.append("firstName", values.firstName!);
      formData.append("lastName", values.lastName);
      formData.append("positionId", values.position);
      formData.append("departmentId", values.department);
      formData.append("email", values.email);
      formData.append("phoneNumber", values.phone);
      formData.append("dob", values.dob.toString());
      formData.append("hireDate", values.hireDate.toString());
      formData.append("address", values.address);
      formData.append("stateCode", values.state);
      formData.append("lgaId", values.lga);

      // Append files
      if (values.passport) {
        formData.append("passport", values.passport); // Append passport file
      }
      if (values.resume) {
        formData.append("resume", values.resume); // Append resume file
      }

      setIsLoading(true); // Show loading indicator
      try {
        // Make the API call
        const response = await axiosInstance.post(
          "employees/create-employee",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file uploads
            },
          }
        );

        // Success notification and further actions
        message.success("Employee created successfully");

        // Optionally reset the form after successful submission
        formik.resetForm();
      } catch (error: AxiosError | any) {
        message.error(error.response.data.message);
      } finally {
        setIsLoading(false); // Hide loading indicator
      }
    },
  });

  // Trigger the API call when resume is uploaded
  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("resume", file);
      setIsLoading(true);

      // Create a form data object
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Call the API endpoint
        const response = await axios.post(
          "http://localhost:8000/api/extract-info/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Assuming the response data contains personal information like name, email, etc.
        const { name, email, address, phone } = response.data;

        // Populate the form with the extracted data
        formik.setFieldValue("name", name || "");
        formik.setFieldValue("email", email || "");
        formik.setFieldValue("address", address || "");
        formik.setFieldValue("phone", phone || "");

        toast.success("Employee CV parsed successfully", {
          duration: 5000,
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading resume:", error);
        setIsLoading(false);
      }
    }
  };

  const customAlertStyle = {
    backgroundColor: "#E3F2FD", // Light shade of primary color for background
    borderColor: "#36A2EB", // Primary color for border
    color: "#0369A1", // Darker shade of primary color for text
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto">
      <div className="flex flex-wrap -mx-3">
        {/* Left column */}
        <div className="w-full md:w-1/2 px-3 mb-6">
          <InputField
            label="FirstName"
            id="firstName"
            name="firstName"
            value={formik.values.firstName!}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.firstName && formik.errors.firstName}
          />
          <InputField
            label="LastName"
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.lastName && formik.errors.lastName}
          />
          <SelectField
            label="Position"
            id="position"
            name="position"
            value={formik.values.position}
            options={positions.map((pos: any) => ({
              label: pos.name,
              value: pos.id,
            }))}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.position && formik.errors.position}
          />
          <SelectField
            label="Department"
            id="department"
            name="department"
            value={formik.values.department}
            options={departments.map((dept: any) => ({
              label: dept.name,
              value: dept.id,
            }))}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.department && formik.errors.department}
          />
          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.email && formik.errors.email}
          />
          <InputField
            label="Phone"
            id="phone"
            name="phone"
            type="tel"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            // required
            error={formik.touched.phone && formik.errors.phone}
          />
          <InputField
            label="Date of Birth"
            id="dob"
            name="dob"
            type="date"
            value={formik.values.dob}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.dob && formik.errors.dob}
          />
        </div>
        {/* Right column */}
        <div className="w-full md:w-1/2 px-3 mb-6">
          <InputField
            label="Address"
            id="address"
            name="address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.address && formik.errors.address}
          />
          <SelectField
            label="State"
            id="state"
            name="state"
            value={formik.values.state}
            options={states.map((state: any) => ({
              label: state.name,
              value: state.stateCode,
            }))}
            onChange={handleStateChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.state && formik.errors.state}
          />
          <SelectField
            label="LGA"
            id="lga"
            name="lga"
            value={formik.values.lga}
            options={lgas.map((lga: any) => ({
              label: lga.name,
              value: lga.id,
            }))}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.lga && formik.errors.lga}
          />
          <FileInput
            label="Passport Photo"
            id="passport"
            accept="image/*"
            onChange={(event) =>
              formik.setFieldValue("passport", event.currentTarget.files?.[0])
            }
            required
            error={formik.touched.passport && formik.errors.passport}
          />
          <div>
            <Alert
              message="Tip"
              description="You can upload employee resume to pre-fill the form."
              type="info"
              showIcon
              className="mb-4"
              style={customAlertStyle} // Custom style applied
            />
            <FileInput
              label="Resume"
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeUpload}
              required
              error={formik.touched.resume && formik.errors.resume}
            />
            <InputField
              label="Hire Date"
              id="hireDate"
              name="hireDate"
              type="date"
              value={formik.values.hireDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              error={formik.touched.hireDate && formik.errors.hireDate}
            />
          </div>
        </div>
      </div>
      <div className="w-[150px] h-[38px]">
        <Button
          mode={"solid"}
          buttonText="Save"
          loading={isLoading}
          defaultColor="primary-1"
          hoverColor="primary-2"
        />
      </div>
    </form>
  );
};

export default EmployeeForm;
