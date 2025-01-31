import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputField from "../ui/InputField";
import TextAreaField from "../ui/TextAreaField";
import { Button } from "../ui/Button1";

const ResumeForm: React.FC<{
  editingResume: any;
  newResume: any;
  onSubmit: any;
  handleSkillsChange: any;
}> = ({ editingResume, newResume, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Formik initialization
  const formik = useFormik({
    initialValues: {
      candidateName: editingResume
        ? editingResume.candidateName
        : newResume.candidateName,
      email: editingResume ? editingResume.email : newResume.email,
      phone: editingResume ? editingResume.phone : newResume.phone,
      skills: editingResume
        ? editingResume.skills.join(", ")
        : newResume.skills.join(", "),
      experience: editingResume
        ? editingResume.experience
        : newResume.experience,
      education: editingResume ? editingResume.education : newResume.education,
      resumeText: editingResume
        ? editingResume.resumeText
        : newResume.resumeText,
    },
    validationSchema: Yup.object({
      candidateName: Yup.string().required("Candidate Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      skills: Yup.string().required("Skills are required"),
      experience: Yup.string().required("Experience is required"),
      education: Yup.string().required("Education is required"),
      resumeText: Yup.string().required("Full Resume Text is required"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mb-10 w-full max-w-4xl space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Candidate Name"
          id="candidateName"
          name="candidateName"
          value={formik.values.candidateName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={formik.touched.candidateName && formik.errors.candidateName}
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
          required
          error={formik.touched.phone && formik.errors.phone}
        />
        <InputField
          label="Skills (comma-separated)"
          id="skills"
          name="skills"
          value={formik.values.skills}
          onChange={(e: any) => {
            formik.handleChange(e);
          }}
          onBlur={formik.handleBlur}
          required
          error={formik.touched.skills && formik.errors.skills}
        />
        <InputField
          label="Experience"
          id="experience"
          name="experience"
          value={formik.values.experience}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={formik.touched.experience && formik.errors.experience}
        />
        <InputField
          label="Education"
          id="education"
          name="education"
          value={formik.values.education}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          required
          error={formik.touched.education && formik.errors.education}
        />
      </div>
      <TextAreaField
        label="Full Resume Text"
        id="resumeText"
        name="resumeText"
        value={formik.values.resumeText}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        rows={5}
        required
        error={formik.touched.resumeText && formik.errors.resumeText}
      />
      <div className="w-[150px] h-[38px]">
        <Button
          mode={"solid"}
          buttonText={editingResume ? "Update Resume" : "Save Parsed Resume"}
          loading={isLoading}
          defaultColor="primary-1"
          hoverColor="primary-2"
        />
      </div>
    </form>
  );
};

export default ResumeForm;
