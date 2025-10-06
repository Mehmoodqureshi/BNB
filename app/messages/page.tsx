'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  MessageCircle, Search, Send, Paperclip, Smile, 
  ChevronLeft, MoreVertical, Phone, Video, Star,
  Clock, Check, CheckCheck, Image as ImageIcon, FileText, Loader2
} from 'lucide-react';
import MessageService from '@/lib/services/messageService';
import { Message, Conversation, TypingIndicator } from '@/lib/types/messaging';

const MessagesPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageService = MessageService.getInstance();

  const loadConversations = async () => {
    try {
      const data = await messageService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleRealtimeMessage = (data: any) => {
    console.log('Received real-time message in messages page:', data);
    
    switch (data.type) {
      case 'newMessage':
        console.log('Adding new message to UI:', data.message);
        setMessages(prev => {
          const newMessages = [...prev, data.message];
          console.log('Updated messages array:', newMessages);
          return newMessages;
        });
        // Update conversation list
        setConversations(prev => 
          prev.map(conv => 
            conv.id === data.message.conversationId 
              ? { ...conv, lastMessage: data.message, updatedAt: new Date().toISOString() }
              : conv
          )
        );
        break;
      case 'messageRead':
        setMessages(prev => 
          prev.map(msg => 
            msg.id === data.messageId 
              ? { ...msg, readAt: data.readAt }
              : msg
          )
        );
        break;
      case 'typing':
        if (data.isTyping) {
          setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
        } else {
          setTypingUsers(prev => prev.filter(id => id !== data.userId));
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
    }
  }, [isAuthenticated, user]);

  // Set up WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      messageService.connectWebSocket(user.id, handleRealtimeMessage);
    }

    return () => {
      messageService.disconnect();
    };
  }, [isAuthenticated, user]);

  // Load messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#006699] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your messages...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/test-auth');
    return null;
  }

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
    const participantName = otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : '';
    
    return (
      participantName.toLowerCase().includes(searchLower) ||
      conversation.property?.title.toLowerCase().includes(searchLower) ||
      conversation.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  const sendMessage = async () => {
    if (!newMessage.trim() || isSendingMessage) return;

    if (!selectedConversation) {
      console.log('No conversation selected, using default conversation');
      // Use a default conversation for testing
      const defaultConversationId = 'conv-1';
      setIsSendingMessage(true);
      try {
        console.log('Sending message to default conversation:', defaultConversationId);
        await messageService.sendMessage({
          conversationId: defaultConversationId,
          content: newMessage.trim(),
          messageType: 'text'
        });
        setNewMessage('');
        console.log('Message sent successfully to default conversation');
      } catch (error) {
        console.error('Failed to send message:', error);
      } finally {
        setIsSendingMessage(false);
      }
      return;
    }

    setIsSendingMessage(true);
    try {
      console.log('Sending message to conversation:', selectedConversation.id);
      await messageService.sendMessage({
        conversationId: selectedConversation.id,
        content: newMessage.trim(),
        messageType: 'text'
      });
      setNewMessage('');
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!selectedConversation) return;

    try {
      const { url, metadata } = await messageService.uploadFile(file, selectedConversation.id);
      
      await messageService.sendMessage({
        conversationId: selectedConversation.id,
        content: file.type.startsWith('image/') ? '📷 Image' : '📎 File',
        messageType: file.type.startsWith('image/') ? 'image' : 'file',
        metadata: {
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl: url,
          ...metadata
        }
      });
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (selectedConversation) {
      messageService.sendTypingIndicator(selectedConversation.id, isTyping);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId);
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-xl border-b border-white/20 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="h-6 w-6 text-[#006699] mr-2" />
                  Messages
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Chat with hosts and guests</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
              </div>
              <div className="overflow-y-auto">
                {filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
                  return (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedConversation?.id === conversation.id ? 'bg-[#006699]/10 dark:bg-[#006699]/20' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <img
                            src={otherParticipant?.profilePicture || '/default-avatar.png'}
                            alt={otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'User'}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {otherParticipant?.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown User'}
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {conversation.lastMessage ? formatTime(conversation.lastMessage.createdAt) : ''}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                            {conversation.property?.title || 'Property'}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className={`text-sm truncate ${
                              conversation.lastMessage?.senderId !== user?.id
                                ? 'text-gray-600 dark:text-gray-400' 
                                : 'text-[#006699] dark:text-[#00aaff] font-medium'
                            }`}>
                              {conversation.lastMessage?.content || 'No messages yet'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-[#006699] text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedConversation.participants.find(p => p.id !== user?.id)?.profilePicture || '/default-avatar.png'}
                          alt={selectedConversation.participants.find(p => p.id !== user?.id)?.firstName || 'User'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {selectedConversation.participants.find(p => p.id !== user?.id)?.firstName} {selectedConversation.participants.find(p => p.id !== user?.id)?.lastName}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span>{selectedConversation.participants.find(p => p.id !== user?.id)?.rating}</span>
                            <span>•</span>
                            <span>{selectedConversation.participants.find(p => p.id !== user?.id)?.responseTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <Video className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoadingMessages ? (
                      <div className="flex justify-center items-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-[#006699]" />
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => {
                          const isFromCurrentUser = message.senderId === user?.id;
                          return (
                            <div
                              key={message.id}
                              className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isFromCurrentUser
                                  ? 'bg-[#006699] text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                              }`}>
                                {message.messageType === 'image' && message.metadata?.fileUrl ? (
                                  <div className="mb-2">
                                    <img
                                      src={message.metadata.fileUrl}
                                      alt="Shared image"
                                      className="max-w-full h-auto rounded-lg"
                                    />
                                  </div>
                                ) : message.messageType === 'file' && message.metadata?.fileUrl ? (
                                  <div className="flex items-center space-x-2 mb-2 p-2 bg-white/10 rounded">
                                    <FileText className="h-4 w-4" />
                                    <span className="text-sm truncate">{message.metadata.fileName}</span>
                                  </div>
                                ) : null}
                                
                                <p className="text-sm">{message.content}</p>
                                <div className={`flex items-center justify-end mt-1 space-x-1 ${
                                  isFromCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                  <span className="text-xs">{formatTime(message.createdAt)}</span>
                                  {isFromCurrentUser && (
                                    <div className="flex items-center space-x-1">
                                      {message.readAt ? (
                                        <CheckCheck className="h-3 w-3 text-blue-400" />
                                      ) : (
                                        <Check className="h-3 w-3" />
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Typing indicator */}
                        {typingUsers.length > 0 && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg">
                              <div className="flex items-center space-x-1">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                  {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <label className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                        <Paperclip className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <input
                          type="file"
                          accept="image/*,application/pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => {
                            setNewMessage(e.target.value);
                            handleTyping(true);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendMessage();
                            }
                          }}
                          onBlur={() => handleTyping(false)}
                          placeholder={selectedConversation ? "Type a message..." : "Type a message (will send to default conversation)..."}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors">
                          <Smile className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isSendingMessage}
                        className="p-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isSendingMessage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Choose a conversation from the list to start chatting
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Or type a message below to send to the default conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
