/**
 * Global state management for user favorites
 * Using Zustand for lightweight state management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[]; // Content IDs
  addFavorite: (contentId: string) => void;
  removeFavorite: (contentId: string) => void;
  toggleFavorite: (contentId: string) => void;
  isFavorite: (contentId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (contentId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(contentId)
            ? state.favorites
            : [...state.favorites, contentId],
        })),
      removeFavorite: (contentId: string) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== contentId),
        })),
      toggleFavorite: (contentId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(contentId)
            ? state.favorites.filter((id) => id !== contentId)
            : [...state.favorites, contentId],
        })),
      isFavorite: (contentId: string) => get().favorites.includes(contentId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

