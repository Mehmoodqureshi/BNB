'use client';

import React from 'react';
import { 
  MessageSquare, Clock, CheckCircle, AlertTriangle, 
  User, Calendar, FileText, Eye, ArrowRight,
  Phone, Mail, Shield, Home, CreditCard
} from 'lucide-react';
import { SupportTicket, SupportCategory, SupportPriority, TicketStatus } from '@/lib/types/support';
import Button from '../ui/Button';

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onViewDetails: (ticketId: string) => void;
  onReply?: (ticketId: string) => void;
  showActions?: boolean;
}

const SupportTicketCard: React.FC<SupportTicketCardProps> = ({
  ticket,
  onViewDetails,
  onReply,
  showActions = true
}) => {
  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'waiting_for_user':
        return <User className="h-4 w-4 text-yellow-500" />;
      case 'waiting_for_agent':
        return <Clock className="h-4 w-4 text-purple-500" />;
      case 'escalated':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'waiting_for_user':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'waiting_for_agent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'escalated':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: SupportPriority) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: SupportCategory) => {
    switch (category) {
      case 'booking_issue':
        return <Calendar className="h-4 w-4" />;
      case 'payment_problem':
        return <CreditCard className="h-4 w-4" />;
      case 'property_complaint':
        return <Home className="h-4 w-4" />;
      case 'host_issue':
        return <User className="h-4 w-4" />;
      case 'cancellation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'refund_request':
        return <CreditCard className="h-4 w-4" />;
      case 'technical_support':
        return <Shield className="h-4 w-4" />;
      case 'account_issue':
        return <User className="h-4 w-4" />;
      case 'safety_concern':
        return <Shield className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: SupportCategory) => {
    switch (category) {
      case 'booking_issue':
        return 'Booking Issue';
      case 'payment_problem':
        return 'Payment Problem';
      case 'property_complaint':
        return 'Property Complaint';
      case 'host_issue':
        return 'Host Issue';
      case 'cancellation':
        return 'Cancellation';
      case 'refund_request':
        return 'Refund Request';
      case 'technical_support':
        return 'Technical Support';
      case 'account_issue':
        return 'Account Issue';
      case 'safety_concern':
        return 'Safety Concern';
      default:
        return 'Other';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  const getLastMessageInfo = () => {
    if (ticket.messages.length === 0) return null;
    
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    return {
      content: lastMessage.content,
      sender: lastMessage.senderName,
      senderType: lastMessage.senderType,
      time: lastMessage.createdAt
    };
  };

  const lastMessage = getLastMessageInfo();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getCategoryIcon(ticket.category)}
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {ticket.title}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                #{ticket.ticketNumber}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {getCategoryLabel(ticket.category)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {getTimeAgo(ticket.createdAt)}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {getStatusIcon(ticket.status)}
              <span className="ml-1 capitalize">{ticket.status.replace('_', ' ')}</span>
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {ticket.description.length > 150 
            ? `${ticket.description.substring(0, 150)}...` 
            : ticket.description
          }
        </p>
      </div>

      {/* Last Message */}
      {lastMessage && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                lastMessage.senderType === 'user' 
                  ? 'bg-blue-500' 
                  : 'bg-green-500'
              }`} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {lastMessage.senderType === 'user' ? 'You' : 'Support Team'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getTimeAgo(lastMessage.time)}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {lastMessage.content.length > 100 
              ? `${lastMessage.content.substring(0, 100)}...` 
              : lastMessage.content
            }
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <MessageSquare className="h-4 w-4" />
            <span>{ticket.messages.length} messages</span>
          </div>
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{ticket.attachments.length} files</span>
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Created: {formatDate(ticket.createdAt)}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onViewDetails(ticket.id)}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>View Details</span>
            </Button>
            
            {ticket.status !== 'resolved' && ticket.status !== 'closed' && onReply && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => onReply(ticket.id)}
                className="flex items-center space-x-2"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Reply</span>
              </Button>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketCard;
