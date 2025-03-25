// app/create-profile/page.tsx
"use client";

import { useSearchParams } from "next/navigation"; // For getting query params in Next.js 14
import React, { useState, useEffect } from "react";
import { ChowbroUsageType } from "@/app/data/types/auth"; // Import OntaUsageType enum

const CreateProfile: React.FC = () => {
  const searchParams = useSearchParams(); // Get query params
  const type = searchParams.get("type"); // Extract the 'type' param from the query
  const [profileType, setProfileType] = useState<ChowbroUsageType | null>(null);

  // Effect to handle the type query and set profileType
  useEffect(() => {
    if (type) {
      if (type === ChowbroUsageType.VENDOR) {
        setProfileType(ChowbroUsageType.VENDOR);
      } else if (type === ChowbroUsageType.CUSTOMER) {
        setProfileType(ChowbroUsageType.CUSTOMER);
      }
    }
  }, [type]);

  // Return a loading message if the profileType is not set yet
  if (!profileType) {
    return <div>Loading...</div>;
  }

  // Render content based on the profile type
  const renderContent = () => {
    if (profileType === ChowbroUsageType.VENDOR) {
      return (
        <div>
          <h1>Create a Poster Profile</h1>
          <p>
            Welcome to the poster profile creation page. Here you can post job
            opportunities.
          </p>
        </div>
      );
    } else if (profileType === ChowbroUsageType.CUSTOMER) {
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

export default CreateProfile;
