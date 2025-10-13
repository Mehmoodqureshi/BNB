/**
 * Google OAuth Configuration
 * 
 * To set up Google OAuth:
 * 1. Go to Google Cloud Console (https://console.cloud.google.com/)
 * 2. Create a new project or select existing one
 * 3. Enable Google+ API
 * 4. Go to Credentials and create OAuth 2.0 Client ID
 * 5. Add your domain to authorized origins
 * 6. Copy the Client ID and replace the placeholder below
 */

export const GOOGLE_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your_google_client_id_here',
  // For development, you can use a test client ID
  // For production, make sure to use your actual client ID
};

export const isGoogleConfigured = () => {
  return GOOGLE_CONFIG.clientId !== 'your_google_client_id_here' && GOOGLE_CONFIG.clientId.length > 0;
};
