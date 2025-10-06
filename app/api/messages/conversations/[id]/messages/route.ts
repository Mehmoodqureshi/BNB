import { NextRequest, NextResponse } from 'next/server';
import { Message } from '@/lib/types/messaging';

// Mock messages data
const mockMessages: { [conversationId: string]: Message[] } = {
  'conv-1': [
    {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Hi! I\'m interested in your apartment for next weekend.',
      messageType: 'text',
      createdAt: '2024-01-20T09:00:00Z',
      readAt: '2024-01-20T09:15:00Z',
      sender: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 'msg-2',
      conversationId: 'conv-1',
      senderId: 'user-2',
      content: 'Hello! Thank you for your interest. The apartment is available for your dates. Would you like to know more about the amenities?',
      messageType: 'text',
      createdAt: '2024-01-20T09:15:00Z',
      readAt: '2024-01-20T09:30:00Z',
      sender: {
        id: 'user-2',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 'msg-3',
      conversationId: 'conv-1',
      senderId: 'user-1',
      content: 'Yes, please! What facilities are available?',
      messageType: 'text',
      createdAt: '2024-01-20T09:30:00Z',
      readAt: '2024-01-20T10:30:00Z',
      sender: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    },
    {
      id: 'msg-4',
      conversationId: 'conv-1',
      senderId: 'user-2',
      content: 'Thank you for your interest! The apartment is available for your dates.',
      messageType: 'text',
      createdAt: '2024-01-20T10:30:00Z',
      readAt: '2024-01-20T10:30:00Z',
      sender: {
        id: 'user-2',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    }
  ],
  'conv-2': [
    {
      id: 'msg-5',
      conversationId: 'conv-2',
      senderId: 'user-1',
      content: 'I have a few questions about the check-in process.',
      messageType: 'text',
      createdAt: '2024-01-19T15:45:00Z',
      sender: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Check if user has access to this conversation
    // 3. Query database with pagination
    // 4. Include proper error handling

    const messages = mockMessages[conversationId] || [];
    
    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      messages: paginatedMessages,
      pagination: {
        page,
        limit,
        total: messages.length,
        hasMore: endIndex < messages.length
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversationId = params.id;
    const body = await request.json();
    const { content, messageType = 'text', metadata } = body;

    // Validate required fields
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Message content is required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Check if user has access to this conversation
    // 3. Validate message content and type
    // 4. Save message to database
    // 5. Send real-time notification to other participants
    // 6. Update conversation timestamp

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'user-1', // This would come from JWT token
      content: content.trim(),
      messageType,
      createdAt: new Date().toISOString(),
      metadata: metadata || {},
      sender: {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      }
    };

    // Add to mock data
    if (!mockMessages[conversationId]) {
      mockMessages[conversationId] = [];
    }
    mockMessages[conversationId].push(newMessage);

    return NextResponse.json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
