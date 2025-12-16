/**
 * API Configuration
 * All API keys are loaded from environment variables
 * 
 * Get your free Pexels API key from: https://www.pexels.com/api/
 * 
 * Setup:
 * 1. Copy .env.example to .env
 * 2. Add your Pexels API key to .env file
 * 3. Restart the development server
 */

export const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY || '';

if (!PEXELS_API_KEY && __DEV__) {
  console.warn(
    '⚠️  Pexels API key not found. Please set EXPO_PUBLIC_PEXELS_API_KEY in your .env file.\n' +
    '   The app will work with fallback content, but real videos require an API key.\n' +
    '   See SETUP.md for instructions.'
  );
}

