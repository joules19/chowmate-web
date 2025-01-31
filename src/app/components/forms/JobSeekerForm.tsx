"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input, message, Select } from "antd";
import Image from "next/image";
import GoogleIcon from "./../../assets/icons/devicon_google.png";
import { Divider } from "../ui/Divider";
import countries from "./../../assets/countries.json";
import { CountryForSelect } from "@/app/data/types/select";
import PasswordField from "../ui/PasswordField";
import { isPasswordValid } from "@/app/lib/helperFunctions";
import SkillsInput from "../ui/SkillsInput";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9]{7,15}$/, "Invalid phone number")
    .required("Phone number is required"),
  country: Yup.string().required("Country is required"),
});

const JobSeekerForm: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [skills, setSkills] = useState<string[] | null>([]);

  const skillSuggestions = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Django",
    "CSS",
    "HTML",
    "C#",
    ".NET",
    "SQL",
    "Java",
    "Kotlin",
    "Swift",
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      // skills: [],
      country: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Submitted values:", values);
      console.log(password);
      console.log(skills);

      if (password !== confirmPassword) {
        message.warning("Passwords do not match");
        return;
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col gap-6 w-full sm:w-[700px]"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold text-dark-1">
          Register as a Job Seeker
        </h2>
        <p className="text-dark-1 text-sm">
          Sign up with your Google account or use the form.
        </p>
      </div>

      {/* Google Login */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="h-[38px] w-full">
          <Button
            type="default"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderColor: "#d9d9d9",
              backgroundColor: "#ffffff",
              transition: "background-color 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f5f5f5";
              e.currentTarget.style.color = "#282828";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#ffffff")
            }
            icon={
              <Image
                src={GoogleIcon}
                alt="Google Icon"
                style={{
                  width: "20px",
                  height: "20px",
                  marginRight: "8px",
                }}
              />
            }
          >
            Sign up using Google
          </Button>
        </div>

        <Divider text="or" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* First Row */}
        <div className="relative">
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-[42px] px-3 rounded-md text-sm text-[#4c4c4c]"
            // status={
            //   formik.touched.firstName && formik.errors.firstName ? "error" : ""
            // }
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.firstName}
            </span>
          )}
        </div>

        <div className="relative">
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-[42px] px-3 rounded-md text-sm text-[#4c4c4c]"
            // status={
            //   formik.touched.lastName && formik.errors.lastName ? "error" : ""
            // }
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.lastName}
            </span>
          )}
        </div>

        {/* Second Row */}
        <div className="relative">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-[42px] px-3 rounded-md text-xs text-[#4c4c4c]"
            // status={formik.touched.email && formik.errors.email ? "error" : ""}
          />
          {formik.touched.email && formik.errors.email && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>

        <div className="relative">
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="Enter your phone number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full h-[42px] px-3 rounded-md text-sm text-[#4c4c4c]"
            // status={formik.touched.phone && formik.errors.phone ? "error" : ""}
          />
          {formik.touched.phone && formik.errors.phone && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.phone}
            </span>
          )}
        </div>

        {/* Third Row */}
        <SkillsInput
          suggestions={skillSuggestions}
          finalSkills={skills!}
          setFinalSkills={setSkills}
        />

        <div className="relative">
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            Country
          </label>
          <Select
            id="country"
            placeholder="Select your country" // This will show when no value is selected
            value={formik.values.country || undefined} // Ensure value is undefined if empty
            onChange={(value: string) => formik.setFieldValue("country", value)}
            onBlur={() => formik.setFieldTouched("country", true)}
            className="w-full"
            // status={
            //   formik.touched.country && formik.errors.country
            //     ? "error"
            //     : undefined
            // }
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.props?.value?.toLowerCase().includes(input.toLowerCase())
            }
            style={{
              width: "100%",
              height: "42px",
              borderRadius: "6px",
            }}
          >
            {countries.map((country: CountryForSelect, index: number) => (
              <Option key={index} value={country.name}>
                <div className="flex items-center">
                  <img
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                    className="w-5 h-3 mr-2"
                  />
                  {country.name}
                </div>
              </Option>
            ))}
          </Select>
          {formik.touched.country && formik.errors.country && (
            <span className="text-red-500 text-xs mt-1">
              {formik.errors.country}
            </span>
          )}
        </div>

        {/* PASSWORD */}
        <PasswordField
          labelText="Password"
          showPasswordCriteria={true}
          password={password}
          setPassword={setPassword}
        />
        {/* CONFIRM PASSWORD */}
        <PasswordField
          labelText="Confirm Password"
          showPasswordCriteria={false}
          password={confirmPassword}
          setPassword={setConfirmPassword}
        />
      </div>

      {/* Submit Button */}
      <div className="w-full">
        <Button
          htmlType="submit"
          type="text"
          style={{
            width: "100%",
            height: "38px",
            color: "#ffffff",
            background: "#000",
          }}
          disabled={!isPasswordValid(password)}
        >
          Create my account
        </Button>
      </div>
    </form>
  );
};

export default JobSeekerForm;
