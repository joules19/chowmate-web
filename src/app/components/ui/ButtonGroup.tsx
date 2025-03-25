// ButtonGroup.tsx
import React from "react";
import { Button } from "antd";
import { ChowbroUsageType } from "@/app/data/types/auth";

interface ButtonGroupProps {
  onButtonClick: (buttonType: ChowbroUsageType) => void;
  activeButton: ChowbroUsageType;
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
          onClick={() => onButtonClick(ChowbroUsageType.VENDOR)}
          style={{
            backgroundColor:
              activeButton === ChowbroUsageType.VENDOR ? "black" : "transparent",
            color: activeButton === ChowbroUsageType.VENDOR ? "white" : "black",
            border:
              activeButton === ChowbroUsageType.VENDOR
                ? "none"
                : "1px solid black",
          }}
        >
          I am a Vendor
        </Button>
        <Button
          type="text"
          onClick={() => onButtonClick(ChowbroUsageType.CUSTOMER)}
          style={{
            backgroundColor:
              activeButton === ChowbroUsageType.CUSTOMER ? "black" : "transparent",
            color: activeButton === ChowbroUsageType.CUSTOMER ? "white" : "black",
            border:
              activeButton === ChowbroUsageType.CUSTOMER
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
