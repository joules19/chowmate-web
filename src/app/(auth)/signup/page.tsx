"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoWhite from "../../assets/images/Logo_White.png";
import BuildingImage from "../../assets/images/build2.png";
import ContractImage from "../../assets/images/buld.png";
import { Button } from "antd";
import ButtonGroup from "@/app/components/ui/ButtonGroup";
import SignupInfoCard from "@/app/components/cards/SignupInfoCard";
import { OntaUsageType } from "@/app/data/types/auth";
import JobPosterForm from "@/app/components/forms/JobPosterForm";
import JobSeekerForm from "@/app/components/forms/JobSeekerForm";
import { motion } from "framer-motion";
import Link from "next/link";

const contentMap = {
  [OntaUsageType.POSTER]: {
    title: "Expand Your Global Team with Confidence",
    description:
      "Focus on finding the best talent while we take care of the rest.",
    image: BuildingImage,
  },
  [OntaUsageType.SEEKER]: {
    title: "Find Your Dream Job with Onta",
    description:
      "Browse through exciting opportunities and take the next step in your career.",
    image: ContractImage,
  },
};

const Signup: React.FC = () => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<OntaUsageType>(
    OntaUsageType.POSTER
  );
  const [showForm, setShowForm] = useState(false);

  const handleClick = (buttonType: OntaUsageType) => {
    setActiveButton(buttonType);
  };

  const handleNextClick = () => {
    setShowForm(true);
    router.push(`/signup?type=${activeButton}`, undefined, { shallow: true });
  };

  const handleBackClick = () => {
    setShowForm(false);
    router.push(`/signup`, undefined, { shallow: true });
  };

  const { title, description, image } = contentMap[activeButton];

  return (
    <div className="w-full flex">
      {/* Sidebar */}
      <div className="hidden lg:flex h-screen lg:flex-col lg:w-[23%] bg-black fixed">
        <div className="flex flex-col gap-4 p-4 pt-10">
          <Image
            onClick={() => router.push("/")}
            className="cursor-pointer"
            src={LogoWhite}
            width={120}
            alt="logo"
          />
          <div className="flex flex-col gap-[25px]">
            <h2 className="text-[32px] font-semibold text-white">{title}</h2>
            <p className="text-base font-normal text-white">{description}</p>
          </div>
        </div>
        <div className="flex flex-1 w-full h-full mt-6 bg-white">
          <Image
            src={image}
            layout="responsive"
            width={300}
            alt="dynamic image"
            className="object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen h-full px-4 sm:mx-auto flex flex-col flex-1 gap-20 pb-10 ">
        <div className="flex lg:px-4 py-4 w-auto gap-[34px] justify-between lg:justify-end items-center ">
          <p className="text-dark-1">Already have an account?</p>
          <Button onClick={() => router.push("/login")}>Log in</Button>
        </div>

        <div className="flex flex-col w-full sm:max-w-[1000px] mx-auto">
          {!showForm ? (
            <div className="flex flex-col gap-[50px] max-w-[600px]  lg:ml-[260px]">
              <div className="flex flex-col gap-3">
                <h1 className="text-[35px] font-medium">
                  How will you use ONTA?
                </h1>
                <p className="text-base">Please select an option below.</p>
              </div>
              <div className="flex flex-col max-w-[420px] gap-5">
                <ButtonGroup
                  onButtonClick={handleClick}
                  activeButton={activeButton}
                />
                <SignupInfoCard activeButton={activeButton} />
                <div className="w-full">
                  <Button
                    type="text"
                    style={{
                      width: "100%",
                      height: "38px",
                      color: "#282828",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "black";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "black";
                    }}
                    onClick={handleNextClick}
                  >
                    Next &nbsp; &rarr;
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              className="flex flex-col gap-[50px] max-w-[1000px] mx-auto lg:ml-[260px]"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex mt-[-30px] sm:mt-0">
                <Button
                  href={"#"}
                  onClick={handleBackClick}
                  className="rounded-md px-3.5 py-[6px] text-sm font-semibold bg-transparent text-black hover:bg-black hover:text-white focus:bg-black focus:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black border border-transparent hover:border-black"
                >
                  <span aria-hidden="true">&larr; &nbsp;</span>Back
                </Button>
              </div>

              {activeButton === OntaUsageType.POSTER && <JobPosterForm />}
              {activeButton === OntaUsageType.SEEKER && <JobSeekerForm />}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
