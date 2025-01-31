import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/Button1";
import { OnboardingStep } from "../../types/onboarding";

interface OnboardingModalProps {
  show: boolean;
  handleClose: () => void;
  currentStep: OnboardingStep | null;
  onSave: (step: OnboardingStep) => void;
}

const validationSchema = Yup.object({
  stepName: Yup.string().required("Step Name is required"),
  description: Yup.string().required("Description is required"),
  dueDate: Yup.date().required("Due Date is required"),
  status: Yup.string()
    .oneOf(["Not Started", "In Progress", "Completed"])
    .required("Status is required"),
});

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  show,
  handleClose,
  currentStep,
  onSave,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    stepName: currentStep?.stepName || "",
    description: currentStep?.description || "",
    dueDate: currentStep?.dueDate || "",
    status: currentStep?.status || "Not Started",
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-xl font-bold mb-4">
              {currentStep ? "Edit Onboarding Step" : "Add New Onboarding Step"}
            </h3>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                onSave({
                  id: currentStep?.id || Date.now(),
                  ...values,
                });
              }}
            >
              {() => (
                <Form>
                  <div className="mb-4">
                    <label
                      htmlFor="stepName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Step Name
                    </label>
                    <Field
                      id="stepName"
                      name="stepName"
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="stepName"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <Field
                      as="textarea"
                      id="description"
                      name="description"
                      rows={3}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="description"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="dueDate"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Due Date
                    </label>
                    <Field
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    />
                    <ErrorMessage
                      name="dueDate"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <Field
                      as="select"
                      id="status"
                      name="status"
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="p"
                      className="mt-1 text-xs text-red-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <div className="flex gap-2 w-[308px] h-[38px]">
                      <div className="flex flex-1">
                        <Button
                          onClick={handleClose}
                          mode={"outline"}
                          buttonText="Close"
                          defaultColor="primary-1"
                          hoverColor="primary-2"
                        />
                      </div>
                      <div className="flex flex-1">
                        <Button
                          mode={"solid"}
                          buttonText="Save"
                          loading={isLoading}
                          defaultColor="primary-1"
                          hoverColor="primary-2"
                        />
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

export default OnboardingModal;
