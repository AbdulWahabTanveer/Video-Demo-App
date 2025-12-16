/**
 * Core type definitions for the streaming platform
 * Following clean architecture principles with clear domain models
 */

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number; // in seconds
  category: Category;
  genre: string[];
  rating: number;
  releaseDate: string;
  views: number;
  isFeatured: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[]; // Content IDs
  watchHistory: WatchHistoryItem[];
}

export interface WatchHistoryItem {
  contentId: string;
  timestamp: number;
  progress: number; // in seconds
}

export interface SearchFilters {
  query: string;
  category?: string;
  genre?: string;
  minRating?: number;
}

export type ContentListType = 'featured' | 'trending' | 'recent' | 'category';

