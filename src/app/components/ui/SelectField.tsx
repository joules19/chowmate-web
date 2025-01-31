import React from "react";

interface SelectFieldProps {
  label: string;
  id: string;
  name: string;
  value: string;
  options: { value: string; label: string }[]; // Update to accept array of objects
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string | boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  id,
  name,
  value,
  options,
  onChange,
  onBlur,
  required = false,
  error,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          className={`block w-full border-[.8px] ${error ? "border-red-500" : "border-gray-300"
            } py-2 px-3 pr-8 shadow-sm flex-grow mr-2 p-2 border-[.8px] border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-1 focus:ring-primary-500 focus:border-primary-500`}
        >
          <option value="" disabled>
            Select {label}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M6.293 9.293a1 1 0 011.414 0L10 10.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
