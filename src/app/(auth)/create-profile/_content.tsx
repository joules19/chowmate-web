"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { ChowmateUsageType } from "@/app/data/types/auth";

const CreateProfile: React.FC = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [profileType, setProfileType] = useState<ChowmateUsageType | null>(null);

  useEffect(() => {
    if (type) {
      if (type === ChowmateUsageType.VENDOR) {
        setProfileType(ChowmateUsageType.VENDOR);
      } else if (type === ChowmateUsageType.CUSTOMER) {
        setProfileType(ChowmateUsageType.CUSTOMER);
      }
    }
  }, [type]);

  if (!profileType) {
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    if (profileType === ChowmateUsageType.VENDOR) {
      return (
        <div>
          <h1>Create a Poster Profile</h1>
          <p>
            Welcome to the poster profile creation page. Here you can post job
            opportunities.
          </p>
        </div>
      );
    } else if (profileType === ChowmateUsageType.CUSTOMER) {
      return (
        <div>
          <h1>Create a Seeker Profile</h1>
          <p>
            Welcome to the seeker profile creation page. Here you can browse job
            opportunities.
          </p>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <h1>Create Profile</h1>
      {renderContent()}
    </div>
  );
};

const CreateProfilePage: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <CreateProfile />
  </Suspense>
);

export default CreateProfilePage;
