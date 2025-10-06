export interface SupportTicket {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: SupportCategory;
  priority: SupportPriority;
  status: TicketStatus;
  userId: string;
  userEmail: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  attachments?: TicketAttachment[];
  messages: TicketMessage[];
  metadata?: Record<string, any>;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent' | 'system';
  content: string;
  attachments?: TicketAttachment[];
  isInternal: boolean;
  createdAt: string;
  readAt?: string;
}

export interface TicketAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  uploadedAt: string;
}

export type SupportCategory = 
  | 'booking_issue'
  | 'payment_problem'
  | 'property_complaint'
  | 'host_issue'
  | 'cancellation'
  | 'refund_request'
  | 'technical_support'
  | 'account_issue'
  | 'safety_concern'
  | 'other';

export type SupportPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TicketStatus = 
  | 'open'
  | 'in_progress'
  | 'waiting_for_user'
  | 'waiting_for_agent'
  | 'resolved'
  | 'closed'
  | 'escalated';

export interface ComplaintFormData {
  category: SupportCategory;
  priority: SupportPriority;
  title: string;
  description: string;
  relatedBookingId?: string;
  relatedTransactionId?: string;
  attachments: File[];
  contactPreference: 'email' | 'phone' | 'both';
  phoneNumber?: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  department: 'general' | 'technical' | 'billing' | 'safety';
  isOnline: boolean;
  responseTime: string;
  rating: number;
  totalTicketsResolved: number;
}

export interface FAQ {
  id: string;
  category: SupportCategory;
  question: string;
  answer: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
  lastUpdated: string;
}

export interface SupportArticle {
  id: string;
  title: string;
  content: string;
  category: SupportCategory;
  tags: string[];
  isPublished: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface LiveChat {
  id: string;
  userId: string;
  agentId?: string;
  status: 'waiting' | 'active' | 'ended';
  messages: ChatMessage[];
  startedAt: string;
  endedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderType: 'user' | 'agent';
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface SupportStats {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  averageResponseTime: string;
  customerSatisfaction: number;
  topCategories: {
    category: SupportCategory;
    count: number;
  }[];
}

export interface EscalationRule {
  id: string;
  name: string;
  conditions: {
    category?: SupportCategory;
    priority?: SupportPriority;
    responseTimeExceeded?: number; // minutes
    keywordMatch?: string[];
  };
  actions: {
    assignTo?: string;
    notify?: string[];
    autoResponse?: string;
    priority?: SupportPriority;
  };
}

export interface SupportNotification {
  id: string;
  userId: string;
  type: 'ticket_update' | 'agent_response' | 'resolution' | 'escalation';
  title: string;
  message: string;
  ticketId?: string;
  isRead: boolean;
  createdAt: string;
}
