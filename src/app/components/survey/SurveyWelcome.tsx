'use client';

import { motion } from 'framer-motion';
import { ClockIcon, GiftIcon, StarIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface Survey {
  id: string;
  title: string;
  description: string;
  incentiveDescription?: string;
  questions: any[];
}

interface SurveyWelcomeProps {
  survey: Survey;
  onStart: () => void;
}

export default function SurveyWelcome({ survey, onStart }: SurveyWelcomeProps) {
  const estimatedTime = Math.ceil(survey.questions.length * 0.25); // Rough estimate: 30 seconds per question

  return (
    <div className="text-center space-y-8">
      {/* Logo/Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mb-8"
      >
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-100 flex items-center justify-center shadow-xl">
          <Image
            src="/assets/images/icon/icon.png"
            alt="Chowmate"
            width={70}
            height={70}
            className="rounded-lg"
          />
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="space-y-4"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight max-w-4xl mx-auto">
          {survey.title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {survey.description}
        </p>
      </motion.div>

      {/* Incentive Badge */}
      {survey.incentiveDescription && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-2xl"
        >
          <GiftIcon className="w-6 h-6 text-green-600" />
          <span className="text-green-800 font-semibold text-lg">
            {survey.incentiveDescription}
          </span>
        </motion.div>
      )}

      {/* Survey Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto"
      >
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <ClockIcon className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">{estimatedTime} minutes</p>
          <p className="text-xs text-gray-500">To complete</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-center mb-2">
            <div className="text-yellow-500 text-xl font-bold">{survey.questions.length}</div>
          </div>
          <p className="text-sm font-medium text-gray-900">Questions</p>
          <p className="text-xs text-gray-500">One at a time</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <StarIcon className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-900">Anonymous</p>
          <p className="text-xs text-gray-500">No sign-up required</p>
        </div>
      </motion.div>

      {/* Privacy Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-gray-500 max-w-md mx-auto space-y-2"
      >
        <p>
          🔒 Your responses are confidential and will help us improve Chowmate's service.
        </p>
        {/* <p>
          You can go back and change your answers at any time.
        </p> */}
      </motion.div>

      {/* Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="pt-4"
      >
        <button
          onClick={onStart}
          className="group inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          <span>Start Survey</span>
          <motion.svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            initial={{ x: 0 }}
            animate={{ x: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
        </button>
      </motion.div>

      {/* Powered by */}
      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-xs text-gray-400"
      >
        <p>Chowmate</p>
      </motion.div> */}
    </div>
  );
}