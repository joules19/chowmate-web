// InterviewScheduleForm.tsx
import React, { useState } from "react";
import InputField from "../ui/InputField";
import { Interview } from "../../types/onboarding";
import TextAreaField from "../ui/TextAreaField";
import { Button } from "../ui/Button1";

interface InterviewScheduleFormProps {
  interview?: Interview;
  onSubmit: (data: Omit<Interview, "id">) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur?: (e: any) => void;
  errors: {
    [key: string]: string | false;
  };
  formValues: Omit<Interview, "id">;
}

const InterviewScheduleForm: React.FC<InterviewScheduleFormProps> = ({
  interview,
  onSubmit,
  onChange,
  onBlur,
  errors,
  formValues,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formValues);
      }}
      className="mb-10 w-full max-w-4xl space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {" "}
        <InputField
          label="Candidate Name"
          id="candidateName"
          name="candidateName"
          value={formValues.candidateName}
          onChange={onChange}
          onBlur={onBlur!}
          required
          error={errors.candidateName}
        />
        <InputField
          label="Interviewer Name"
          id="interviewerName"
          name="interviewerName"
          value={formValues.interviewerName}
          onChange={onChange}
          onBlur={onBlur!}
          required
          error={errors.interviewerName}
        />
        <InputField
          label="Interview Date"
          id="interviewDate"
          name="interviewDate"
          type="date"
          value={formValues.interviewDate}
          onChange={onChange}
          onBlur={onBlur!}
          required
          error={errors.interviewDate}
        />
        <InputField
          label="Interview Time"
          id="interviewTime"
          name="interviewTime"
          type="time"
          value={formValues.interviewTime}
          onChange={onChange}
          onBlur={onBlur!}
          required
          error={errors.interviewTime}
        />
        <InputField
          label="Position"
          id="position"
          name="position"
          value={formValues.position}
          onChange={onChange}
          onBlur={onBlur!}
          required
          error={errors.position}
        />
        <TextAreaField
          label="Notes"
          id="notes"
          name="notes"
          value={formValues.notes}
          onChange={onChange}
          onBlur={onBlur}
          rows={3}
          error={errors.notes}
        />
      </div>

      <div className="w-[150px] h-[38px]">
        <Button
          mode={"solid"}
          buttonText={interview ? "Update Interview" : "Schedule Interview"}
          loading={isLoading}
          defaultColor="primary-1"
          hoverColor="primary-2"
        />
      </div>
    </form>
  );
};

export default InterviewScheduleForm;
