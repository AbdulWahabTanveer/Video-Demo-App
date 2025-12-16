# Environment Variables Setup

## Quick Start

1. **Create `.env` file** in the root directory:
   ```bash
   EXPO_PUBLIC_PEXELS_API_KEY=your_actual_api_key_here
   ```

2. **Restart the development server**:
   ```bash
   npm start
   ```

## How It Works

- Expo automatically loads environment variables from `.env` files
- Variables prefixed with `EXPO_PUBLIC_` are exposed to your app
- The `.env` file is already in `.gitignore` (won't be committed)

## Security

✅ **Safe**: `.env` is in `.gitignore`  
✅ **Safe**: Only `EXPO_PUBLIC_*` variables are exposed (client-side)  
⚠️ **Note**: These variables are visible in the client bundle

## File Structure

```
VideoDemoApp/
├── .env                 # Your actual API key (not committed)
├── .env.example         # Template file (committed)
└── config/
    └── api.ts          # Reads from process.env.EXPO_PUBLIC_PEXELS_API_KEY
```

## Troubleshooting

### API Key Not Working?

1. **Check file location**: `.env` must be in the root directory (same level as `package.json`)
2. **Check variable name**: Must be exactly `EXPO_PUBLIC_PEXELS_API_KEY`
3. **No quotes needed**: Don't wrap the value in quotes
4. **Restart required**: Always restart the dev server after changing `.env`
5. **Check console**: Look for warning messages about missing API key

### Example `.env` file:

```bash
# Pexels API Key
EXPO_PUBLIC_PEXELS_API_KEY=abc123xyz789yourkeyhere

# No spaces around the = sign
# No quotes around the value
# One variable per line
```

## Verification

If the API key is correctly set, you should:
- ✅ See real videos from Pexels in all categories
- ✅ No warning messages in the console
- ✅ Search functionality works

If the API key is missing:
- ⚠️ Warning message in console (development only)
- 📹 Fallback sample content is shown
- 🔍 Search returns empty results

