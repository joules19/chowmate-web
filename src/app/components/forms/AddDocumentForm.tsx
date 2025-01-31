import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import FileInput from "../ui/FileInput";
import SelectField from "../ui/SelectField";
import { Button } from "../ui/Button1";
import { toast } from "sonner";

const documentTypes = ["ID", "Certificate", "Contract", "Other"];

interface Document {
  documentName: string;
  documentType: string;
  expiryDate: string;
  file: File | null;
}

const AddDocumentForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<Document>({
    initialValues: {
      documentName: "",
      documentType: "",
      expiryDate: "",
      file: null,
    },
    validationSchema: Yup.object({
      documentName: Yup.string().required("Document name is required"),
      documentType: Yup.string().required("Document type is required"),
      expiryDate: Yup.date(),
      file: Yup.mixed().required("Document file is required"),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        toast.success("Document added successfully", {
          duration: 5000,
        });
        setIsLoading(false);
        formik.resetForm();
      }, 1000);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-full mx-auto">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full md:w-1/2 px-3 mb-6">
          <InputField
            label="Document Name"
            id="documentName"
            name="documentName"
            value={formik.values.documentName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.documentName && formik.errors.documentName}
          />
          <SelectField
            label="Document Type"
            id="documentType"
            name="documentType"
            value={formik.values.documentType}
            options={documentTypes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            error={formik.touched.documentType && formik.errors.documentType}
          />
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6">
          <InputField
            label="Expiry Date"
            id="expiryDate"
            name="expiryDate"
            type="date"
            value={formik.values.expiryDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.expiryDate && formik.errors.expiryDate}
          />
          <FileInput
            label="Document File"
            id="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(event) =>
              formik.setFieldValue("file", event.currentTarget.files?.[0])
            }
            required
            error={formik.touched.file && formik.errors.file}
          />
        </div>
      </div>
      <div className="w-[150px] h-[38px]">
        <Button
          mode="solid"
          buttonText="Add Document"
          loading={isLoading}
          defaultColor="primary-1"
          hoverColor="primary-2"
        />
      </div>
    </form>
  );
};

export default AddDocumentForm;
