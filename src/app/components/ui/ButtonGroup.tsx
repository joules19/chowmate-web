// ButtonGroup.tsx
import React from "react";
import { Button } from "antd";
import { ChowmateUsageType } from "@/app/data/types/auth";

interface ButtonGroupProps {
  onButtonClick: (buttonType: ChowmateUsageType) => void;
  activeButton: ChowmateUsageType;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({
  onButtonClick,
  activeButton,
}) => {
  return (
    <div className="flex w-full ">
      <div className="flex gap-3 -mt-[1px]">
        <Button
          type="text"
          onClick={() => onButtonClick(ChowmateUsageType.VENDOR)}
          style={{
            backgroundColor:
              activeButton === ChowmateUsageType.VENDOR ? "black" : "transparent",
            color: activeButton === ChowmateUsageType.VENDOR ? "white" : "black",
            border:
              activeButton === ChowmateUsageType.VENDOR
                ? "none"
                : "1px solid black",
          }}
        >
          I am a Vendor
        </Button>
        <Button
          type="text"
          onClick={() => onButtonClick(ChowmateUsageType.CUSTOMER)}
          style={{
            backgroundColor:
              activeButton === ChowmateUsageType.CUSTOMER ? "black" : "transparent",
            color: activeButton === ChowmateUsageType.CUSTOMER ? "white" : "black",
            border:
              activeButton === ChowmateUsageType.CUSTOMER
                ? "none"
                : "1px solid black",
          }}
        >
          Here for chow
        </Button>
      </div>
    </div>
  );
};

export default ButtonGroup;
