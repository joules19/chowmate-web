"use client";
import React, { useEffect, useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface InputFieldProps {
  label?: string;
  id: string;
  placeholder?: string;
  name: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  error?: string | false;
  heightMobile?: string; // Dynamic height for mobile
  heightSm?: string; // Dynamic height for small screens
  heightMd?: string; // Dynamic height for medium screens
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  id,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  required = false,
  readOnly = false,
  error = "",
  heightMobile = "53px",
  heightSm = "42px",
  heightMd = "53px",
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [height, setHeight] = useState("");
  const [smHeight, setSmHeight] = useState("");
  const [mdHeight, setMdHeight] = useState("");

  useEffect(() => {
    setHeight(`h-[${heightMobile}]`);
    setSmHeight(`sm:h-[${heightSm}]`);
    setMdHeight(`md:h-[${heightMd}]`);
  }, [heightMobile, heightSm, heightMd]);

  return (
    <div className="mb-4 relative">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          placeholder={placeholder}
          type={type === "password" && !passwordVisible ? "password" : type === "password" ? "text" : type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          readOnly={readOnly}
          className={`mt-1 block w-full ${height} ${smHeight} ${mdHeight} ${type === "password" ? "pr-10" : "pr-3"} pl-3 py-2 border-[.8px] ${error ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:border-primary-500 sm:text-sm rounded-md focus:outline-none`}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer mt-1"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
          >
            {passwordVisible ? (
              <EyeSlashIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            ) : (
              <EyeIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
