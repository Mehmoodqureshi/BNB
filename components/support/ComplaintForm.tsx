'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, FileText, Paperclip, Send, X, 
  Calendar, CreditCard, Home, User, Shield, 
  Clock, Phone, Mail, MessageSquare, CheckCircle
} from 'lucide-react';
import { ComplaintFormData, SupportCategory, SupportPriority } from '@/lib/types/support';
import Button from '../ui/Button';

interface ComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isModal?: boolean;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false,
  isModal = false
}) => {
  const [step, setStep] = useState<'category' | 'details' | 'contact' | 'review'>('category');
  const [formData, setFormData] = useState<ComplaintFormData>({
    category: 'other',
    priority: 'medium',
    title: '',
    description: '',
    attachments: [],
    contactPreference: 'email',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories: { value: SupportCategory; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'booking_issue',
      label: 'Booking Issue',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Problems with reservations, check-in, or booking process'
    },
    {
      value: 'payment_problem',
      label: 'Payment Problem',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Issues with payments, billing, or transactions'
    },
    {
      value: 'property_complaint',
      label: 'Property Complaint',
      icon: <Home className="h-5 w-5" />,
      description: 'Issues with property condition, cleanliness, or amenities'
    },
    {
      value: 'host_issue',
      label: 'Host Issue',
      icon: <User className="h-5 w-5" />,
      description: 'Problems with host behavior or communication'
    },
    {
      value: 'cancellation',
      label: 'Cancellation',
      icon: <X className="h-5 w-5" />,
      description: 'Help with booking cancellations or modifications'
    },
    {
      value: 'refund_request',
      label: 'Refund Request',
      icon: <CreditCard className="h-5 w-5" />,
      description: 'Request a refund for your booking'
    },
    {
      value: 'technical_support',
      label: 'Technical Support',
      icon: <Shield className="h-5 w-5" />,
      description: 'Website, app, or technical issues'
    },
    {
      value: 'account_issue',
      label: 'Account Issue',
      icon: <User className="h-5 w-5" />,
      description: 'Problems with your account or profile'
    },
    {
      value: 'safety_concern',
      label: 'Safety Concern',
      icon: <Shield className="h-5 w-5" />,
      description: 'Safety or security issues'
    },
    {
      value: 'other',
      label: 'Other',
      icon: <FileText className="h-5 w-5" />,
      description: 'Something else not listed above'
    }
  ];

  const priorities: { value: SupportPriority; label: string; color: string; description: string }[] = [
    {
      value: 'low',
      label: 'Low',
      color: 'text-gray-600 bg-gray-100 dark:bg-gray-700',
      description: 'General inquiry or non-urgent issue'
    },
    {
      value: 'medium',
      label: 'Medium',
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
      description: 'Standard issue requiring attention'
    },
    {
      value: 'high',
      label: 'High',
      color: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20',
      description: 'Important issue affecting your stay'
    },
    {
      value: 'urgent',
      label: 'Urgent',
      color: 'text-red-600 bg-red-100 dark:bg-red-900/20',
      description: 'Critical issue requiring immediate attention'
    }
  ];

  const handleInputChange = (field: keyof ComplaintFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (formData.contactPreference === 'phone' && !formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required for phone contact';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    await onSubmit(formData);
  };

  const renderCategoryStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          What can we help you with?
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose the category that best describes your issue
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <div
            key={category.value}
            onClick={() => {
              handleInputChange('category', category.value);
              setStep('details');
            }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
              formData.category === category.value
                ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {category.icon}
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                  {category.label}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Tell us more details
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Provide specific information about your issue
        </p>
      </div>

      <div className="space-y-4">
        {/* Priority Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Priority Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {priorities.map((priority) => (
              <div
                key={priority.value}
                onClick={() => handleInputChange('priority', priority.value)}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.priority === priority.value
                    ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-center">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-2 ${priority.color}`}>
                    {priority.label}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {priority.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Brief Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Summarize your issue in a few words"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.title ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Detailed Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={5}
            placeholder="Please provide as much detail as possible about your issue. Include dates, times, and any relevant information that might help us resolve this quickly."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
              errors.description ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {formData.description.length}/500 characters
          </p>
        </div>

        {/* File Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Attachments (Optional)
          </label>
          <div className="space-y-3">
            <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-[#006699] transition-colors">
              <Paperclip className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Click to upload files or drag and drop
              </span>
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Phone className="h-12 w-12 text-[#006699] mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          How should we contact you?
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Choose your preferred contact method
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Contact Preference
          </label>
          <div className="space-y-3">
            {[
              { value: 'email', label: 'Email', icon: Mail, description: 'We\'ll send updates to your email' },
              { value: 'phone', label: 'Phone', icon: Phone, description: 'We\'ll call you for urgent issues' },
              { value: 'both', label: 'Both', icon: MessageSquare, description: 'Email updates and phone for urgent issues' }
            ].map((option) => (
              <div
                key={option.value}
                onClick={() => handleInputChange('contactPreference', option.value)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  formData.contactPreference === option.value
                    ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <option.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.contactPreference === 'phone' || formData.contactPreference === 'both' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="+971 50 123 4567"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 ${
                errors.phoneNumber ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
              }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber}</p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Review Your Complaint
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please review the details before submitting
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Category</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {categories.find(c => c.value === formData.category)?.label}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Priority</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            priorities.find(p => p.value === formData.priority)?.color
          }`}>
            {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
          </span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 block mb-2">Title</span>
          <span className="text-gray-900 dark:text-white font-medium">{formData.title}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-400 block mb-2">Description</span>
          <span className="text-gray-900 dark:text-white">{formData.description}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Contact Method</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formData.contactPreference.charAt(0).toUpperCase() + formData.contactPreference.slice(1)}
          </span>
        </div>
        {formData.attachments.length > 0 && (
          <div>
            <span className="text-gray-600 dark:text-gray-400 block mb-2">Attachments</span>
            <span className="text-gray-900 dark:text-white">{formData.attachments.length} file(s)</span>
          </div>
        )}
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              What happens next?
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              We'll review your complaint and respond within 24 hours. For urgent issues, we'll contact you immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Submit a Complaint
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We're here to help resolve your issue
            </p>
          </div>
        </div>
        {isModal && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-4">
        {['category', 'details', 'contact', 'review'].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === stepName
                ? 'bg-[#006699] text-white'
                : index < ['category', 'details', 'contact', 'review'].indexOf(step)
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {index + 1}
            </div>
            {index < 3 && (
              <div className={`w-8 h-1 mx-2 ${
                index < ['category', 'details', 'contact', 'review'].indexOf(step)
                  ? 'bg-green-500'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 'category' && renderCategoryStep()}
      {step === 'details' && renderDetailsStep()}
      {step === 'contact' && renderContactStep()}
      {step === 'review' && renderReviewStep()}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
        <div>
          {step !== 'category' && (
            <Button
              variant="secondary"
              onClick={() => {
                const steps = ['category', 'details', 'contact', 'review'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex - 1] as any);
              }}
              disabled={isLoading}
            >
              Back
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          {step === 'review' ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Complaint</span>
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                const steps = ['category', 'details', 'contact', 'review'];
                const currentIndex = steps.indexOf(step);
                setStep(steps[currentIndex + 1] as any);
              }}
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default ComplaintForm;
