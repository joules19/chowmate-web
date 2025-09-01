"use client";

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    ChatBubbleLeftEllipsisIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    CheckCircleIcon,
    PaperClipIcon,
    CalendarIcon
} from '@heroicons/react/24/outline';
import { useSendInstructionToVendor } from '@/app/lib/hooks/api-hooks.ts/use-vendor';

interface Props {
    vendorId: string;
    vendorName: string;
    isOpen: boolean;
    onClose: () => void;
}

interface InstructionTemplate {
    id: string;
    name: string;
    subject: string;
    message: string;
    category: string;
    priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export default function InstructionModal({ vendorId, vendorName, isOpen, onClose }: Props) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
    const [category, setCategory] = useState('');
    const [requireAcknowledgment, setRequireAcknowledgment] = useState(false);
    const [scheduledDelivery, setScheduledDelivery] = useState('');
    const [attachments, setAttachments] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const sendInstructionMutation = useSendInstructionToVendor();

    const predefinedCategories = [
        'General Information',
        'Policy Update',
        'Quality Standards',
        'Safety Requirements',
        'Technical Support',
        'Account Management',
        'Compliance Issue',
        'Performance Improvement',
        'Training Required',
        'Marketing Guidelines',
        'Menu Management',
        'Order Management',
        'Customer Service',
        'Payment Issues',
        'Other'
    ];

    const instructionTemplates: InstructionTemplate[] = [
        {
            id: '1',
            name: 'Quality Standards Reminder',
            subject: 'Food Quality Standards Reminder',
            message: 'This is a reminder about maintaining our food quality standards. Please ensure all food items meet the required quality criteria before delivery to customers.\n\nKey points to remember:\n- Check food temperature before packaging\n- Ensure proper packaging to maintain freshness\n- Follow portion size guidelines\n- Maintain cleanliness standards\n\nThank you for your continued commitment to quality.',
            category: 'Quality Standards',
            priority: 'Medium'
        },
        {
            id: '2',
            name: 'Safety Protocol Update',
            subject: 'Updated Safety Protocols - Immediate Action Required',
            message: 'We have updated our safety protocols effective immediately. Please review and implement the following changes:\n\n1. Enhanced sanitization procedures\n2. Updated food handling guidelines\n3. New personal protective equipment requirements\n\nPlease acknowledge receipt and confirm implementation within 24 hours.',
            category: 'Safety Requirements',
            priority: 'High'
        },
        {
            id: '3',
            name: 'Performance Feedback',
            subject: 'Performance Review and Improvement Areas',
            message: 'Based on recent performance metrics, we would like to discuss areas for improvement:\n\n- Order preparation time\n- Customer satisfaction scores\n- Delivery accuracy\n\nWe are here to support you in achieving better results. Please let us know if you need any assistance or training.',
            category: 'Performance Improvement',
            priority: 'Medium'
        },
        {
            id: '4',
            name: 'Account Suspension Warning',
            subject: 'Account Status Warning - Immediate Action Required',
            message: 'This is an urgent notice regarding your account status. We have identified issues that require immediate attention:\n\n[Specify issues here]\n\nFailure to address these issues within 48 hours may result in account suspension. Please contact support immediately.',
            category: 'Account Management',
            priority: 'Urgent'
        },
        {
            id: '5',
            name: 'New Feature Announcement',
            subject: 'New Platform Features Available',
            message: 'We are excited to announce new features that will help improve your business:\n\n- Enhanced analytics dashboard\n- Improved order management tools\n- New customer communication features\n\nThese features are now available in your vendor portal. Please take some time to explore and let us know if you have any questions.',
            category: 'Technical Support',
            priority: 'Low'
        },
        {
            id: '6',
            name: 'Policy Violation Notice',
            subject: 'Policy Violation - Corrective Action Required',
            message: 'We have identified a violation of our platform policies:\n\n[Specify violation details]\n\nThis notice serves as a formal warning. Please review our terms of service and ensure compliance to avoid account restrictions.\n\nRequired actions:\n1. [Action 1]\n2. [Action 2]\n3. [Action 3]\n\nDeadline: [Date]',
            category: 'Compliance Issue',
            priority: 'High'
        }
    ];

