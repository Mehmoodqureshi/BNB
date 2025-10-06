import { Message, Conversation, SendMessageRequest, CreateConversationRequest } from '@/lib/types/messaging';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class MessageService {
  private static instance: MessageService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  // Socket.io connection for real-time messaging
  connectWebSocket(userId: string, onMessage: (data: any) => void) {
    if (this.socket?.connected) {
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.reconnectAttempts = 0;
    });

    this.socket.on('newMessage', (data) => {
      console.log('Received newMessage event:', data);
      onMessage(data);
    });

    this.socket.on('messageNotification', (data) => {
      onMessage(data);
    });

    this.socket.on('messageRead', (data) => {
      onMessage(data);
    });

    this.socket.on('typing', (data) => {
      onMessage(data);
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.attemptReconnect(userId, onMessage);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  private attemptReconnect(userId: string, onMessage: (data: any) => void) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      setTimeout(() => {
        console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connectWebSocket(userId, onMessage);
      }, delay);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send message via Socket.io
  sendMessage(messageData: SendMessageRequest) {
    if (this.socket?.connected) {
      console.log('Sending message via socket:', messageData);
      this.socket.emit('sendMessage', messageData);
    } else {
      console.error('Socket not connected');
    }
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string, isTyping: boolean) {
    if (this.socket?.connected) {
      this.socket.emit('typing', {
        conversationId,
        isTyping
      });
    }
  }

  // API calls
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Get all conversations for a user
  async getConversations(): Promise<Conversation[]> {
    const response = await this.makeRequest('/messages/conversations');
    return response.conversations;
  }

  // Get a specific conversation
  async getConversation(conversationId: string): Promise<Conversation> {
    const response = await this.makeRequest(`/messages/conversations/${conversationId}`);
    return response.conversation;
  }

  // Create a new conversation
  async createConversation(data: CreateConversationRequest): Promise<Conversation> {
    const response = await this.makeRequest('/messages/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.conversation;
  }

  // Get messages for a conversation
  async getMessages(conversationId: string, page = 1, limit = 50): Promise<Message[]> {
    const response = await this.makeRequest(
      `/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
    return response.messages;
  }

  // Send a message (REST API fallback)
  async sendMessageAPI(messageData: SendMessageRequest): Promise<Message> {
    const response = await this.makeRequest(
      `/messages/conversations/${messageData.conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify(messageData),
      }
    );
    return response.message;
  }

  // Mark message as read
  async markMessageAsRead(messageId: string): Promise<void> {
    await this.makeRequest(`/messages/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // Mark all messages in conversation as read
  async markConversationAsRead(conversationId: string): Promise<void> {
    await this.makeRequest(`/messages/conversations/${conversationId}/read`, {
      method: 'PUT',
    });
  }

  // Archive conversation
  async archiveConversation(conversationId: string): Promise<void> {
    await this.makeRequest(`/messages/conversations/${conversationId}/archive`, {
      method: 'PUT',
    });
  }

  // Upload file for message
  async uploadFile(file: File, conversationId: string): Promise<{ url: string; metadata: any }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('conversationId', conversationId);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_BASE_URL}/messages/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'File upload failed');
    }

    return response.json();
  }

  // Search conversations
  async searchConversations(query: string): Promise<Conversation[]> {
    const response = await this.makeRequest(`/messages/conversations/search?q=${encodeURIComponent(query)}`);
    return response.conversations;
  }

  // Get unread count for user
  async getUnreadCount(): Promise<number> {
    const response = await this.makeRequest('/messages/unread-count');
    return response.count;
  }
}

export default MessageService;
