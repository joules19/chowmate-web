'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ progress, currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-yellow-100 shadow-sm">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="h-1 bg-yellow-100">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Progress Info */}
        <div className="px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Left side - Progress text */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span className="text-sm font-medium text-gray-900">
                  Question {currentStep > totalSteps ? totalSteps : currentStep} of {totalSteps}
                </span>
              </div>

              {/* Progress percentage */}
              <div className="hidden sm:block">
                <span className="text-xs text-gray-500">
                  {progress}% complete
                </span>
              </div>
            </div>

            {/* Right side - Steps indicator */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: totalSteps }, (_, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;

                return (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{
                      scale: isActive ? 1.2 : 1,
                      opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3
                    }}
                    transition={{ duration: 0.2 }}
                    className={`w-2 h-2 rounded-full ${isActive
                      ? 'bg-yellow-500 shadow-lg'
                      : isCompleted
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                      }`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}