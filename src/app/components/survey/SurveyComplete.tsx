'use client';

import { motion } from 'framer-motion';
import { CheckCircleIcon, GiftIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { ShareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface Survey {
  id: string;
  title: string;
  description: string;
  incentiveDescription?: string;
  questions: any[];
}

interface SurveyCompleteProps {
  survey: Survey;
}

export default function SurveyComplete({ survey }: SurveyCompleteProps) {
  const [showCopied, setShowCopied] = useState(false);

  // Trigger confetti animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B']
      });
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = () => {
    const shareText = `I just completed a survey for Chowmate and got free delivery! 🎉 Help them improve their service: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({
        title: 'Chowmate Survey',
        text: shareText,
        url: window.location.href,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  const handleGoToApp = () => {
    // Redirect to Chowmate app or main website
    window.open('https://chowmate.app', '_blank');
  };

  return (
    <div className="text-center space-y-8 max-w-2xl mx-auto">
      {/* Success Icon Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.2
        }}
        className="relative flex justify-center"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 w-24 h-24 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>

          {/* Main icon */}
          <CheckCircleIcon className="relative w-24 h-24 text-green-500 drop-shadow-lg" />

          {/* Sparkles */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -top-2 -right-2"
          >
            <SparklesIcon className="w-8 h-8 text-yellow-400" />
          </motion.div>

          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute -bottom-1 -left-2"
          >
            <SparklesIcon className="w-6 h-6 text-blue-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Thank You Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
          Thank You! 🎉
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
          Your feedback is invaluable and will help us make Chowmate even better for everyone.
        </p>
      </motion.div>

      {/* Reward/Incentive Card */}
      {survey.incentiveDescription && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 space-y-4 shadow-lg"
        >
          <div className="flex items-center justify-center space-x-3">
            <GiftIcon className="w-8 h-8 text-green-600" />
            <h2 className="text-2xl font-bold text-green-800">Your Reward</h2>
          </div>

          <p className="text-lg text-green-700 font-semibold">
            {survey.incentiveDescription}
          </p>

          <p className="text-sm text-green-600">
            * Check your email for more information. Valid for 30 days from today!
          </p>
          <p className="text-sm text-green-600">
            P.S: For registered users only
          </p>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto"
      >
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-blue-600">{survey.questions.length}</div>
          <p className="text-sm text-gray-600">Questions Answered</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center">
            <HeartIcon className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-gray-600">Made with Love</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-2xl font-bold text-green-600">100%</div>
          <p className="text-sm text-gray-600">Complete</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        {/* <button
          onClick={handleGoToApp}
          className="group flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span>Order Now & Use Reward</span>
          <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button> */}

        <button
          onClick={handleShare}
          className="group flex items-center justify-center space-x-3 px-6 py-4 bg-white text-gray-700 font-medium border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:shadow-md transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <ShareIcon className="w-5 h-5" />
          <span>{showCopied ? 'Copied!' : 'Share Survey'}</span>
        </button>
      </motion.div>

      {/* Follow-up Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="text-center space-y-2"
      >
        <p className="text-sm text-gray-500">
          Have more feedback? Email us at
          <a href="mailto:feedback@chowmate.app" className="text-yellow-600 hover:underline ml-1">
            support@chowmate.app
          </a>
        </p>

        <p className="text-xs text-gray-400">
          Your responses help hundreds of food lovers get better service every day 💙
        </p>
      </motion.div>
    </div>
  );
}