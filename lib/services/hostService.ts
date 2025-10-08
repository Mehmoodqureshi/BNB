/**
 * Host Service
 * Handles all host-related API calls and data management
 */

export interface Host {
  id: string;
  name: string;
  email: string;
  properties: number;
  isVerified?: boolean;
  rating?: number;
  joinedDate?: string;
}

/**
 * Fetches all hosts from the API
 * TODO: Replace with actual API call
 */
export const fetchAllHosts = async (): Promise<Host[]> => {
  // Mock data - replace with actual API call
  return [
    { 
      id: 'host_1', 
      name: 'Ahmed Al-Rashid', 
      email: 'ahmed@example.com', 
      properties: 3,
      isVerified: true,
      rating: 4.8,
      joinedDate: '2023-01-15'
    },
    { 
      id: 'host_2', 
      name: 'Sarah Johnson', 
      email: 'sarah@example.com', 
      properties: 5,
      isVerified: true,
      rating: 4.9,
      joinedDate: '2022-08-20'
    },
    { 
      id: 'host_3', 
      name: 'Mohammed Al-Zahra', 
      email: 'mohammed@example.com', 
      properties: 2,
      isVerified: true,
      rating: 4.7,
      joinedDate: '2023-03-10'
    },
    { 
      id: 'host_4', 
      name: 'Fatima Hassan', 
      email: 'fatima@example.com', 
      properties: 1,
      isVerified: false,
      rating: 4.5,
      joinedDate: '2024-01-05'
    },
    { 
      id: 'host_5', 
      name: 'John Smith', 
      email: 'john@example.com', 
      properties: 4,
      isVerified: true,
      rating: 4.6,
      joinedDate: '2022-11-12'
    },
  ];
};

/**
 * Fetches a single host by ID
 */
export const fetchHostById = async (hostId: string): Promise<Host | null> => {
  const hosts = await fetchAllHosts();
  return hosts.find(h => h.id === hostId) || null;
};

/**
 * Searches hosts by name or email
 */
export const searchHosts = async (query: string): Promise<Host[]> => {
  const hosts = await fetchAllHosts();
  const lowerQuery = query.toLowerCase();
  return hosts.filter(h => 
    h.name.toLowerCase().includes(lowerQuery) || 
    h.email.toLowerCase().includes(lowerQuery)
  );
};
