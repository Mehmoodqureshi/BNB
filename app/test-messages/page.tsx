'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import MessageService from '@/lib/services/messageService';
import { Conversation, Message } from '@/lib/types/messaging';

const TestMessagesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageService = MessageService.getInstance();

  useEffect(() => {
    if (isAuthenticated && user) {
      loadConversations();
      // Set up WebSocket connection
      messageService.connectWebSocket(user.id, handleRealtimeMessage);
    }

    return () => {
      messageService.disconnect();
    };
  }, [isAuthenticated, user]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const data = await messageService.getConversations();
      setConversations(data);
      console.log('Loaded conversations:', data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const data = await messageService.getMessages(conversationId);
      setMessages(data);
      console.log('Loaded messages:', data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleRealtimeMessage = (data: any) => {
    console.log('Received real-time message:', data);
    
    switch (data.type) {
      case 'newMessage':
        console.log('Adding new message to UI:', data.message);
        setMessages(prev => {
          const newMessages = [...prev, data.message];
          console.log('Updated messages array:', newMessages);
          return newMessages;
        });
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
      default:
        console.log('Unknown message type:', data.type);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      console.log('No message to send');
      return;
    }
    
    if (!selectedConversation) {
      console.log('No conversation selected, using default conversation');
      // Use a default conversation for testing
      const defaultConversationId = 'conv-1';
      try {
        await messageService.sendMessage({
          conversationId: defaultConversationId,
          content: newMessage.trim(),
          messageType: 'text'
        });
        setNewMessage('');
        console.log('Message sent successfully to default conversation');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
      return;
    }

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
    }
  };

  const testFileUpload = async () => {
    if (!selectedConversation) return;

    // Create a test file
    const testContent = 'This is a test file content';
    const file = new File([testContent], 'test.txt', { type: 'text/plain' });

    try {
      const { url, metadata } = await messageService.uploadFile(file, selectedConversation.id);
      console.log('File uploaded:', { url, metadata });
      
      await messageService.sendMessage({
        conversationId: selectedConversation.id,
        content: '📎 Test file',
        messageType: 'file',
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to test messaging
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Go to <a href="/test-auth" className="text-[#006699] hover:underline">/test-auth</a> to log in
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Messaging System Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Test the real-time messaging functionality
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Conversations */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Conversations ({conversations.length})
                </h2>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006699] mx-auto"></div>
                    </div>
                  ) : (
                    conversations.map((conversation) => {
                      const otherParticipant = conversation.participants.find(p => p.id !== user?.id);
                      return (
                        <div
                          key={conversation.id}
                          onClick={() => {
                            setSelectedConversation(conversation);
                            loadMessages(conversation.id);
                          }}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedConversation?.id === conversation.id
                              ? 'border-[#006699] bg-[#006699]/10'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {otherParticipant?.firstName?.[0] || 'U'}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : 'Unknown User'}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {conversation.property?.title || 'Property'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="inline-block bg-[#006699] text-white text-xs rounded-full px-2 py-1 mt-1">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Messages */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Messages {selectedConversation && `(${messages.length})`}
                </h2>

                {selectedConversation ? (
                  <div className="space-y-4">
                    <div className="h-64 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                      {messages.map((message) => {
                        const isFromCurrentUser = message.senderId === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={`mb-3 ${isFromCurrentUser ? 'text-right' : 'text-left'}`}
                          >
                            <div
                              className={`inline-block max-w-xs px-3 py-2 rounded-lg text-sm ${
                                isFromCurrentUser
                                  ? 'bg-[#006699] text-white'
                                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                isFromCurrentUser ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={!newMessage.trim()}
                          className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Send
                        </button>
                      </div>
                      
                      <button
                        onClick={testFileUpload}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                      >
                        Test File Upload
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <p className="text-gray-500 dark:text-gray-400">
                      Select a conversation to view messages
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Debug Info */}
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Debug Information
              </h3>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p>User ID: {user?.id}</p>
                <p>Conversations loaded: {conversations.length}</p>
                <p>Messages loaded: {messages.length}</p>
                <p>Selected conversation: {selectedConversation?.id || 'None'}</p>
                <p>WebSocket status: {messageService ? 'Connected' : 'Disconnected'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestMessagesPage;
