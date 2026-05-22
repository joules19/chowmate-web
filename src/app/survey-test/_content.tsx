'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SurveyTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8 max-w-md"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Survey Test Page
          </h1>
          <p className="text-gray-600 text-lg">
            Test the Typeform-like survey experience for Chowmate
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/survey/12345678-1234-5678-9012-123456789012"
            className="block w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Chowmate Feedback Survey
          </Link>
          
          <Link
            href="/survey/chowmate-feedback"
            className="block w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Survey (Fallback/Mock)
          </Link>

          <p className="text-sm text-gray-500">
            Experience the beautiful, mobile-responsive survey interface
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Features Included:
          </h2>
          <ul className="text-left text-sm text-gray-600 space-y-2">
            <li>✅ Typeform-like one-question-at-a-time interface</li>
            <li>✅ Beautiful animations and transitions</li>
            <li>✅ Mobile-responsive design</li>
            <li>✅ Accessibility features (WCAG compliant)</li>
            <li>✅ Progress indicator</li>
            <li>✅ Keyboard navigation support</li>
            <li>✅ Multiple question types</li>
            <li>✅ Celebration screen with confetti</li>
            <li>✅ One submission per user validation</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-block text-blue-600 hover:text-blue-800 font-medium underline"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </div>
  );
}