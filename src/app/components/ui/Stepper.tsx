import React from "react";

interface Step {
    label: string;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
                const isActive = index + 1 <= currentStep;
                const isLastStep = index === steps.length - 1;

                return (
                    <React.Fragment key={index}>
                        <div className="flex items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${isActive ? "bg-[#36A2EB] text-white" : "bg-gray-300 text-gray-500"
                                    }`}
                            >
                                {index + 1}
                            </div>
                            <span className={`ml-2 text-sm font-medium ${isActive ? "text-[#36A2EB]" : "text-gray-500"}`}>
                                {step.label}
                            </span>
                        </div>
                        {!isLastStep && (
                            <div
                                className={`flex-1 h-[2px] ml-1 ${isActive ? "bg-[#36A2EB]" : "bg-gray-300"}`}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Stepper;
