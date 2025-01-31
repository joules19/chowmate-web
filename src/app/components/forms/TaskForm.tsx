import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { OnboardingTask } from "../../types/onboarding";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import TextAreaField from "../ui/TextAreaField";
import { Button } from "../ui/Button1";

const validationSchema = Yup.object({
  taskName: Yup.string().required("Task Name is required"),
  assignee: Yup.string().required("Assignee is required"),
  dueDate: Yup.date().required("Due Date is required"),
  status: Yup.string().required("Status is required"),
  description: Yup.string()
    .required("Description is required")
    .max(500, "Description can't be longer than 500 characters"),
});

interface TaskFormProps {
  task: Omit<OnboardingTask, "id"> | OnboardingTask | null;
  handleSubmit: (values: Omit<OnboardingTask, "id">) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, handleSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      taskName: task?.taskName || "",
      assignee: task?.assignee || "",
      dueDate: task?.dueDate || "",
      status: task?.status || "Not Started",
      description: task?.description || "",
    },
    validationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="mb-10 w-full max-w-4xl space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InputField
          label="Task Name"
          id="taskName"
          name="taskName"
          value={formik.values.taskName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.taskName && formik.errors.taskName}
        />
        <InputField
          label="Assignee"
          id="assignee"
          name="assignee"
          value={formik.values.assignee}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.assignee && formik.errors.assignee}
        />
        <InputField
          label="Due Date"
          id="dueDate"
          name="dueDate"
          type="date"
          value={formik.values.dueDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.dueDate && formik.errors.dueDate}
        />
        <SelectField
          label="Status"
          id="status"
          name="status"
          value={formik.values.status}
          options={["Not Started", "In Progress", "Completed"]}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.status && formik.errors.status}
        />
        <TextAreaField
          label="Description"
          id="description"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description}
        />
      </div>
      <div className="w-[150px] h-[38px]">
        <Button
          mode={"solid"}
          buttonText={task && "id" in task ? "Update Task" : "Add Task"}
          loading={isLoading}
          defaultColor="primary-1"
          hoverColor="primary-2"
        />
      </div>
    </form>
  );
};

export default TaskForm;
