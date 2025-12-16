/**
 * Global state management for user favorites
 * Using Zustand for lightweight state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      toggleFavorite: (contentId: string) => {
        const state = get();
        const isFavorite = state.favorites.includes(contentId);
        if (isFavorite) {
          state.removeFavorite(contentId);
        } else {
          state.addFavorite(contentId);
        }
      },
      isFavorite: (contentId: string) => get().favorites.includes(contentId),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

