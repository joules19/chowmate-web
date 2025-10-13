'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { SurveyQuestion, QUESTION_TYPE_MAP, QuestionTypeString, ValidationRules } from '@/app/lib/api/repositories/survey-repository';

interface Question {
  id: string;
  text: string;
  type: QuestionTypeString;
  isRequired: boolean;
  description?: string;
  options?: string[];
  minRating?: number;
  maxRating?: number;
  order: number;
  validationRules?: ValidationRules | null;
}

// Helper function to convert backend question to frontend question
function convertQuestion(backendQuestion: SurveyQuestion): Question {
  const typeString = QUESTION_TYPE_MAP[backendQuestion.type as keyof typeof QUESTION_TYPE_MAP] || 'ShortText';
  
  return {
    id: backendQuestion.id,
    text: backendQuestion.text,
    type: typeString,
    isRequired: backendQuestion.isRequired,
    description: backendQuestion.description || '',
    options: backendQuestion.options || [],
    minRating: backendQuestion.validationRules?.minRating || 1,
    maxRating: backendQuestion.validationRules?.maxRating || 5,
    order: backendQuestion.order,
    validationRules: backendQuestion.validationRules
  };
}

interface QuestionRendererProps {
  question: SurveyQuestion | Question;
  value: any;
  onChange: (value: any, text?: string) => void;
  isSubmitting?: boolean;
}

