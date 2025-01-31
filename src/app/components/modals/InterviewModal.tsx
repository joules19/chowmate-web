import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ApplicantInterview } from "../../types/onboarding";
import { Button } from "../ui/Button1";
import { formatStringToLocaleDate } from "../../utils/helperMethods";
import {
  XCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import AppSpinner from "../ui/Spinner";
import { Tag } from "antd";

interface InterviewModalProps {
  show: boolean;
  handleClose: () => void;
  currentInterview: ApplicantInterview | null;
  onSave?: (interview: ApplicantInterview) => void;
}

const validationSchema = Yup.object({
  meetingLink: Yup.string()
    .url("Invalid URL")
    .required("Meeting link is required"),
  meetingNotes: Yup.string().required("Meeting notes are required"),
});

const StatusTag = ({ statusText }: { statusText: any }) => {
  let color = "";
  let label = "";

  switch (statusText) {
    case "Scheduled":
      color = "orange";
      label = "Scheduled";
      break;

    case "Interviewed":
      color = "green";
      label = "Interviewed";
      break;
    default:
      color = "default";
      label = "Unknown";
  }

  return <Tag color={color}>{label}</Tag>;
};

const InterviewModal: React.FC<InterviewModalProps> = ({
  show,
  handleClose,
  currentInterview,
  onSave,
}) => {
  const [interviewData, setInterviewData] = useState<ApplicantInterview | null>(
    null
  );
  const [reviewsVisible, setReviewsVisible] = useState(false); // To toggle reviews modal
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null); // Reviewer selected for the review modal
  const [isInterviewersCollapsed, setIsInterviewersCollapsed] = useState(true); // Collapsible interviewers section

  useEffect(() => {
    if (show && currentInterview) {
      setInterviewData(currentInterview);
    }
  }, [show, currentInterview]);

  const viewReviews = (reviewer: string) => {
    setSelectedReviewer(reviewer);
    setReviewsVisible(true);
  };

  const closeReviewsModal = () => {
    setReviewsVisible(false);
    setSelectedReviewer(null);
  };

  const toggleInterviewersCollapse = () => {
    setIsInterviewersCollapsed(!isInterviewersCollapsed);
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

            <h3 className="text-xl font-bold mb-4">Interview Details</h3>

            {interviewData ? (
              <div className="space-y-6">
                {/* Interview Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Full Name</h4>
                    <p>{interviewData.fullname}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email</h4>
                    <p>{interviewData.applicantEmail}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone Number</h4>
                    <p>{interviewData.applicatMobile}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Interview Date</h4>
                    <p>
                      {formatStringToLocaleDate(interviewData.interviewDate)}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Meeting Link</h4>
                    <a
                      href={interviewData.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Join Meeting
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold">Status</h4>
                    <StatusTag statusText={interviewData.statusName} />
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold mb-2">Meeting Note</h4>
                  <p className="whitespace-pre-wrap">
                    {interviewData.meetingNote}
                  </p>
                </div>
                {/* Collapsible Interviewers Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={toggleInterviewersCollapse}
                  >
                    <h4 className="font-semibold mb-2">Interviewers</h4>
                    {isInterviewersCollapsed ? (
                      <ChevronDownIcon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <ChevronUpIcon className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  {!isInterviewersCollapsed && (
                    <div className="space-y-2 mt-2">
                      {interviewData.interviewers.map((interviewer, index) => (
                        <div
                          key={index}
                          className="flex justify-between gap-6 items-center"
                        >
                          <span>{interviewer}</span>
                          <div className="flex gap-2 w-[150px] h-[38px]">
                            <Button
                              mode="outline"
                              buttonText="View Review"
                              onClick={() => viewReviews(interviewer)}
                              defaultColor="primary-1"
                              hoverColor="primary-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

      {/* Review Modal */}
      {reviewsVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative">
            <button
              className="absolute top-4 right-4"
              onClick={closeReviewsModal}
            >
              <XCircleIcon className="w-6 h-6 text-gray-600" />
            </button>

            <h3 className="text-xl font-bold mb-4">Reviewer Feedback</h3>
            <p className="mb-2">
              Feedback from: <strong>{selectedReviewer}</strong>
            </p>
            <p>No feedback yet, come back later.</p>

            <div className="flex gap-2 w-full h-[38px] mt-6">
              <Button
                mode="solid"
                buttonText="Close"
                onClick={closeReviewsModal}
                defaultColor="primary-1"
                hoverColor="primary-2"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewModal;
