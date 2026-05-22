'use client';

import { useState } from 'react';
import { useActiveSurveys } from '@/app/lib/hooks/api-hooks.ts/use-survey';

export default function SurveyDebugPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const { data: activeSurveys, isLoading, error } = useActiveSurveys();

  const testDirectAPI = async () => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com';
      const response = await fetch(`${baseURL}/api/common/survey/active`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      setTestResult({ 
        status: response.status, 
        data: data,
        url: `${baseURL}/api/common/survey/active`
      });
    } catch (err: any) {
      setTestResult({ 
        error: err.message,
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com'}/api/common/survey/active`
      });
    }
  };

  const testSpecificSurvey = async (surveyId: string) => {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com';
      const response = await fetch(`${baseURL}/api/common/survey/${surveyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      const data = await response.json();
      setTestResult({ 
        status: response.status, 
        data: data,
        url: `${baseURL}/api/common/survey/${surveyId}`,
        surveyId: surveyId
      });
    } catch (err: any) {
      setTestResult({ 
        error: err.message,
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com'}/api/common/survey/${surveyId}`,
        surveyId: surveyId
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Survey API Debug Tool
          </h1>
          <p className="text-gray-600">
            Test survey API endpoints and debug connection issues
          </p>
        </div>

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'https://chowmate-db2u.onrender.com'}</p>
            <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          </div>
        </div>

        {/* React Query Results */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">React Query - Active Surveys</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isLoading ? 'bg-yellow-100 text-yellow-800' : 
                error ? 'bg-red-100 text-red-800' : 
                'bg-green-100 text-green-800'
              }`}>
                {isLoading ? 'Loading...' : error ? 'Error' : 'Success'}
              </span>
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-4">
                <p className="text-red-800 font-medium">Error:</p>
                <pre className="text-red-600 text-xs mt-2 overflow-auto">
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}
            
            {activeSurveys && (
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800 font-medium">Active Surveys Response:</p>
                <pre className="text-green-700 text-xs mt-2 overflow-auto max-h-64">
                  {JSON.stringify(activeSurveys, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Direct API Test */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Direct API Test</h2>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <button
                onClick={testDirectAPI}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Test Active Surveys API
              </button>
              
              <button
                onClick={() => testSpecificSurvey('chowmate-feedback')}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Test chowmate-feedback
              </button>
              
              <button
                onClick={() => testSpecificSurvey('12345678-1234-5678-9012-123456789012')}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
              >
                Test GUID Survey
              </button>
            </div>
            
            {testResult && (
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="font-medium mb-2">API Test Result:</p>
                <pre className="text-xs overflow-auto max-h-96 bg-white p-3 rounded border">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Backend Requirements */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Backend Requirements Checklist</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
              <span>Survey seeder has been run (check database for surveys)</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
              <span>Survey controller is registered and accessible</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
              <span>CORS is configured for your frontend domain</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
              <span>Database connection is working</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 rounded border-2 border-gray-300"></div>
              <span>Survey service dependencies are injected correctly</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="/survey-test" 
              className="block p-4 bg-yellow-100 border border-yellow-300 rounded hover:bg-yellow-200 transition-colors"
            >
              <h3 className="font-medium text-yellow-900">Survey Test Page</h3>
              <p className="text-yellow-700 text-sm">Test the complete survey experience</p>
            </a>
            
            <a 
              href="/survey/chowmate-feedback" 
              className="block p-4 bg-blue-100 border border-blue-300 rounded hover:bg-blue-200 transition-colors"
            >
              <h3 className="font-medium text-blue-900">Mock Survey</h3>
              <p className="text-blue-700 text-sm">Try with fallback mock data</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}