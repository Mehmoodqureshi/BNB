'use client';

import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const TestWebSocketPage: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('');

  useEffect(() => {
    // Create Socket.io connection
    const newSocket = io('http://localhost:3001', {
      auth: {
        token: 'test-token'
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
      setMessages(prev => [...prev, '✅ Connected to WebSocket server']);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
      setMessages(prev => [...prev, '❌ Disconnected from WebSocket server']);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setMessages(prev => [...prev, `❌ Connection error: ${error.message}`]);
    });

    newSocket.on('newMessage', (data) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, `📨 Received: ${JSON.stringify(data)}`]);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setMessages(prev => [...prev, `❌ Socket error: ${JSON.stringify(data)}`]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const sendTestMessage = () => {
    if (socket && isConnected) {
      socket.emit('sendMessage', {
        conversationId: 'test-conversation',
        content: testMessage,
        messageType: 'text'
      });
      setMessages(prev => [...prev, `📤 Sent: ${testMessage}`]);
      setTestMessage('');
    }
  };

  const sendTypingIndicator = (isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', {
        conversationId: 'test-conversation',
        isTyping
      });
      setMessages(prev => [...prev, `⌨️ Typing: ${isTyping ? 'started' : 'stopped'}`]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              WebSocket Connection Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Test the real-time WebSocket connection
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Connection Status */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Connection Status
                </h2>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    isConnected 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`font-medium ${
                        isConnected ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                      }`}>
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${
                      isConnected ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isConnected 
                        ? 'WebSocket server is connected and ready' 
                        : 'WebSocket server is not connected'
                      }
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Server Info</h3>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p>Server URL: http://localhost:3001</p>
                      <p>Transport: WebSocket + Polling</p>
                      <p>Status: {socket?.connected ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Controls */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Test Controls
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Test Message
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={testMessage}
                        onChange={(e) => setTestMessage(e.target.value)}
                        placeholder="Type a test message..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#006699] focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                      <button
                        onClick={sendTestMessage}
                        disabled={!isConnected || !testMessage.trim()}
                        className="px-4 py-2 bg-[#006699] text-white rounded-lg hover:bg-[#005588] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Send
                      </button>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => sendTypingIndicator(true)}
                      disabled={!isConnected}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start Typing
                    </button>
                    <button
                      onClick={() => sendTypingIndicator(false)}
                      disabled={!isConnected}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Stop Typing
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Log */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Message Log
              </h2>
              <div className="h-64 border border-gray-200 dark:border-gray-700 rounded-lg p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                {messages.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No messages yet. Try connecting or sending a test message.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className="text-sm font-mono text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 p-2 rounded border"
                      >
                        {message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-medium text-blue-900 dark:text-blue-200 mb-2">
                Instructions
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                <li>1. Make sure the WebSocket server is running: <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">npm run websocket</code></li>
                <li>2. Check the connection status above</li>
                <li>3. Send a test message to verify real-time communication</li>
                <li>4. Check the message log for responses</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestWebSocketPage;
