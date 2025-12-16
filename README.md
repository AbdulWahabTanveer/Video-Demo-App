# StreamHub - Streaming Platform Demo

A modern, production-ready streaming platform demo application built with React Native (Expo) and TypeScript. This application demonstrates clean architecture principles, best practices, and high-quality code organization.

## 🎯 Features

- **Real Video Content**: Integrated with Pexels API for real video streaming (free tier)
- **Home Screen**: Featured content, trending videos, and category browsing
- **Browse/Explore**: Search functionality with category filtering
- **Video Player**: Full-featured video playback with native controls (expo-video)
- **Content Details**: Detailed information, related content, and favorites
- **Favorites**: Save and manage favorite content (persisted locally)
- **Dark Mode**: Full support for light and dark themes
- **Clean Architecture**: Well-organized codebase following SOLID principles
- **All Categories Populated**: Every category has real content from Pexels

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

- **Presentation Layer**: React components and screens
- **Domain Layer**: TypeScript types and interfaces
- **Data Layer**: Services and state management

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture documentation.

## 📁 Project Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   └── content/           # Content detail screens
├── components/            # Reusable UI components
│   └── content/          # Content-specific components
├── hooks/                # Custom React hooks
├── services/             # Business logic layer
├── store/                # Global state (Zustand)
└── types/                # TypeScript definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (optional, but recommended)
- iOS Simulator (Mac) or Android Emulator
- **Pexels API Key** (free) - See [SETUP.md](./SETUP.md) for instructions

### Installation

1. Install dependencies:

```bash
npm install
```

2. **Configure Pexels API Key** (Required for real video content):

   - Get your free API key from [Pexels](https://www.pexels.com/api/)
   - Create a `.env` file in the root directory
   - Add: `EXPO_PUBLIC_PEXELS_API_KEY=your_api_key_here`
   - Restart the development server

   See [SETUP.md](./SETUP.md) for detailed instructions.

3. Start the development server:

```bash
npm start
```

4. Run on your preferred platform:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

> **Note**: The app works without an API key but will show limited fallback content. For the full experience with real videos, configure your Pexels API key.

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript (strict mode)
- **State Management**: Zustand
- **Video Playback**: Expo Video (latest, replaces deprecated expo-av)
- **Video API**: Pexels API (free tier, real video content)
- **Storage**: AsyncStorage
- **Icons**: Expo Vector Icons

## 📱 Screens

### Home Screen
- Featured content carousel
- Category navigation
- Trending content section
- Pull-to-refresh functionality

### Browse Screen
- Search bar with debounced input
- Category filtering
- Grid layout for content
- Empty states

### Content Detail Screen
- Full-screen video player
- Content metadata (views, rating, duration)
- Description and genre tags
- Related content recommendations
- Favorite toggle

## 🎨 Design Principles

- **Component Reusability**: Small, focused, composable components
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized rendering with FlatList, debounced search
- **User Experience**: Smooth animations, loading states, error handling
- **Accessibility**: Semantic HTML, proper contrast ratios

## 🔧 Code Quality

- **ESLint**: Configured with Expo preset
- **TypeScript**: Strict mode enabled
- **Clean Code**: SOLID principles, DRY, KISS
- **Documentation**: Inline comments and architecture docs
- **Consistent Formatting**: Following React Native conventions

## 📚 Key Concepts Demonstrated

1. **Service Layer Pattern**: Encapsulated data operations
2. **Custom Hooks**: Reusable data fetching logic
3. **Component Composition**: Small, focused components
4. **State Management**: Global state with persistence
5. **Error Handling**: Comprehensive error states
6. **Performance**: Debouncing, lazy loading, memoization

## 🚀 Future Enhancements

- User authentication
- Watch history tracking
- Playlists and collections
- Offline content support
- Push notifications
- Analytics integration
- Accessibility improvements

## 📖 Documentation

- [Architecture Documentation](./ARCHITECTURE.md) - Detailed architecture overview
- Code comments - Inline documentation for complex logic

## 🤝 Contributing

This is a demo application showcasing best practices. For production use:

1. Replace mock data with real API integration
2. Add comprehensive testing (unit, integration, E2E)
3. Implement proper error boundaries
4. Add analytics and monitoring
5. Set up CI/CD pipeline

## 📄 License

This project is a demo application for portfolio/assessment purposes.

## 👨‍💻 Developer Notes

This application was built to demonstrate:
- Clean architecture and code organization
- Best practices in React Native development
- TypeScript usage and type safety
- Modern state management patterns
- Component design and reusability
- Performance optimization techniques

The codebase is production-ready and can serve as a foundation for a real streaming platform application.
