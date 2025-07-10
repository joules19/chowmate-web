// SignupInfoCard.tsx
import React from "react";
import { CheckBadgeIcon } from "@heroicons/react/20/solid";
import { ChowmateUsageType } from "@/app/data/types/auth";

interface SignupInfoCardProps {
  activeButton: string;
}

const SignupInfoCard: React.FC<SignupInfoCardProps> = ({ activeButton }) => {
  return (
    <div className="flex flex-col w-full gap-3 border-[1px] bg-white rounded-lg shadow-sm py-5 px-4 sm:px-6">
      {activeButton === ChowmateUsageType.VENDOR ? (
        <>
          <p className="text-sm font-medium text-dark-1">
            Sign up as a Vendor
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                List your restaurant and menu items.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Manage orders and track deliveries.
              </p>
            </div>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-dark-1">
            Sign up as a Customer
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Browse restaurants and menu items.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3">
              <CheckBadgeIcon className="text-green-500 w-4 h-4" />
              <p className="text-xs font-normal text-dark-1">
                Place orders and track deliveries.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupInfoCard;
