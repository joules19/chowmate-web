import React from "react";

interface FileInputProps {
  label: string;
  id: string;
  accept: string;
  required?: boolean;
  error?: string | false;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FileInput: React.FC<FileInputProps> = ({
  label,
  id,
  accept,
  required = false,
  error = "",
  onChange,
  onBlur,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        type="file"
        id={id}
        accept={accept}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-primary-2 hover:file:bg-blue-100 ${error ? "border-red-500" : "border-gray-300"
          } rounded-md py-2 px-3 flex-grow focus:outline-none focus:ring-1 focus:ring-primary-1 border-[.8px] shadow-sm`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FileInput;
