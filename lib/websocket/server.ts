import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
}

interface MessageData {
  conversationId: string;
  content: string;
  messageType?: 'text' | 'image' | 'file';
  metadata?: any;
}

interface TypingData {
  conversationId: string;
  isTyping: boolean;
}

class WebSocketServer {
  private io: SocketIOServer;
  private connectedUsers: Map<string, string> = new Map(); // userId -> socketId

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  private setupMiddleware() {
    // Authentication middleware
    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        (socket as any).userId = decoded.userId;
        (socket as any).user = {
          id: decoded.userId,
          firstName: decoded.firstName || 'User',
          lastName: decoded.lastName || '',
          profilePicture: decoded.profilePicture
        };
        next();
      } catch (err) {
        next(new Error('Invalid authentication token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: Socket) => {
      const authSocket = socket as AuthenticatedSocket;
      console.log(`User ${authSocket.user?.firstName || 'Unknown'} (${authSocket.userId || 'unknown'}) connected`);
      
      // Store user connection
      this.connectedUsers.set(authSocket.userId, socket.id);
      
      // Join user to their personal room
      socket.join(`user_${authSocket.userId}`);
      
      // Handle new message
      socket.on('sendMessage', async (data: MessageData) => {
        try {
          await this.handleNewMessage(authSocket, data);
        } catch (error) {
          console.error('Error handling new message:', error);
          socket.emit('error', { message: 'Failed to send message' });
        }
      });

      // Handle typing indicator
      socket.on('typing', (data: TypingData) => {
        this.handleTypingIndicator(authSocket, data);
      });

      // Handle message read
      socket.on('markAsRead', async (data: { messageId: string }) => {
        try {
          await this.handleMessageRead(authSocket, data.messageId);
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
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
        this.connectedUsers.delete(authSocket.userId);
      });
    });
  }

  private async handleNewMessage(socket: AuthenticatedSocket, data: MessageData) {
    // In a real app, you would:
    // 1. Validate the message data
    // 2. Check if user has access to this conversation
    // 3. Save message to database
    // 4. Get conversation participants
    // 5. Send real-time updates

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
        firstName: socket.user.firstName,
        lastName: socket.user.lastName,
        profilePicture: socket.user.profilePicture
      }
    };

    // Broadcast to all participants in the conversation
    this.io.to(`conversation_${data.conversationId}`).emit('newMessage', {
      type: 'newMessage',
      message
    });

    // Also send to individual user rooms for offline users
    // In a real app, you would get participants from database
    const participants = ['user-1', 'user-2']; // Mock participants
    participants.forEach(participantId => {
      if (participantId !== socket.userId) {
        this.io.to(`user_${participantId}`).emit('messageNotification', {
          type: 'newMessage',
          conversationId: data.conversationId,
          message
        });
      }
    });
  }

  private handleTypingIndicator(socket: AuthenticatedSocket, data: TypingData) {
    // Broadcast typing indicator to other participants
    socket.to(`conversation_${data.conversationId}`).emit('typing', {
      type: 'typing',
      conversationId: data.conversationId,
      userId: socket.userId,
      userName: `${socket.user.firstName} ${socket.user.lastName}`,
      isTyping: data.isTyping,
      timestamp: new Date().toISOString()
    });
  }

  private async handleMessageRead(socket: AuthenticatedSocket, messageId: string) {
    // In a real app, you would:
    // 1. Update message read status in database
    // 2. Get message sender
    // 3. Notify sender that message was read

    // Mock implementation
    console.log(`Message ${messageId} marked as read by user ${socket.userId}`);

    // Notify sender (in real app, get sender from database)
    const senderId = 'user-2'; // Mock sender
    this.io.to(`user_${senderId}`).emit('messageRead', {
      type: 'messageRead',
      messageId,
      readBy: socket.userId,
      readAt: new Date().toISOString()
    });
  }

  // Method to send notification to specific user
  public sendToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Method to send to conversation participants
  public sendToConversation(conversationId: string, event: string, data: any) {
    this.io.to(`conversation_${conversationId}`).emit(event, data);
  }

  // Get connected users count
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }
}

export default WebSocketServer;
