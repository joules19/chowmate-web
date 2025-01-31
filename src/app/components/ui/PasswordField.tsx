import React, { useState } from "react";
import { Input, Alert } from "antd";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface PasswordFieldProps {
  labelText: string;
  password: string;
  setPassword: (password: string) => void;
  showPasswordCriteria: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  labelText,
  password,
  setPassword,
  showPasswordCriteria,
}) => {
  const [error, setError] = useState<string>("");

  const criteria = [
    {
      label: "Lowercase",
      isValid: /[a-z]/.test(password),
    },
    {
      label: "Uppercase",
      isValid: /[A-Z]/.test(password),
    },
    {
      label: "Alphanumeric",
      isValid: /[a-zA-Z0-9]/.test(password) && !/[^a-zA-Z0-9]/.test(password),
    },
    {
      label: "Number",
      isValid: /\d/.test(password),
    },
    {
      label: "8 Characters or More",
      isValid: password.length >= 8,
    },
  ];

  const handleBlur = () => {
    if (!password) {
      setError(`${labelText} is required`);
    } else {
      setError("");
    }
  };

  return (
    <div className="w-full relative">
      <label htmlFor={labelText} className="block text-sm font-medium mb-1">
        {labelText}
      </label>
      <Input.Password
        id={labelText}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onBlur={handleBlur}
        className={`w-full h-[42px] px-3 rounded-md ${
          error ? "border-red-500" : ""
        }`}
        // style={{
        //   borderColor: error ? "#f5222d" : "#d9d9d9",
        // }}
      />
      {error && (
        <div className="mt-2 text-xs text-red-500">
          {/* <XCircleIcon className="w-4 h-4 inline-block mr-1" /> */}
          {error}
        </div>
      )}
      {showPasswordCriteria && (
        <div className="mt-4">
          <Alert
            style={{
              background: "#fff",
              border: ".5px solid #D1D1D1",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
            type="info"
            message={
              <div>
                {criteria.map((criterion, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm mb-1"
                  >
                    {criterion.isValid ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-xs">{criterion.label}</span>
                  </div>
                ))}
              </div>
            }
          />
        </div>
      )}
    </div>
  );
};

export default PasswordField;
