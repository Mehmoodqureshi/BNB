export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'file' | 'system';
  createdAt: string;
  readAt?: string;
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
  };
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export interface Conversation {
  id: string;
  propertyId: string;
  guestId: string;
  hostId: string;
  status: 'active' | 'archived' | 'blocked';
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    image: string;
    price: number;
    currency: string;
    location: string;
  };
  participants: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    isOnline: boolean;
    rating: number;
    responseTime: string;
    lastReadAt?: string;
  }[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface CreateConversationRequest {
  propertyId: string;
  hostId: string;
  initialMessage?: string;
}

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file';
  metadata?: any;
}

export interface MessageResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

export interface ConversationResponse {
  success: boolean;
  conversations?: Conversation[];
  conversation?: Conversation;
  error?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface MessageNotification {
  type: 'newMessage' | 'messageRead' | 'typing' | 'conversationUpdated';
  conversationId: string;
  message?: Message;
  typing?: TypingIndicator;
  data?: any;
}
