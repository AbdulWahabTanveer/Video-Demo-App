# Setup Guide - Pexels API Integration

## Getting Your Free Pexels API Key

StreamHub uses the Pexels API to fetch real video content. Follow these steps to get your free API key:

### Step 1: Sign Up for Pexels

1. Go to [https://www.pexels.com/api/](https://www.pexels.com/api/)
2. Click "Get Started" or "Sign Up"
3. Create a free account (no credit card required)

### Step 2: Get Your API Key

1. After signing up, go to your [Pexels Dashboard](https://www.pexels.com/api/new/)
2. Click "Create API Key"
3. Give it a name (e.g., "StreamHub Demo")
4. Copy your API key

### Step 3: Configure the API Key

**Using Environment Variables (Recommended)**

1. Create a `.env` file in the root directory of the project
2. Add your API key:

```bash
EXPO_PUBLIC_PEXELS_API_KEY=your_actual_api_key_here
```

**Example:**
```bash
EXPO_PUBLIC_PEXELS_API_KEY=abc123xyz789yourkeyhere
```

> **Note**: The `.env` file is already in `.gitignore`, so your API key won't be committed to version control.

**Template File:**
- A `.env.example` file is provided as a template
- Copy it to `.env` and add your actual key

### Step 4: Restart the App

After adding your API key, restart the development server:

```bash
npm start
```

## API Limits

Pexels free tier includes:
- **200 requests per hour** - More than enough for demo purposes
- Unlimited video downloads
- High-quality video content

## Troubleshooting

### Videos Not Loading?

1. **Check API Key**: 
   - Verify your `.env` file exists in the root directory
   - Check that `EXPO_PUBLIC_PEXELS_API_KEY` is set correctly
   - Make sure there are no extra spaces or quotes around the key
   - Restart the development server after creating/updating `.env`
2. **Check Network**: Ensure you have an internet connection
3. **Check Console**: Look for warning messages in the console (will show if API key is missing)
4. **Rate Limits**: If you hit rate limits, wait a few minutes and try again

### Fallback Content

If the API key is not configured or there's an error, the app will show fallback sample content. This allows you to test the app structure even without an API key.

## Testing Without API Key

The app will work with fallback content if no API key is configured. However, to see real videos from Pexels, you'll need to add your API key.

## Need Help?

- [Pexels API Documentation](https://www.pexels.com/api/documentation/)
- [Pexels Support](https://www.pexels.com/contact/)

