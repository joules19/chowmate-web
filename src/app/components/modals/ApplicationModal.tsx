import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { JobApplication, SendInvitation } from "../../types/onboarding";
import { Button } from "../ui/Button1";
import { formatStringToLocaleDate } from "../../utils/helperMethods";
import {
  useGetApplicationMutation,
  useSendInvitationMutation,
} from "../../store/services/recruitmentApi";
import AppSpinner from "../ui/Spinner";
import { DatePicker, message, Tag } from "antd";
import { TrashIcon, XCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";

interface ApplicationModalProps {
  show: boolean;
  handleClose: () => void;
  currentApplication: JobApplication | null;
  onSave?: (application: JobApplication) => void;
}

const validationSchema = Yup.object({
  meetingLink: Yup.string()
    .url("Invalid URL")
    .required("Meeting link is required"),
  interviewAttendants: Yup.array()
    .of(
      Yup.string().email("Invalid email format").required("Email is required")
    )
    .min(1, "At least one attendant is required"),
  meetingNotes: Yup.string(),
});

const StatusTag = ({ statusText }: { statusText: any }) => {
  let color = "";
  let label = "";

  switch (statusText) {
    case "Applied":
      color = "blue";
      label = "Applied";
      break;
    case "Screening":
      color = "orange";
      label = "Screening";
      break;
    case "Interview":
      color = "purple";
      label = "Interview";
      break;
    case "Offered":
      color = "green";
      label = "Offered";
      break;
    case "Hired":
      color = "cyan";
      label = "Hired";
      break;
    case "Rejected":
      color = "red";
      label = "Rejected";
      break;
    default:
      color = "default";
      label = "Unknown";
  }

  return <Tag color={color}>{label}</Tag>;
};

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  show,
  handleClose,
  currentApplication,
  onSave,
}) => {
  const [
    getJobApplication,
    { isLoading: isJobApplicationLoading, data: jobApplicationData },
  ] = useGetApplicationMutation();
  const [
    sendInvitation,
    {
      isLoading: isInvitationSending,
      data: invitationSent,
      error: invitationSendingFailed,
    },
  ] = useSendInvitationMutation();
  const [applicationData, setApplicationData] = useState<JobApplication | null>(
    null
  );
  const [inviteModal, setInviteModal] = useState(false); // To toggle the invite modal

  useEffect(() => {
    if (show && currentApplication) {
      getJobApplication(currentApplication?.id);
    }
  }, [show, currentApplication, getJobApplication]);

  useEffect(() => {
    if (jobApplicationData) {
      setApplicationData(jobApplicationData);
    }
  }, [jobApplicationData]);

  useEffect(() => {
    if (invitationSendingFailed) {
      const { status, data } = invitationSendingFailed;
      // You can now access `status` and `data.message`
      if (status === 409) {
        message.warning(data.message);
        return;
      }

      message.warning("Invitation not sent. Please try again.");
    } else if (invitationSent) {
      message.success("Invite sent successfully");
      closeInviteModal();
    }
  }, [invitationSent, invitationSendingFailed]);

  const viewResume = () => {
    if (applicationData?.resumeFile) {
      const fileUrl = `data:application/pdf;base64,${applicationData.resumeFile}`;
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(
          `<iframe src="${fileUrl}" frameborder="0" style="border:none; width:100%; height:100%"></iframe>`
        );
      }
    }
  };

  const handleInviteClick = () => {
    setInviteModal(true); // Show invite modal
  };

  const closeInviteModal = () => {
    setInviteModal(false);
  };

  return (
    <>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4 md:mx-0 h-[80vh] overflow-y-auto relative">
            {/* Close Icon */}
            <button className="absolute top-4 right-4" onClick={handleClose}>
              <XCircleIcon className="w-6 h-6 text-gray-600" />
            </button>

            <h3 className="text-xl font-bold mb-4">
              {"Application Details"}
              {/* {currentApplication ? "Edit Application" : "Add New Application"} */}
            </h3>

            {applicationData ? (
              <div className="space-y-4">
                {/* Application Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Full Name</h4>
                    <p>{applicationData.firstName}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone Number</h4>
                    <p>{applicationData.phoneNumber}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p>{applicationData.email}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Date of Birth</h4>
                    <p>{formatStringToLocaleDate(applicationData.dob)}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Application Date</h4>
                    <p>
                      {formatStringToLocaleDate(
                        applicationData.applicationDate
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Status</h4>
                    <p>
                      <StatusTag statusText={applicationData.statusText} />
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2">Cover Letter</h4>
                  <p className="whitespace-pre-wrap">
                    {applicationData.coverletter}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2">
                  <div className="flex gap-2 w-[308px] h-[38px] mt-6">
                    <div className="flex flex-1">
                      <Button
                        onClick={handleInviteClick}
                        mode={"outline"}
                        buttonText="Invite"
                        defaultColor="primary-1"
                        hoverColor="primary-2"
                      />
                    </div>
                    <div className="flex flex-1">
                      <Button
                        onClick={viewResume}
                        mode={"solid"}
                        buttonText="View Resume"
                        defaultColor="primary-1"
                        hoverColor="primary-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center">
                <AppSpinner size={35} color="#36A2EB" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
            <button
              className="absolute top-4 right-4"
              onClick={closeInviteModal}
            >
              <XCircleIcon className="w-6 h-6 text-gray-600" />
            </button>

            <h3 className="text-xl font-bold mb-4">Invite Candidate</h3>

            <Formik
              initialValues={{
                meetingLink: "",
                interviewAttendants: [""],
                meetingNotes: "",
                interviewDate: null,
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                const payload: SendInvitation = {
                  jobID: currentApplication?.jobID!,
                  applicantID: currentApplication?.id!,
                  meetingLink: values.meetingLink,
                  meetingNote: values.meetingNotes,
                  interviewers: values.interviewAttendants,
                  interviewDate: values.interviewDate
                    ? moment(values.interviewDate).format("YYYY-MM-DD")
                    : "",
                };

                sendInvitation(payload);
              }}
            >
              {({ values, setFieldValue, handleChange, handleBlur }) => (
                <Form>
                  <div className="space-y-4">
                    {/* Meeting Link */}
                    <div className="relative">
                      <Field
                        name="meetingLink"
                        placeholder="Meeting Link"
                        className="input-field-with-icon w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#36A2EB]"
                      />
                      <i className="absolute left-3 top-3 text-gray-500 fa fa-link"></i>
                      <ErrorMessage
                        name="meetingLink"
                        component="p"
                        className="text-sm text-red-500 mt-1"
                      />
                    </div>

                    {/* Meeting Notes */}
                    <div className="relative">
                      <Field
                        as="textarea"
                        name="meetingNotes"
                        placeholder="Meeting Notes"
                        className="input-field-with-icon w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#36A2EB]"
                        rows={4}
                      />
                      <i className="absolute left-3 top-3 text-gray-500 fa fa-sticky-note"></i>
                      <ErrorMessage
                        name="meetingNotes"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    {/* Interview Date */}
                    <div className="relative">
                      <DatePicker
                        placeholder="Interview Date"
                        className="w-full border border-gray-300 rounded-md p-2"
                        value={
                          values.interviewDate
                            ? moment(values.interviewDate)
                            : null
                        }
                        onChange={(date) =>
                          setFieldValue("interviewDate", date)
                        }
                        onBlur={handleBlur}
                      />
                      <ErrorMessage
                        name="interviewDate"
                        component="p"
                        className="text-sm text-red-500 mt-1"
                      />
                    </div>

                    {/* Interview Attendants */}
                    <FieldArray name="interviewAttendants">
                      {({ remove, push }) => (
                        <div>
                          {values.interviewAttendants.map((_, index) => (
                            <div
                              key={index}
                              className="relative flex-col items-center mb-2"
                            >
                              <div className="flex w-full">
                                <Field
                                  name={`interviewAttendants.${index}`}
                                  placeholder="Attendant's Email"
                                  className="input-field-with-icon w-full border border-gray-300 rounded-md p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#36A2EB]"
                                />
                                <i className="absolute left-3 top-3 text-gray-500 fa fa-user"></i>
                                <button
                                  className="text-red-500 py-1 px-2 rounded"
                                  onClick={() => remove(index)}
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                              <ErrorMessage
                                name={`interviewAttendants.${index}`}
                                component="p"
                                className="text-sm text-red-500 mt-1"
                              />
                            </div>
                          ))}
                          <button
                            type="button"
                            className="flex items-center text-sm text-blue-500"
                            onClick={() => push("")}
                          >
                            Add Attendant
                          </button>
                        </div>
                      )}
                    </FieldArray>

                    {/* Submit Button */}
                    <div className="flex h-[38px] justify-end">
                      <Button
                        loading={isInvitationSending}
                        mode={"solid"}
                        buttonText="Send Invite"
                        defaultColor="primary-1"
                        hoverColor="primary-2"
                      />
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

export default ApplicationModal;
