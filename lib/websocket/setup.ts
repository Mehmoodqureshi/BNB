// WebSocket server setup for development
// This file helps set up a simple WebSocket server for real-time messaging

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

// Mock JWT secret for development
const JWT_SECRET = process.env.JWT_SECRET || 'your-development-secret-key';

interface AuthenticatedSocket extends Socket {
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

export function setupWebSocketServer(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (socket as any).userId = decoded.userId || 'user-1'; // Fallback for development
      (socket as any).user = {
        id: (socket as any).userId,
        firstName: decoded.firstName || 'User',
        lastName: decoded.lastName || '',
        profilePicture: decoded.profilePicture
      };
      next();
    } catch (err) {
      // For development, allow connection with mock user
      (socket as any).userId = 'user-1';
      (socket as any).user = {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      };
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    console.log(`User ${authSocket.user?.firstName || 'Unknown'} (${authSocket.userId || 'unknown'}) connected`);
    
    // Join user to their personal room
    socket.join(`user_${authSocket.userId}`);
    
    // Handle new message
    socket.on('sendMessage', async (data) => {
      try {
        console.log('Received message:', data);
        
        // Mock message creation
        const message = {
          id: `msg-${Date.now()}`,
          conversationId: data.conversationId,
          senderId: authSocket.userId,
          content: data.content,
          messageType: data.messageType || 'text',
          createdAt: new Date().toISOString(),
          metadata: data.metadata || {},
          sender: {
            id: authSocket.userId,
            firstName: authSocket.user?.firstName || 'User',
            lastName: authSocket.user?.lastName || '',
            profilePicture: authSocket.user?.profilePicture
          }
        };

        // Broadcast to all participants in the conversation
        socket.to(`conversation_${data.conversationId}`).emit('newMessage', {
          type: 'newMessage',
          message
        });

        // Also send to individual user rooms for offline users
        const participants = ['user-1', 'user-2']; // Mock participants
        participants.forEach(participantId => {
          if (participantId !== authSocket.userId) {
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
        userId: authSocket.userId,
        userName: `${authSocket.user?.firstName || 'User'} ${authSocket.user?.lastName || ''}`,
        isTyping: data.isTyping,
        timestamp: new Date().toISOString()
      });
    });

    // Handle conversation join
    socket.on('joinConversation', (conversationId: string) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`User ${authSocket.userId} joined conversation ${conversationId}`);
    });

    // Handle conversation leave
    socket.on('leaveConversation', (conversationId: string) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`User ${authSocket.userId} left conversation ${conversationId}`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User ${authSocket.userId} disconnected`);
    });
  });

  return io;
}

// Development helper to create a simple HTTP server with WebSocket
export function createDevelopmentServer(port: number = 3001) {
  const http = require('http');
  const httpServer = http.createServer();
  
  const io = setupWebSocketServer(httpServer);
  
  httpServer.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
  });
  
  return { httpServer, io };
}