export default function QuestionRenderer({ question: rawQuestion, value, onChange, isSubmitting }: QuestionRendererProps) {
  // Convert backend question format to frontend format if needed
  const question = 'type' in rawQuestion && typeof rawQuestion.type === 'number' 
    ? convertQuestion(rawQuestion as SurveyQuestion)
    : rawQuestion as Question;
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current && (question.type === 'ShortText' || question.type === 'LongText')) {
        inputRef.current.focus();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [question.type]);

  const renderQuestionHeader = () => (
    <div className="space-y-4 mb-8">
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight"
      >
        {question.text}
        {question.isRequired && (
          <span className="text-red-500 ml-1" aria-label="Required">*</span>
        )}
      </motion.h2>
      
      {question.description && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 text-lg"
        >
          {question.description}
        </motion.p>
      )}
    </div>
  );

  const renderShortText = () => (
    <div>
      {renderQuestionHeader()}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}
      >
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value, e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-6 py-4 text-lg border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-yellow-50 focus:bg-white placeholder-gray-400"
          placeholder="Type your answer here..."
          disabled={isSubmitting}
          aria-describedby={question.description ? `${question.id}-description` : undefined}
        />
        <div className={`absolute bottom-0 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${isFocused ? 'w-full' : 'w-0'}`} />
      </motion.div>
    </div>
  );

  const renderLongText = () => (
    <div>
      {renderQuestionHeader()}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}
      >
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value || ''}
          onChange={(e) => onChange(e.target.value, e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={4}
          className="w-full px-6 py-4 text-lg border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-yellow-50 focus:bg-white placeholder-gray-400 resize-none"
          placeholder="Share your thoughts..."
          disabled={isSubmitting}
          aria-describedby={question.description ? `${question.id}-description` : undefined}
        />
        <div className={`absolute bottom-0 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${isFocused ? 'w-full' : 'w-0'}`} />
      </motion.div>
    </div>
  );

  const renderMultipleChoice = () => (
    <div>
      {renderQuestionHeader()}
      <div className="space-y-3">
        {question.options?.map((option, index) => (
          <motion.label
            key={option}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              value === option
                ? 'border-yellow-500 bg-yellow-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <input
              type="radio"
              name={question.id}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value, e.target.value)}
              className="sr-only"
              disabled={isSubmitting}
            />
            <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-4 transition-all ${
              value === option
                ? 'border-yellow-500 bg-yellow-500 shadow-sm'
                : 'border-gray-300 group-hover:border-gray-400'
            }`}>
              {value === option && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-full h-full rounded-full bg-white scale-50"
                />
              )}
            </div>
            <span className={`text-lg font-medium transition-colors ${
              value === option ? 'text-yellow-900' : 'text-gray-700 group-hover:text-gray-900'
            }`}>
              {option}
            </span>
            {value === option && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-4 text-yellow-500"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.label>
        ))}
      </div>
    </div>
  );

  const renderMultipleSelect = () => {
    const selectedValues = Array.isArray(value) ? value : [];
    
    const handleOptionChange = (option: string, checked: boolean) => {
      let newValues;
      if (checked) {
        newValues = [...selectedValues, option];
      } else {
        newValues = selectedValues.filter(v => v !== option);
      }
      onChange(newValues, newValues.join(', '));
    };

    return (
      <div>
        {renderQuestionHeader()}
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = selectedValues.includes(option);
            return (
              <motion.label
                key={option}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`group relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={isSelected}
                  onChange={(e) => handleOptionChange(option, e.target.checked)}
                  className="sr-only"
                  disabled={isSubmitting}
                />
                <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-4 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-500 shadow-sm'
                    : 'border-gray-300 group-hover:border-gray-400'
                }`}>
                  {isSelected && (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </motion.svg>
                  )}
                </div>
                <span className={`text-lg font-medium transition-colors ${
                  isSelected ? 'text-orange-900' : 'text-gray-700 group-hover:text-gray-900'
                }`}>
                  {option}
                </span>
              </motion.label>
            );
          })}
        </div>
        {selectedValues.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <p className="text-green-800 font-medium">
              {selectedValues.length} option{selectedValues.length > 1 ? 's' : ''} selected
            </p>
          </motion.div>
        )}
      </div>
    );
  };

  const renderRating = () => {
    const minRating = question.minRating || 1;
    const maxRating = question.maxRating || 5;
    const currentRating = typeof value === 'number' ? value : 0;
    const displayRating = hoveredRating !== null ? hoveredRating : currentRating;

    return (
      <div>
        {renderQuestionHeader()}
        <div className="flex flex-col items-center space-y-6">
          <div className="flex space-x-2">
            {Array.from({ length: maxRating - minRating + 1 }, (_, i) => {
              const rating = minRating + i;
              const isFilled = rating <= displayRating;
              
              return (
                <button
                  key={rating}
                  onClick={() => onChange(rating, rating.toString())}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded transition-all duration-150 transform hover:scale-110"
                  disabled={isSubmitting}
                  aria-label={`Rate ${rating} out of ${maxRating}`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {isFilled ? (
                      <StarIcon className="w-12 h-12 text-yellow-400 drop-shadow-sm" />
                    ) : (
                      <StarOutlineIcon className="w-12 h-12 text-gray-300 hover:text-yellow-300 transition-colors" />
                    )}
                  </motion.div>
                </button>
              );
            })}
          </div>
          
          <div className="text-center space-y-2">
            {displayRating > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-gray-900"
              >
                {displayRating} out of {maxRating}
              </motion.p>
            )}
            <div className="flex justify-between text-sm text-gray-500 w-full max-w-xs">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderYesNo = () => (
    <div>
      {renderQuestionHeader()}
      <div className="flex flex-col sm:flex-row gap-4">
        {['Yes', 'No'].map((option, index) => (
          <motion.button
            key={option}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            onClick={() => onChange(option, option)}
            className={`flex-1 py-6 px-8 rounded-2xl border-2 font-semibold text-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 ${
              value === option
                ? 'border-yellow-500 bg-yellow-500 text-white shadow-lg'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
            }`}
            disabled={isSubmitting}
          >
            {option}
            {value === option && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2"
              >
                <svg className="w-6 h-6 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderDropdown = () => (
    <div>
      {renderQuestionHeader()}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.02]' : ''}`}
      >
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value, e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full px-6 py-4 text-lg border-2 border-yellow-200 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors bg-yellow-50 focus:bg-white appearance-none cursor-pointer"
          disabled={isSubmitting}
          aria-describedby={question.description ? `${question.id}-description` : undefined}
        >
          <option value="" disabled>Choose an option...</option>
          {question.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        <div className={`absolute bottom-0 left-0 h-0.5 bg-yellow-500 transition-all duration-300 ${isFocused ? 'w-full' : 'w-0'}`} />
      </motion.div>
    </div>
  );

  switch (question.type) {
    case 'ShortText':
      return renderShortText();
    case 'LongText':
      return renderLongText();
    case 'MultipleChoice':
      return renderMultipleChoice();
    case 'MultipleSelect':
      return renderMultipleSelect();
    case 'Rating':
      return renderRating();
    case 'YesNo':
      return renderYesNo();
    case 'Dropdown':
      return renderDropdown();
    default:
      return renderShortText();
  }
}