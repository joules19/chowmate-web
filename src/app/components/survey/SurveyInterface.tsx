'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import QuestionRenderer from './QuestionRenderer';
import ProgressBar from './ProgressBar';
import SurveyWelcome from './SurveyWelcome';
import SurveyComplete from './SurveyComplete';
import { useSubmitSurveyResponse } from '@/app/lib/hooks/api-hooks.ts/use-survey';
import { SubmitSurveyRequest, Survey, SurveyQuestion, QUESTION_TYPE_MAP } from '@/app/lib/api/repositories/survey-repository';

interface Answer {
  questionId: string;
  value: any;
  text?: string;
}

interface SurveyInterfaceProps {
  survey: Survey;
}

export default function SurveyInterface({ survey }: SurveyInterfaceProps) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 for welcome screen
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // React Query mutation for submitting survey
  const submitSurveyMutation = useSubmitSurveyResponse();

  // Sort questions by order
  const sortedQuestions = [...survey.questions].sort((a, b) => a.order - b.order);
  const totalSteps = sortedQuestions.length;
  const isWelcomeScreen = currentStep === -1;
  const isCompleteScreen = currentStep >= totalSteps;
  const currentQuestion = currentStep >= 0 && currentStep < totalSteps ? sortedQuestions[currentStep] : null;

  // Auto-advance for certain question types
  useEffect(() => {
    if (currentQuestion && answers[currentQuestion.id]) {
      const answer = answers[currentQuestion.id];
      
      // Auto-advance for single-choice questions (not multi-select)
      // Type 3 = MultipleChoice, Type 6 = YesNo
      if (currentQuestion.type === 3 || currentQuestion.type === 6) {
        const timer = setTimeout(() => {
          handleNext();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [answers, currentQuestion?.id]);

  // Smooth scroll to top when step changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (canGoNext()) {
          handleNext();
        }
      } else if (e.key === 'ArrowUp' && e.altKey) {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowDown' && e.altKey) {
        e.preventDefault();
        if (canGoNext()) {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, answers]);

  const handleAnswerChange = (questionId: string, value: any, text?: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { questionId, value, text }
    }));
  };

  const canGoNext = (): boolean => {
    if (isWelcomeScreen) return true;
    if (!currentQuestion) return false;
    
    const answer = answers[currentQuestion.id];
    
    if (currentQuestion.isRequired && !answer) return false;
    if (currentQuestion.isRequired && answer?.value === '') return false;
    if (currentQuestion.isRequired && Array.isArray(answer?.value) && answer.value.length === 0) return false;
    
    return true;
  };

  const handleNext = () => {
    if (isCompleteScreen) return;
    
    if (isWelcomeScreen) {
      setCurrentStep(0);
    } else if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit survey
      submitSurvey();
    }
  };

  const handlePrevious = () => {
    if (isWelcomeScreen) return;
    
    if (currentStep === 0) {
      setCurrentStep(-1);
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const submitSurvey = async () => {
    try {
      // Prepare submission data
      const submissionData: SubmitSurveyRequest = {
        surveyId: survey.id,
        sessionId,
        answers: Object.values(answers).map(answer => ({
          questionId: answer.questionId,
          answerText: answer.text || (typeof answer.value === 'string' ? answer.value : ''),
          selectedOptions: Array.isArray(answer.value) ? answer.value : [],
          numericValue: typeof answer.value === 'number' ? answer.value : null
        }))
      };

      // Submit using React Query mutation
      const result = await submitSurveyMutation.mutateAsync(submissionData);
      
      if (result.success) {
        console.log('Survey submitted successfully:', result.data);
        setCurrentStep(totalSteps);
      } else {
        console.error('Survey submission failed:', result.message);
        // Handle error - show toast or error message
        alert('Failed to submit survey: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('An error occurred while submitting the survey. Please try again.');
    }
  };

  // Get submission state from mutation
  const isSubmitting = submitSurveyMutation.isPending;

  const getProgress = (): number => {
    if (isWelcomeScreen) return 0;
    if (isCompleteScreen) return 100;
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 overflow-auto"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* Progress Bar */}
      {!isWelcomeScreen && (
        <ProgressBar 
          progress={getProgress()} 
          currentStep={Math.max(0, currentStep + 1)} 
          totalSteps={totalSteps}
        />
      )}

      {/* Main Content Container */}
      <div className="flex items-center justify-center min-h-screen px-4 py-8" style={{ paddingTop: !isWelcomeScreen ? '80px' : '32px' }}>
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {isWelcomeScreen && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <SurveyWelcome
                  survey={survey}
                  onStart={() => handleNext()}
                />
              </motion.div>
            )}

            {isCompleteScreen && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <SurveyComplete survey={survey} />
              </motion.div>
            )}

            {currentQuestion && !isCompleteScreen && (
              <motion.div
                key={`question-${currentQuestion.id}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-8"
              >
                {/* Question Number */}
                <div className="text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {currentStep + 1} of {totalSteps}
                  </span>
                </div>

                {/* Question Content */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="p-8 sm:p-12">
                    <QuestionRenderer
                      question={currentQuestion}
                      value={answers[currentQuestion.id]?.value}
                      onChange={(value, text) => handleAnswerChange(currentQuestion.id, value, text)}
                      isSubmitting={isSubmitting}
                    />
                  </div>
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevious}
                    className="group flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded-lg"
                    aria-label="Previous question"
                  >
                    <ChevronUpIcon className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
                    <span className="font-medium">Previous</span>
                  </button>

                  {/* Next/Submit Button */}
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext() || isSubmitting}
                    className={`group flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all transform focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
                      canGoNext() && !isSubmitting
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600 hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    aria-label={currentStep === totalSteps - 1 ? 'Submit survey' : 'Next question'}
                  >
                    <span>
                      {isSubmitting ? 'Submitting...' : currentStep === totalSteps - 1 ? 'Submit' : 'Next'}
                    </span>
                    {!isSubmitting && (
                      currentStep === totalSteps - 1 ? (
                        <ChevronDownIcon className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                      ) : (
                        <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                      )
                    )}
                    {isSubmitting && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                  </button>
                </div>

                {/* Keyboard Hints */}
                <div className="text-center text-sm text-gray-400 space-y-1">
                  <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to continue</p>
                  <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Alt + ↑</kbd> to go back</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}