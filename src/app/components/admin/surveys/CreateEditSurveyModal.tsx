"use client";

import { useState, useEffect } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import { QuestionType, CreateSurveyDto, ValidationRulesDto, SurveyResponseDto } from '../../../lib/api/repositories/admin-survey-repository';


interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  isRequired: boolean;
  description: string;
  options: string[];
  validationRules?: ValidationRulesDto | null;
  order: number;
}



interface Props {
  isOpen: boolean;
  onClose: () => void;
  survey?: SurveyResponseDto;
  onSave: (data: CreateSurveyDto) => void;
}

const CreateEditSurveyModal = ({ isOpen, onClose, survey, onSave }: Props) => {
  const [formData, setFormData] = useState<CreateSurveyDto>({
    title: '',
    description: '',
    incentiveDescription: '',
    startDate: '',
    endDate: '',
    allowMultipleSubmissions: false,
    requireAuthentication: true,
    questions: []
  });

  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);

  useEffect(() => {
    if (survey) {
      setFormData({
        title: survey.title,
        description: survey.description,
        incentiveDescription: survey.incentiveDescription,
        startDate: survey.startDate ? survey.startDate.split('T')[0] : '',
        endDate: survey.endDate ? survey.endDate.split('T')[0] : '',
        allowMultipleSubmissions: survey.allowMultipleSubmissions,
        requireAuthentication: survey.requireAuthentication,
        questions: survey.questions.map(q => ({
          text: q.text,
          type: q.type,
          isRequired: q.isRequired,
          description: q.description,
          options: q.options,
          validationRules: q.validationRules,
          order: q.order
        }))
      });
      setQuestions(survey.questions.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type,
        isRequired: q.isRequired,
        description: q.description,
        options: q.options,
        validationRules: q.validationRules,
        order: q.order
      })));
    } else {
      setFormData({
        title: '',
        description: '',
        incentiveDescription: '',
        startDate: '',
        endDate: '',
        allowMultipleSubmissions: false,
        requireAuthentication: true,
        questions: []
      });
      setQuestions([]);
    }
  }, [survey, isOpen]);

  const questionTypes = [
    { value: QuestionType.ShortText, label: 'Short Text' },
    { value: QuestionType.LongText, label: 'Long Text' },
    { value: QuestionType.MultipleChoice, label: 'Multiple Choice (Single)' },
    { value: QuestionType.MultipleSelect, label: 'Multiple Choice (Multiple)' },
    { value: QuestionType.Rating, label: 'Rating Scale' },
    { value: QuestionType.YesNo, label: 'Yes/No' },
    { value: QuestionType.Dropdown, label: 'Dropdown' }
  ];

  const addQuestion = () => {
    const newQuestion: SurveyQuestion = {
      id: `temp-${Date.now()}`,
      text: '',
      type: QuestionType.ShortText,
      isRequired: false,
      description: '',
      options: [],
      validationRules: null,
      order: questions.length + 1
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, field: keyof SurveyQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    // Reorder remaining questions
    updatedQuestions.forEach((q, i) => {
      q.order = i + 1;
    });
    setQuestions(updatedQuestions);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === questions.length - 1)) {
      return;
    }

    const updatedQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [updatedQuestions[index], updatedQuestions[targetIndex]] = [updatedQuestions[targetIndex], updatedQuestions[index]];
    
    // Update order
    updatedQuestions.forEach((q, i) => {
      q.order = i + 1;
    });
    
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  const hasOptions = (type: QuestionType) => {
    return [QuestionType.MultipleChoice, QuestionType.MultipleSelect, QuestionType.Dropdown].includes(type);
  };

  const hasRatingValidation = (type: QuestionType) => {
    return type === QuestionType.Rating;
  };

  const hasLengthValidation = (type: QuestionType) => {
    return [QuestionType.ShortText, QuestionType.LongText].includes(type);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const questionsData = questions.map(q => ({
      text: q.text,
      type: q.type,
      isRequired: q.isRequired,
      description: q.description,
      options: q.options,
      validationRules: q.validationRules,
      order: q.order
    }));

    onSave({
      ...formData,
      questions: questionsData
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface-0 rounded-card shadow-soft-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h2 className="text-xl font-semibold text-text-primary">
            {survey ? 'Edit Survey' : 'Create New Survey'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-tertiary hover:text-text-primary hover:bg-surface-100 rounded-soft transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[calc(90vh-80px)]">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-text-primary">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Survey Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter survey title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter survey description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Incentive Description
                  </label>
                  <input
                    type="text"
                    value={formData.incentiveDescription}
                    onChange={(e) => setFormData({ ...formData, incentiveDescription: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 10% discount on next order"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowMultiple"
                      checked={formData.allowMultipleSubmissions}
                      onChange={(e) => setFormData({ ...formData, allowMultipleSubmissions: e.target.checked })}
                      className="w-4 h-4 text-primary-500 border-border-default rounded focus:ring-primary-500"
                    />
                    <label htmlFor="allowMultiple" className="ml-2 text-sm text-text-secondary">
                      Allow multiple submissions from same user
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="requireAuth"
                      checked={formData.requireAuthentication}
                      onChange={(e) => setFormData({ ...formData, requireAuthentication: e.target.checked })}
                      className="w-4 h-4 text-primary-500 border-border-default rounded focus:ring-primary-500"
                    />
                    <label htmlFor="requireAuth" className="ml-2 text-sm text-text-secondary">
                      Require user authentication
                    </label>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-text-primary">Questions</h3>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 text-sm font-medium"
                  >
                    <PlusIcon className="w-4 h-4" />
                    Add Question
                  </button>
                </div>

                {questions.map((question, questionIndex) => (
                  <div key={question.id} className="bg-surface-100 border border-border-default rounded-card p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-tertiary">
                          Question {questionIndex + 1}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveQuestion(questionIndex, 'up')}
                            disabled={questionIndex === 0}
                            className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveQuestion(questionIndex, 'down')}
                            disabled={questionIndex === questions.length - 1}
                            className="p-1 text-text-tertiary hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ArrowDownIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        className="p-1 text-danger-500 hover:text-danger-600"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Question Text *
                        </label>
                        <input
                          type="text"
                          required
                          value={question.text}
                          onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                          className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter question text"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(questionIndex, 'type', parseInt(e.target.value) as QuestionType)}
                          className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                          Description
                        </label>
                        <input
                          type="text"
                          value={question.description}
                          onChange={(e) => updateQuestion(questionIndex, 'description', e.target.value)}
                          className="w-full px-3 py-2 bg-surface-0 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Optional description or help text"
                        />
                      </div>

                      {hasOptions(question.type) && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-text-secondary">
                              Options
                            </label>
                            <button
                              type="button"
                              onClick={() => addOption(questionIndex)}
                              className="text-xs text-primary-600 hover:text-primary-700"
                            >
                              + Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                  className="flex-1 px-3 py-2 bg-surface-0 border border-border-default rounded-button text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder={`Option ${optionIndex + 1}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(questionIndex, optionIndex)}
                                  className="p-2 text-danger-500 hover:text-danger-600"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`required-${questionIndex}`}
                          checked={question.isRequired}
                          onChange={(e) => updateQuestion(questionIndex, 'isRequired', e.target.checked)}
                          className="w-4 h-4 text-primary-500 border-border-default rounded focus:ring-primary-500"
                        />
                        <label htmlFor={`required-${questionIndex}`} className="ml-2 text-sm text-text-secondary">
                          Required question
                        </label>
                      </div>
                    </div>
                  </div>
                ))}

                {questions.length === 0 && (
                  <div className="text-center py-8 text-text-tertiary">
                    <p>No questions added yet.</p>
                    <p className="text-xs mt-1">Click "Add Question" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t border-border-light">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-secondary border border-border-default rounded-button hover:bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-text-inverse rounded-button hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {survey ? 'Update Survey' : 'Create Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditSurveyModal;