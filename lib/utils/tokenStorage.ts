/**
 * Token Storage Utility
 * Centralized token management - only handles tokens, not user data
 */

// Token storage keys
const ADMIN_TOKEN_KEY = 'adminToken';
const HOST_TOKEN_KEY = 'hostToken';

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
 * Clear all tokens (logout from all)
 */
export const clearAllTokens = (): void => {
  adminToken.remove();
  hostToken.remove();
};

/**
 * Get token for API requests
 * Returns the token with 'Bearer ' prefix
 */
export const getAuthHeader = (userType: 'admin' | 'host'): string | null => {
  const token = userType === 'admin' ? adminToken.get() : hostToken.get();
  return token ? `Bearer ${token}` : null;
};

