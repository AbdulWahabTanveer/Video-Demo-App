# StreamHub - Architecture Documentation

## Overview

StreamHub is a modern streaming platform demo application built with React Native (Expo) and TypeScript. The application follows clean architecture principles, emphasizing separation of concerns, maintainability, and scalability.

## Architecture Principles

### 1. Clean Architecture Layers

The application is structured in layers, following the Clean Architecture pattern:

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Screens, Components, Hooks)       │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Domain Layer                 │
│  (Types, Interfaces, Models)        │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│         Data Layer                   │
│  (Services, API, State Management)  │
└─────────────────────────────────────┘
```

### 2. Folder Structure

```
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   └── explore.tsx    # Browse/Explore screen
│   └── content/           # Content detail screen
│       └── [id].tsx       # Dynamic content route
│
├── components/            # Reusable UI components
│   ├── content/          # Content-specific components
│   │   ├── VideoCard.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── SearchBar.tsx
│   │   └── ContentList.tsx
│   └── ...               # Other shared components
│
├── hooks/                # Custom React hooks
│   ├── useContent.ts     # Content data fetching hooks
│   └── useDebounce.ts    # Utility hooks
│
├── services/             # Business logic & data layer
│   └── contentService.ts # Content data operations
│
├── store/                # Global state management
│   └── favoritesStore.ts # Zustand store for favorites
│
└── types/                # TypeScript type definitions
    └── index.ts          # Domain models and interfaces
```

## Key Design Patterns

### 1. Service Layer Pattern

The `contentService` encapsulates all data operations, providing a clean interface for data access:

```typescript
// services/contentService.ts
class ContentService {
  async getFeaturedContent(): Promise<Content[]>
  async getTrendingContent(limit: number): Promise<Content[]>
  async searchContent(filters: SearchFilters): Promise<Content[]>
  // ... more methods
}
```

**Benefits:**
- Single responsibility: Each service handles one domain
- Easy to mock for testing
- Can swap implementation (API, local storage, etc.) without changing components

### 2. Custom Hooks Pattern

Custom hooks abstract data fetching logic and provide a consistent API:

```typescript
// hooks/useContent.ts
export function useFeaturedContent(): UseContentResult
export function useTrendingContent(limit?: number): UseContentResult
export function useSearchContent()
```

**Benefits:**
- Reusable data fetching logic
- Consistent loading/error states
- Easy to add caching, refetching, etc.

### 3. Component Composition

Components are built in a composable, reusable manner:

```typescript
// Small, focused components
<VideoCard content={content} size="medium" />
<CategoryCard category={category} isSelected={true} />
<ContentList title="Featured" content={content} />
```

**Benefits:**
- Reusability across screens
- Easy to test individual components
- Clear component boundaries

### 4. State Management

Using Zustand for global state (favorites):

```typescript
// store/favoritesStore.ts
export const useFavoritesStore = create<FavoritesState>()(
  persist(/* ... */)
)
```

**Benefits:**
- Lightweight and simple API
- Built-in persistence
- Type-safe with TypeScript

## Best Practices Implemented

### 1. Type Safety

- All components and functions are fully typed
- Domain models defined in `types/index.ts`
- No `any` types used

### 2. Separation of Concerns

- **Presentation**: Components only handle UI and user interactions
- **Business Logic**: Services handle data operations
- **State Management**: Hooks and stores manage state
- **Types**: Centralized type definitions

### 3. Error Handling

- Try-catch blocks in all async operations
- Error states in custom hooks
- User-friendly error messages

### 4. Performance Optimizations

- Debounced search input
- Lazy loading with FlatList
- Image optimization with expo-image
- Memoization where appropriate

### 5. Code Organization

- Feature-based folder structure
- Consistent naming conventions
- Clear file responsibilities
- Comprehensive comments

## Data Flow

```
User Action
    ↓
Component (UI)
    ↓
Custom Hook (useContent, useSearchContent)
    ↓
Service Layer (contentService)
    ↓
Data Source (Mock API / Real API)
    ↓
State Update (React State / Zustand)
    ↓
UI Re-render
```

## Testing Strategy (Recommended)

While not implemented in this demo, the architecture supports:

1. **Unit Tests**: Services and utilities
2. **Component Tests**: React Native Testing Library
3. **Integration Tests**: Hook + Service combinations
4. **E2E Tests**: Screen navigation and user flows

## Scalability Considerations

### Adding New Features

1. **New Screen**: Add to `app/` directory
2. **New Component**: Add to `components/` with appropriate subfolder
3. **New Service**: Create in `services/` following existing patterns
4. **New Hook**: Add to `hooks/` with consistent API
5. **New Type**: Add to `types/index.ts`

### API Integration

To replace mock data with real API:

1. Update `contentService.ts` methods to use `fetch` or `axios`
2. Add API configuration in `config/` directory
3. Add error handling and retry logic
4. Implement caching strategy (React Query recommended)

### State Management Scaling

For more complex state:
- Consider React Query for server state
- Use Zustand for client state (already implemented)
- Context API for theme/UI state

## Dependencies

### Core
- `expo`: React Native framework
- `expo-router`: File-based routing
- `react-native`: Core React Native
- `typescript`: Type safety

### Video
- `expo-av`: Video playback

### State Management
- `zustand`: Lightweight state management
- `@react-native-async-storage/async-storage`: Persistence

### UI/UX
- `expo-image`: Optimized image component
- `react-native-reanimated`: Animations
- `@expo/vector-icons`: Icon library

## Code Quality

- **ESLint**: Configured with Expo preset
- **TypeScript**: Strict mode enabled
- **Consistent Formatting**: Following React Native conventions
- **Documentation**: Inline comments for complex logic

## Future Enhancements

1. **Authentication**: User login/signup
2. **Watch History**: Track viewing progress
3. **Playlists**: User-created content collections
4. **Offline Support**: Download content for offline viewing
5. **Push Notifications**: New content alerts
6. **Analytics**: User behavior tracking
7. **Accessibility**: Screen reader support, keyboard navigation

## Conclusion

This architecture provides a solid foundation for a production-ready streaming platform. The clean separation of concerns, type safety, and reusable components make it easy to maintain, test, and scale.

