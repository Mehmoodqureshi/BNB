#!/usr/bin/env node

// Simple WebSocket server for development
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;

// Create HTTP server
const httpServer = http.createServer();

// Create Socket.io server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Mock JWT secret for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key';

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    // For development, allow connection with mock user
    socket.userId = 'user-1';
    socket.user = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    };
    return next();
  }

  try {
    // In a real app, you would verify the JWT token here
    socket.userId = 'user-1'; // Mock user ID
    socket.user = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    };
    next();
  } catch (err) {
    // For development, allow connection with mock user
    socket.userId = 'user-1';
    socket.user = {
      id: 'user-1',
      firstName: 'John',
      lastName: 'Doe',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    };
    next();
  }
});

// Handle connections
io.on('connection', (socket) => {
  console.log(`User ${socket.user?.firstName || 'Unknown'} (${socket.userId || 'unknown'}) connected`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Handle new message
  socket.on('sendMessage', async (data) => {
    try {
      console.log('Received message:', data);
      
      // Mock message creation
      const message = {
        id: `msg-${Date.now()}`,
        conversationId: data.conversationId,
        senderId: socket.userId,
        content: data.content,
        messageType: data.messageType || 'text',
        createdAt: new Date().toISOString(),
        metadata: data.metadata || {},
        sender: {
          id: socket.userId,
          firstName: socket.user?.firstName || 'User',
          lastName: socket.user?.lastName || '',
          profilePicture: socket.user?.profilePicture
        }
      };

      // Send message back to sender (for immediate UI update)
      socket.emit('newMessage', {
        type: 'newMessage',
        message
      });

      // Broadcast to all participants in the conversation
      socket.to(`conversation_${data.conversationId}`).emit('newMessage', {
        type: 'newMessage',
        message
      });

      // Also send to individual user rooms for offline users
      const participants = ['user-1', 'user-2']; // Mock participants
      participants.forEach(participantId => {
        if (participantId !== socket.userId) {
          socket.to(`user_${participantId}`).emit('messageNotification', {
            type: 'newMessage',
            conversationId: data.conversationId,
            message
          });
        }
      });
    } catch (error) {
      console.error('Error handling new message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    socket.to(`conversation_${data.conversationId}`).emit('typing', {
      type: 'typing',
      conversationId: data.conversationId,
      userId: socket.userId,
      userName: `${socket.user?.firstName || 'User'} ${socket.user?.lastName || ''}`,
      isTyping: data.isTyping,
      timestamp: new Date().toISOString()
    });
  });

  // Handle conversation join
  socket.on('joinConversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`User ${socket.userId} joined conversation ${conversationId}`);
  });

  // Handle conversation leave
  socket.on('leaveConversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`User ${socket.userId} left conversation ${conversationId}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down WebSocket server...');
  httpServer.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down WebSocket server...');
  httpServer.close(() => {
    console.log('WebSocket server closed');
    process.exit(0);
  });
});
