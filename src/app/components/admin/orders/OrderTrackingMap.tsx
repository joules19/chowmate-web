"use client";

export default function OrderTrackingMap() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-96">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Live Order Tracking
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Real-time visualization of active orders and delivery progress
            </p>
            <div className="text-sm text-gray-400">
              Order tracking map integration coming soon...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}