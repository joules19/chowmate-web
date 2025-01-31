// ButtonGroup.tsx
import React from "react";
import { Button } from "antd";
import { OntaUsageType } from "@/app/data/types/auth";

interface ButtonGroupProps {
  onButtonClick: (buttonType: OntaUsageType) => void;
  activeButton: OntaUsageType;
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
          onClick={() => onButtonClick(OntaUsageType.POSTER)}
          style={{
            backgroundColor:
              activeButton === OntaUsageType.POSTER ? "black" : "transparent",
            color: activeButton === OntaUsageType.POSTER ? "white" : "black",
            border:
              activeButton === OntaUsageType.POSTER
                ? "none"
                : "1px solid black",
          }}
        >
          I Want To Post Jobs
        </Button>
        <Button
          type="text"
          onClick={() => onButtonClick(OntaUsageType.SEEKER)}
          style={{
            backgroundColor:
              activeButton === OntaUsageType.SEEKER ? "black" : "transparent",
            color: activeButton === OntaUsageType.SEEKER ? "white" : "black",
            border:
              activeButton === OntaUsageType.SEEKER
                ? "none"
                : "1px solid black",
          }}
        >
          I Am Looking For Jobs
        </Button>
      </div>
    </div>
  );
};

export default ButtonGroup;
