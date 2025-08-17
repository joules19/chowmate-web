"use client";

export default function RiderMap() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-96">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Real-time Rider Tracking
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Interactive map showing live location of all active riders
            </p>
            <div className="text-sm text-gray-400">
              Map integration coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}