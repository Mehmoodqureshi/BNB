import { NextRequest, NextResponse } from 'next/server';
import { Message, Conversation } from '@/lib/types/messaging';

// Mock data for development - replace with actual database calls
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    propertyId: 'prop-1',
    guestId: 'user-1',
    hostId: 'user-2',
    status: 'active',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
    property: {
      id: 'prop-1',
      title: 'Luxury Apartment in Downtown Dubai',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
      price: 450,
      currency: 'AED',
      location: 'Downtown Dubai, Dubai'
    },
    participants: [
      {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: true,
        rating: 4.8,
        responseTime: 'within an hour',
        lastReadAt: '2024-01-20T15:25:00Z'
      },
      {
        id: 'user-2',
        firstName: 'Ahmed',
        lastName: 'Al-Rashid',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: false,
        rating: 4.9,
        responseTime: 'within 2 hours',
        lastReadAt: '2024-01-20T15:30:00Z'
      }
    ],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'user-2',
      content: 'Thank you for your interest! The apartment is available for your dates.',
      messageType: 'text',
      createdAt: '2024-01-20T15:30:00Z',
      readAt: '2024-01-20T15:30:00Z'
    },
    unreadCount: 0
  },
  {
    id: 'conv-2',
    propertyId: 'prop-2',
    guestId: 'user-1',
    hostId: 'user-3',
    status: 'active',
    createdAt: '2024-01-19T14:00:00Z',
    updatedAt: '2024-01-19T16:45:00Z',
    property: {
      id: 'prop-2',
      title: 'Beachfront Villa in Palm Jumeirah',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      price: 1200,
      currency: 'AED',
      location: 'Palm Jumeirah, Dubai'
    },
    participants: [
      {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        isOnline: true,
        rating: 4.8,
        responseTime: 'within an hour',
        lastReadAt: '2024-01-19T16:40:00Z'
      },
      {
        id: 'user-3',
        firstName: 'Sarah',
        lastName: 'Johnson',
        profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        isOnline: true,
        rating: 4.8,
        responseTime: 'within 2 hours',
        lastReadAt: '2024-01-19T16:45:00Z'
      }
    ],
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'user-1',
      content: 'I have a few questions about the check-in process.',
      messageType: 'text',
      createdAt: '2024-01-19T16:45:00Z'
    },
    unreadCount: 2
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Get user ID from token
    // 3. Query database for user's conversations
    // 4. Include proper error handling

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status') || 'active';

    let conversations = mockConversations;

    // Filter by status
    conversations = conversations.filter(conv => conv.status === status);

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      conversations = conversations.filter(conv => 
        conv.property?.title.toLowerCase().includes(searchLower) ||
        conv.participants.some(p => 
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchLower)
        ) ||
        conv.lastMessage?.content.toLowerCase().includes(searchLower)
      );
    }

    // Sort by updated_at desc
    conversations.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, hostId, initialMessage } = body;

    // Validate required fields
    if (!propertyId || !hostId) {
      return NextResponse.json(
        { success: false, error: 'Property ID and Host ID are required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Verify the JWT token
    // 2. Check if user has permission to create conversation
    // 3. Check if conversation already exists
    // 4. Create conversation in database
    // 5. Send initial message if provided

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      propertyId,
      guestId: 'user-1', // This would come from JWT token
      hostId,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      property: {
        id: propertyId,
        title: 'New Property',
        image: '',
        price: 0,
        currency: 'AED',
        location: 'Dubai'
      },
      participants: [],
      unreadCount: 0
    };

    return NextResponse.json({
      success: true,
      conversation: newConversation
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
