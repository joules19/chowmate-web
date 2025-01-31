// SignupInfoCard.tsx
import React from "react";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { OntaUsageType } from "@/app/data/types/auth";

interface SignupInfoCardProps {
  activeButton: string;
}

const SignupInfoCard: React.FC<SignupInfoCardProps> = ({ activeButton }) => {
  return (
    <div className="flex flex-col w-full gap-3 border-[1px] bg-white rounded-lg shadow-sm py-5 px-4 sm:px-6">
      {activeButton === OntaUsageType.POSTER ? (
        <>
          <p className="text-sm font-medium text-dark-1">
            Sign up as a Job poster
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Post job openings and manage applicants.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Access applicant tracking and communication tools.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-dark-1">
            Sign up as a Job seeker
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Browse job openings and apply directly.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Manage your profile and track your applications.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupInfoCard;
