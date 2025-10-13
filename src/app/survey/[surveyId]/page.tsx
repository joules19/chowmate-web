'use client';

import { useParams, useRouter } from 'next/navigation';
import SurveyInterface from '@/app/components/survey/SurveyInterface';
import LoadingState from '@/app/components/ui/LoadingState';
import { useActiveSurveys } from '@/app/lib/hooks/api-hooks.ts/use-survey';
import { Survey } from '@/app/lib/api/repositories/survey-repository';

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const {
    data: activeSurveysResponse,
    isLoading: loading,
    error
  } = useActiveSurveys();

  // Use mock data as fallback for development
  const getMockSurvey = (): any => ({
    id: 'chowmate-feedback',
    title: "What's keeping you from placing your first (or next) order on Chowmate?",
    description: "Take 2 minutes to answer • Get free delivery on your next order just for answering",
    incentiveDescription: "Get free delivery on your first order just for answering",
    status: 'Active',
    allowMultipleSubmissions: false,
    requireAuthentication: false,
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: '1',
        text: 'How often do you usually order food online?',
        type: 3,
        isRequired: true,
        description: '',
        options: ['Daily', 'A few times a week', 'Once in a while', 'Rarely'],
        validationRules: null,
        order: 1
      },
      {
        id: '2',
        text: 'Have you used Chowmate to order food?',
        type: 3,
        isRequired: true,
        description: '',
        options: ['Yes', 'Not yet'],
        validationRules: null,
        order: 2
      },
      {
        id: '3',
        text: 'Any suggestions that would make Chowmate your go-to food app?',
        type: 2,
        isRequired: true,
        description: '',
        options: [],
        validationRules: null,
        order: 3
      },
      {
        id: '4',
        text: 'Enter your email to receive your free delivery reward',
        type: 1,
        isRequired: true,
        description: "We'll send your free delivery instructions to this email",
        options: [],
        validationRules: null,
        order: 4
      }
    ]
  });

  // Get survey data from API or use mock data as fallback
  const activeSurveys = activeSurveysResponse?.success && activeSurveysResponse.data
    ? activeSurveysResponse.data
    : [];

  // Find the survey by ID or use the first active survey, or fallback to mock
  const survey = activeSurveys.find(s => s.id === surveyId) ||
    activeSurveys[0] ||
    (surveyId === 'chowmate-feedback' ? getMockSurvey() : null);

  const apiError = error || (!activeSurveysResponse?.success && activeSurveysResponse?.message && surveyId !== 'chowmate-feedback');

  // Debug logging
  console.log('Survey ID:', surveyId);
  console.log('Active Surveys Response:', activeSurveysResponse);
  console.log('Active Surveys:', activeSurveys);
  console.log('Selected Survey:', survey);
  console.log('API Error:', apiError);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <LoadingState />
      </div>
    );
  }

  if (apiError || !survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">😔</div>
          <h1 className="text-2xl font-bold text-gray-900">Survey Not Found</h1>
          <p className="text-gray-600">{apiError instanceof Error ? apiError.message : apiError || 'The survey you\'re looking for doesn\'t exist.'}</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <SurveyInterface survey={survey} />;
}