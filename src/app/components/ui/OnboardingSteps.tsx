import React from "react";

interface Step {
    title: string;
    description: string;
    content: React.ReactNode;
}

interface OnboardingStepsProps {
    currentStep: number;
    steps: Step[];
}

const OnboardingSteps: React.FC<OnboardingStepsProps> = ({ currentStep, steps }) => {
    return (
        <div className="w-full max-w-lg">
            {steps.map((step, index) => (
                <div key={index} className={`mb-4 ${index < currentStep ? "text-gray-500" : ""}`}>
                    <div className="flex items-center">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${index <= currentStep ? "bg-blue-500 text-white" : "bg-gray-200"
                                }`}
                        >
                            {index + 1}
                        </div>
                        <div className="ml-4">
                            <h2 className="font-semibold">{step.title}</h2>
                            <p className="text-sm">{step.description}</p>
                        </div>
                    </div>
                    {index === currentStep && <div className="mt-4">{step.content}</div>}
                </div>
            ))}
        </div>
    );
};

export default OnboardingSteps;
