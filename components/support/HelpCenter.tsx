'use client';

import React, { useState } from 'react';
import { 
  Search, ChevronDown, ChevronUp, HelpCircle, 
  BookOpen, MessageSquare, Phone, Mail,
  Calendar, CreditCard, Home, User, Shield
} from 'lucide-react';
import { FAQ, SupportCategory } from '@/lib/types/support';
import Button from '../ui/Button';

interface HelpCenterProps {
  onContactSupport?: () => void;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onContactSupport }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SupportCategory | 'all'>('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      category: 'booking_issue',
      question: 'How do I make a reservation?',
      answer: 'To make a reservation, search for properties using our filters, select your dates and number of guests, then click "Reserve" on the property page. You\'ll be guided through the booking process.',
      tags: ['booking', 'reservation', 'how-to'],
      helpful: 45,
      notHelpful: 3,
      lastUpdated: '2024-01-10T00:00:00Z'
    },
    {
      id: 'faq-2',
      category: 'booking_issue',
      question: 'Can I modify my booking after confirmation?',
      answer: 'Yes, you can modify your booking up to 24 hours before check-in. Changes are subject to host approval and may incur additional fees. Contact support for assistance with modifications.',
      tags: ['booking', 'modification', 'changes'],
      helpful: 32,
      notHelpful: 5,
      lastUpdated: '2024-01-08T00:00:00Z'
    },
    {
      id: 'faq-3',
      category: 'payment_problem',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Google Pay. All payments are processed securely through Stripe.',
      tags: ['payment', 'credit-card', 'stripe'],
      helpful: 67,
      notHelpful: 2,
      lastUpdated: '2024-01-12T00:00:00Z'
    },
    {
      id: 'faq-4',
      category: 'payment_problem',
      question: 'When will I be charged for my booking?',
      answer: 'Payment is charged immediately when you confirm your booking. For some properties, you may pay a deposit upfront and the remainder closer to your stay.',
      tags: ['payment', 'charging', 'deposit'],
      helpful: 54,
      notHelpful: 4,
      lastUpdated: '2024-01-09T00:00:00Z'
    },
    {
      id: 'faq-5',
      category: 'cancellation',
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary by property and are set by the host. You can find the specific policy for each property on its listing page. Generally, cancellations made 24+ hours in advance receive full refunds.',
      tags: ['cancellation', 'refund', 'policy'],
      helpful: 89,
      notHelpful: 7,
      lastUpdated: '2024-01-11T00:00:00Z'
    },
    {
      id: 'faq-6',
      category: 'cancellation',
      question: 'How do I cancel my booking?',
      answer: 'To cancel your booking, go to your bookings page, find the reservation you want to cancel, and click "Cancel Booking". Follow the prompts to complete the cancellation.',
      tags: ['cancellation', 'how-to', 'booking'],
      helpful: 43,
      notHelpful: 6,
      lastUpdated: '2024-01-07T00:00:00Z'
    },
    {
      id: 'faq-7',
      category: 'property_complaint',
      question: 'What if the property doesn\'t match the listing?',
      answer: 'If the property significantly differs from its listing, contact our support team immediately. We\'ll investigate and work with you to resolve the issue, which may include rebooking or refunds.',
      tags: ['property', 'listing', 'complaint'],
      helpful: 38,
      notHelpful: 2,
      lastUpdated: '2024-01-13T00:00:00Z'
    },
    {
      id: 'faq-8',
      category: 'account_issue',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the email we send you. You\'ll receive a secure link to reset your password.',
      tags: ['password', 'reset', 'account'],
      helpful: 76,
      notHelpful: 3,
      lastUpdated: '2024-01-06T00:00:00Z'
    },
    {
      id: 'faq-9',
      category: 'technical_support',
      question: 'The website isn\'t loading properly. What should I do?',
      answer: 'Try refreshing the page or clearing your browser cache. If the problem persists, try using a different browser or device. Contact our technical support if issues continue.',
      tags: ['technical', 'website', 'browser'],
      helpful: 29,
      notHelpful: 8,
      lastUpdated: '2024-01-14T00:00:00Z'
    },
    {
      id: 'faq-10',
      category: 'safety_concern',
      question: 'How do I report a safety issue?',
      answer: 'Safety is our top priority. If you encounter a safety issue, contact our emergency support line immediately at +971 4 123 4567 or use the emergency contact feature in the app.',
      tags: ['safety', 'emergency', 'report'],
      helpful: 52,
      notHelpful: 1,
      lastUpdated: '2024-01-15T00:00:00Z'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Topics', icon: BookOpen },
    { value: 'booking_issue', label: 'Booking Issues', icon: Calendar },
    { value: 'payment_problem', label: 'Payment Problems', icon: CreditCard },
    { value: 'property_complaint', label: 'Property Complaints', icon: Home },
    { value: 'host_issue', label: 'Host Issues', icon: User },
    { value: 'cancellation', label: 'Cancellations', icon: Calendar },
    { value: 'refund_request', label: 'Refund Requests', icon: CreditCard },
    { value: 'technical_support', label: 'Technical Support', icon: Shield },
    { value: 'account_issue', label: 'Account Issues', icon: User },
    { value: 'safety_concern', label: 'Safety Concerns', icon: Shield }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-[#006699]/10 rounded-full">
              <HelpCircle className="h-12 w-12 text-[#006699]" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Find answers to common questions and get the help you need
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value as SupportCategory | 'all')}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'border-[#006699] bg-[#006699]/5 dark:bg-[#006699]/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <category.icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    {category.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={onContactSupport}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Support</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open('tel:+97141234567')}
                className="flex items-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Call Us</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.open('mailto:support@bnb.com')}
                className="flex items-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Email Us</span>
              </Button>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search terms or browse by category.
              </p>
              <Button
                variant="primary"
                onClick={onContactSupport}
                className="flex items-center space-x-2 mx-auto"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Contact Support</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-white pr-4">
                        {faq.question}
                      </h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                  
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="pt-4">
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {faq.answer}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-green-600 dark:hover:text-green-400">
                              <span>Was this helpful?</span>
                              <span className="text-green-600 dark:text-green-400">
                                {faq.helpful} Yes
                              </span>
                            </button>
                            <button className="text-sm text-gray-500 hover:text-red-600 dark:hover:text-red-400">
                              {faq.notHelpful} No
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {faq.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-[#006699] to-[#0088cc] rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-blue-100 mb-6">
              Our support team is ready to help you with any questions or issues.
            </p>
            <Button
              variant="secondary"
              onClick={onContactSupport}
              className="bg-white text-[#006699] hover:bg-gray-50 flex items-center space-x-2 mx-auto"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Get Support</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
