"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoWhite from "../../assets/images/chowbro_logo_white.png";
import VendorImage from "../../assets/images/meal1.jpg";
import CustomerImage from "../../assets/images/meal.jpg";
import { Button } from "antd";
import ButtonGroup from "@/app/components/ui/ButtonGroup";
import SignupInfoCard from "@/app/components/cards/SignupInfoCard";
import { ChowbroUsageType } from "@/app/data/types/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import VendorSignupForm from "@/app/components/forms/VendorSignupForm";
import CustomerSignupForm from "@/app/components/forms/CustomerSignupForm";

const contentMap = {
  [ChowbroUsageType.VENDOR]: {
    title: "Grow Your Food Business with Ease",
    description:
      "Join Chowbro and reach hungry customers ready to discover your flavors.",
    image: VendorImage,
  },
  [ChowbroUsageType.CUSTOMER]: {
    title: "Satisfy Your Cravings with Chowbro",
    description:
      "Explore a world of culinary delights at your doorstep, anytime you crave.",
    image: CustomerImage,
  },
};

const Signup: React.FC = () => {
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<ChowbroUsageType>(
    ChowbroUsageType.VENDOR
  );
  const [showForm, setShowForm] = useState(false);

  const handleClick = (buttonType: ChowbroUsageType) => {
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
            width={180}
            alt="logo"
          />
          <div className="flex flex-col gap-[25px]">
            <h2 className="text-[32px] font-semibold text-white">{title}</h2>
            <p className="text-base font-normal text-white">{description}</p>
          </div>
        </div>
        <div className="flex flex-1 w-full h-full mt-6 bg-white opacity-95">
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
            <div className="flex flex-col gap-[50px] max-w-[600px] lg:ml-[260px]">
              <div className="flex flex-col gap-3">
                <h1 className="text-[35px] font-medium">
                  How will you use Chowbro?
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

              {activeButton === ChowbroUsageType.VENDOR && <VendorSignupForm />}
              {activeButton === ChowbroUsageType.CUSTOMER && <CustomerSignupForm />}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
