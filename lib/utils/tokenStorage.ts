/**
 * Token Storage Utility
 * Centralized token management - only handles tokens, not user data
 */

// Token storage keys
const ADMIN_TOKEN_KEY = 'adminToken';
const HOST_TOKEN_KEY = 'hostToken';
const USER_TOKEN_KEY = 'userToken';

/**
 * Admin Token Management
 */
export const adminToken = {
  // Get admin token
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  },

  // Set admin token
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  },

  // Remove admin token
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  // Check if admin token exists
  exists: (): boolean => {
    return !!adminToken.get();
  },
};

/**
 * Host Token Management
 */
export const hostToken = {
  // Get host token
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(HOST_TOKEN_KEY);
  },

  // Set host token
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(HOST_TOKEN_KEY, token);
  },

  // Remove host token
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HOST_TOKEN_KEY);
  },

  // Check if host token exists
  exists: (): boolean => {
    return !!hostToken.get();
  },
};

/**
 * User Token Management
 */
export const userToken = {
  // Get user token
  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(USER_TOKEN_KEY);
  },

  // Set user token
  set: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_TOKEN_KEY, token);
  },

  // Remove user token
  remove: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_TOKEN_KEY);
  },

  // Check if user token exists
  exists: (): boolean => {
    return !!userToken.get();
  },
};

/**
 * Clear all tokens (logout from all)
 */
export const clearAllTokens = (): void => {
  adminToken.remove();
  hostToken.remove();
  userToken.remove();
};

/**
 * Get token for API requests
 * Returns the token with 'Bearer ' prefix
 */
export const getAuthHeader = (userType: 'admin' | 'host' | 'user'): string | null => {
  let token: string | null = null;
  
  switch (userType) {
    case 'admin':
      token = adminToken.get();
      break;
    case 'host':
      token = hostToken.get();
      break;
    case 'user':
      token = userToken.get();
      break;
  }
  
  return token ? `Bearer ${token}` : null;
};

/**
 * Get current token based on user role
 */
export const getCurrentToken = (role: string): string | null => {
  switch (role) {
    case 'agency':
      return adminToken.get();
    case 'agent':
      return hostToken.get();
    case 'bnbuser':
      return userToken.get();
    default:
      return null;
  }
};

/**
 * Set token based on user role
 */
export const setTokenByRole = (token: string, role: string): void => {
  switch (role) {
    case 'agency':
      adminToken.set(token);
      break;
    case 'agent':
      hostToken.set(token);
      break;
    case 'bnbuser':
      userToken.set(token);
      break;
  }
};

/**
 * Remove token based on user role
 */
export const removeTokenByRole = (role: string): void => {
  switch (role) {
    case 'agency':
      adminToken.remove();
      break;
    case 'agent':
      hostToken.remove();
      break;
    case 'bnbuser':
      userToken.remove();
      break;
  }
};

