"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Image from "next/image";
import GoogleIcon from "./../../assets/icons/devicon_google.png";
import { Divider } from "../ui/Divider";
import Link from "next/link";

// Validation schema
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (values: {
    email: string;
    password: string;
    isAdmin?: boolean;
  }) => void;
  loginAsAdmin: boolean;
  setLoginAsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoginForm: React.FC<LoginFormProps> = ({
  isLoading,
  onSubmit,
}) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Google Login */}
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
          Log in using Google
        </Button>
      </div>

      <Divider text="or" />

      <div className="flex w-full justify-center items-center my-4">
        <p className="text-sm font-normal text-dark-1">
          Log in using email address
        </p>
      </div>

      {/* Email Field */}
      <div className="relative mb-4">
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
          className="w-full h-[38px] sm:h-[42px] md:h-[53px] px-3 rounded-md"
          status={formik.touched.email && formik.errors.email ? "error" : ""}
        />
        {formik.touched.email && formik.errors.email && (
          <span className="text-red-500 text-xs mt-1">
            {formik.errors.email}
          </span>
        )}
      </div>

      {/* Password Field */}
      <div className="relative">
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <Input.Password
          id="password"
          name="password"
          placeholder="Enter your password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          className="h-[38px] sm:h-[42px] md:h-[53px]"
          status={
            formik.touched.password && formik.errors.password ? "error" : ""
          }
        />
        {formik.touched.password && formik.errors.password && (
          <span className="text-red-500 text-xs mt-1">
            {formik.errors.password}
          </span>
        )}
      </div>

      {/* Forgot Password Link */}
      <div className="mb-2 sm:mb-3 md:mb-[28px] text-right mt-4">
        <a href="#" className="text-sm text-primary-1 hover:underline">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <div className="w-full h-[38px]">
        <Button
          type="primary"
          loading={isLoading}
          style={{
            width: "100%",
            height: "38px",
            backgroundColor: "black",
            borderColor: "black",
            color: "#ffffff",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Log in"}
        </Button>
      </div>

      {/* Sign-up Redirect */}
      <p className="text-sm font-normal text-center text-dark-1 mt-2 sm:mt-4">
        Need to create an account?{" "}
        <span className="text-primary-1 ml-1">
          <Link href="/signup">Sign up</Link>
        </span>
      </p>
    </form>
  );
};

export default LoginForm;