    const handleTemplateSelect = (templateId: string) => {
        const template = instructionTemplates.find(t => t.id === templateId);
        if (template) {
            setSubject(template.subject);
            setMessage(template.message);
            setCategory(template.category);
            setPriority(template.priority);
            setSelectedTemplate(templateId);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;

        setIsSubmitting(true);
        try {
            await sendInstructionMutation.mutateAsync({
                vendorId,
                request: {
                    subject: subject.trim(),
                    message: message.trim(),
                    priority,
                    category: category || undefined,
                    requireAcknowledgment,
                    scheduledDelivery: scheduledDelivery || undefined,
                    attachments: attachments.length > 0 ? attachments : undefined
                }
            });

            // Reset form
            setSubject('');
            setMessage('');
            setPriority('Medium');
            setCategory('');
            setRequireAcknowledgment(false);
            setScheduledDelivery('');
            setAttachments([]);
            setSelectedTemplate('');

            onClose();
        } catch (error) {
            console.error('Failed to send instruction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPriorityIcon = (priorityLevel: string) => {
        switch (priorityLevel) {
            case 'Urgent':
                return <ExclamationTriangleIcon className="h-5 w-5 text-danger-500" />;
            case 'High':
                return <ExclamationTriangleIcon className="h-5 w-5 text-warning-500" />;
            case 'Medium':
                return <InformationCircleIcon className="h-5 w-5 text-primary-500" />;
            case 'Low':
                return <CheckCircleIcon className="h-5 w-5 text-success-500" />;
            default:
                return <InformationCircleIcon className="h-5 w-5 text-text-tertiary" />;
        }
    };

    const getPriorityColor = (priorityLevel: string) => {
        switch (priorityLevel) {
            case 'Urgent':
                return 'border-danger-200 bg-danger-50 text-danger-800';
            case 'High':
                return 'border-warning-200 bg-warning-50 text-warning-800';
            case 'Medium':
                return 'border-primary-200 bg-primary-50 text-primary-800';
            case 'Low':
                return 'border-success-200 bg-success-50 text-success-800';
            default:
                return 'border-border-light bg-surface-50 text-text-primary';
        }
    };

    const addAttachment = () => {
        // In a real implementation, this would open a file picker
        const url = prompt('Enter attachment URL:');
        if (url) {
            setAttachments([...attachments, url]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-card bg-surface-0 shadow-xl transition-all">
                                <form onSubmit={handleSubmit}>
                                    {/* Header */}
                                    <div className="flex items-center justify-between p-6 border-b border-border-light">
                                        <div className="flex items-center space-x-3">
                                            <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-primary-500" />
                                            <Dialog.Title className="text-lg font-semibold text-text-primary">
                                                Send Instruction
                                            </Dialog.Title>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="p-1 hover:bg-surface-100 rounded transition-colors"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-text-tertiary" />
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 max-h-96 overflow-y-auto">
                                        {/* Vendor Info */}
                                        <div className="bg-surface-50 rounded-card p-4 mb-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <span className="text-sm font-medium text-primary-700">
                                                        {vendorName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-text-primary">Sending to: {vendorName}</div>
                                                    <div className="text-sm text-text-tertiary">Vendor ID: {vendorId}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Template Selection */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-text-secondary mb-2">
                                                Use Template (Optional)
                                            </label>
                                            <select
                                                value={selectedTemplate}
                                                onChange={(e) => handleTemplateSelect(e.target.value)}
                                                className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                            >
                                                <option value="">Choose a template...</option>
                                                {instructionTemplates.map((template) => (
                                                    <option key={template.id} value={template.id}>
                                                        {template.name} ({template.priority} Priority)
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Form Fields */}
                                        <div className="space-y-4">
                                            {/* Subject and Priority Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Subject <span className="text-danger-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={subject}
                                                        onChange={(e) => setSubject(e.target.value)}
                                                        placeholder="Enter subject..."
                                                        required
                                                        className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-text-secondary mb-2">
                                                        Priority
                                                    </label>
                                                    <select
                                                        value={priority}
                                                        onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High' | 'Urgent')}
                                                        className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                    >
                                                        <option value="Low">Low</option>
                                                        <option value="Medium">Medium</option>
                                                        <option value="High">High</option>
                                                        <option value="Urgent">Urgent</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Priority Preview */}
                                            <div className={`flex items-center space-x-2 p-3 rounded-card border ${getPriorityColor(priority)}`}>
                                                {getPriorityIcon(priority)}
                                                <span className="text-sm font-medium">
                                                    This instruction will be marked as {priority} priority
                                                </span>
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Category
                                                </label>
                                                <select
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                >
                                                    <option value="">Select category...</option>
                                                    {predefinedCategories.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Message */}
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Message <span className="text-danger-500">*</span>
                                                </label>
                                                <textarea
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Enter your instruction message..."
                                                    required
                                                    rows={6}
                                                    className="w-full border border-border-default rounded-input px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary resize-none"
                                                />
                                                <p className="text-xs text-text-tertiary mt-1">
                                                    Characters: {message.length}
                                                </p>
                                            </div>

                                            {/* Scheduled Delivery */}
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Scheduled Delivery (Optional)
                                                </label>
                                                <div className="relative">
                                                    <CalendarIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary" />
                                                    <input
                                                        type="datetime-local"
                                                        value={scheduledDelivery}
                                                        onChange={(e) => setScheduledDelivery(e.target.value)}
                                                        min={new Date().toISOString().slice(0, 16)}
                                                        className="w-full border border-border-default rounded-input pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-surface-50 text-text-primary"
                                                    />
                                                </div>
                                                <p className="text-xs text-text-tertiary mt-1">
                                                    Leave empty to send immediately
                                                </p>
                                            </div>

                                            {/* Attachments */}
                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2">
                                                    Attachments (Optional)
                                                </label>
                                                {attachments.length > 0 && (
                                                    <div className="space-y-2 mb-2">
                                                        {attachments.map((attachment, index) => (
                                                            <div key={index} className="flex items-center justify-between p-2 bg-surface-50 rounded border">
                                                                <div className="flex items-center space-x-2">
                                                                    <PaperClipIcon className="h-4 w-4 text-text-tertiary" />
                                                                    <span className="text-sm text-text-primary truncate">
                                                                        {attachment}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAttachment(index)}
                                                                    className="text-danger-600 hover:text-danger-700 text-sm"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={addAttachment}
                                                    className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                                                >
                                                    <PaperClipIcon className="h-4 w-4" />
                                                    <span>Add Attachment</span>
                                                </button>
                                            </div>

                                            {/* Options */}
                                            <div className="space-y-3">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="requireAcknowledgment"
                                                        checked={requireAcknowledgment}
                                                        onChange={(e) => setRequireAcknowledgment(e.target.checked)}
                                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border-default rounded"
                                                    />
                                                    <label htmlFor="requireAcknowledgment" className="ml-2 text-sm text-text-primary">
                                                        Require vendor acknowledgment
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-border-light bg-surface-50">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-0 border border-border-default rounded-button hover:bg-surface-100 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || !subject.trim() || !message.trim()}
                                            className={`px-4 py-2 text-sm font-medium text-white rounded-button focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${priority === 'Urgent'
                                                    ? 'bg-danger-500 hover:bg-danger-600 focus:ring-danger-500'
                                                    : priority === 'High'
                                                        ? 'bg-warning-500 hover:bg-warning-600 focus:ring-warning-500'
                                                        : 'bg-primary-500 hover:bg-primary-600 focus:ring-primary-500'
                                                }`}
                                        >
                                            {isSubmitting ? 'Sending...' : scheduledDelivery ? 'Schedule Instruction' : 'Send Instruction'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}