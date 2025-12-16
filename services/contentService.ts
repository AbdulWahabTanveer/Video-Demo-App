/**
 * Content Service Layer
 * Handles all data operations related to content
 * Integrates with Pexels API for real video content
 */

import { CACHE_DURATION_MS } from '@/constants/theme';
import { Category, Content, SearchFilters } from '@/types';
import { pexelsService } from './pexelsService';

// Categories - These remain static
const mockCategories: Category[] = [
  { id: '1', name: 'Action', icon: 'bolt.fill', color: '#FF6B6B' },
  { id: '2', name: 'Comedy', icon: 'face.smiling.fill', color: '#4ECDC4' },
  { id: '3', name: 'Drama', icon: 'theatermasks.fill', color: '#45B7D1' },
  { id: '4', name: 'Sci-Fi', icon: 'sparkles', color: '#96CEB4' },
  { id: '5', name: 'Documentary', icon: 'book.fill', color: '#FFEAA7' },
  { id: '6', name: 'Horror', icon: 'eye.fill', color: '#DDA15E' },
];

// Fallback mock content for each category (used when Pexels API is not configured)
const generateFallbackContent = (category: Category): Content[] => {
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  ];

  const thumbnails = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
  ];

  const titles: Record<string, string[]> = {
    '1': ['Epic Action Sequence', 'Thrilling Adventure', 'High-Octane Thrills', 'Action-Packed Moments'],
    '2': ['Hilarious Comedy', 'Funny Moments', 'Laugh Out Loud', 'Comedy Gold'],
    '3': ['Emotional Drama', 'Cinematic Story', 'Dramatic Moments', 'Artistic Expression'],
    '4': ['Future Technology', 'Space Exploration', 'Sci-Fi Wonders', 'Tech Marvels'],
    '5': ['Nature Documentary', 'Wildlife Chronicles', 'Natural Wonders', 'Earth\'s Beauty'],
    '6': ['Dark Atmosphere', 'Mysterious Shadows', 'Eerie Moments', 'Thrilling Suspense'],
  };

  const descriptions: Record<string, string[]> = {
    '1': ['Experience heart-pounding action with breathtaking sequences.', 'High-octane adventure that keeps you on edge.'],
    '2': ['Laugh along with the funniest moments.', 'Comedy gold that brings joy.'],
    '3': ['A cinematic journey through emotional storytelling.', 'Deep, meaningful content.'],
    '4': ['Explore the future of technology.', 'Journey through sci-fi landscapes.'],
    '5': ['Immerse yourself in nature\'s beauty.', 'Documentary showcasing Earth\'s wonders.'],
    '6': ['A spine-chilling experience.', 'Dark and mysterious content.'],
  };

  return sampleVideos.slice(0, 8).map((videoUrl, index) => ({
    id: `fallback-${category.id}-${index}`,
    title: titles[category.id]?.[index % titles[category.id].length] || `${category.name} Content ${index + 1}`,
    description: descriptions[category.id]?.[index % descriptions[category.id].length] || `Amazing ${category.name.toLowerCase()} content.`,
    thumbnailUrl: thumbnails[index % thumbnails.length],
    videoUrl,
    duration: 300 + Math.random() * 600,
    category,
    genre: [category.name],
    rating: 4.0 + Math.random() * 1.0,
    releaseDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    views: Math.floor(50000 + Math.random() * 500000),
    isFeatured: index < 2,
  }));
};

// Cache for content by category
const contentCache: Map<string, { content: Content[]; timestamp: number }> = new Map();
// Cache for search results
const searchCache: Map<string, Content> = new Map();

class ContentService {
  /**
   * Simulates API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    await this.delay(100);
    return [...mockCategories];
  }

  /**
   * Get content for a category (from Pexels or fallback)
   */
  private async getCategoryContent(categoryId: string): Promise<Content[]> {
    // Check cache first
    const cached = contentCache.get(categoryId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION_MS) {
      return cached.content;
    }

    const category = mockCategories.find((c) => c.id === categoryId);
    if (!category) return [];

    // Try to fetch from Pexels
    try {
      const pexelsContent = await pexelsService.getVideosForCategory(category, 20);
      if (pexelsContent.length > 0) {
        // Cache the results
        contentCache.set(categoryId, {
          content: pexelsContent,
          timestamp: Date.now(),
        });
        return pexelsContent;
      }
    } catch (error) {
      console.error('Error fetching from Pexels:', error);
    }

    // Fallback to mock data - generate content for this category
    const fallback = generateFallbackContent(category);
    // Cache the fallback
    contentCache.set(categoryId, {
      content: fallback,
      timestamp: Date.now(),
    });
    return fallback;
  }

  /**
   * Get all content (aggregate from all categories)
   */
  async getAllContent(): Promise<Content[]> {
    await this.delay(200);
    const allCategories = await this.getCategories();
    const contentPromises = allCategories.map((cat) => this.getCategoryContent(cat.id));
    const contentArrays = await Promise.all(contentPromises);
    return contentArrays.flat();
  }

  /**
   * Get featured content
   */
  async getFeaturedContent(): Promise<Content[]> {
    await this.delay(200);
    const allContent = await this.getAllContent();
    return allContent.filter((content) => content.isFeatured).slice(0, 6);
  }

  /**
   * Get trending content (sorted by views)
   */
  async getTrendingContent(limit: number = 10): Promise<Content[]> {
    await this.delay(200);
    const allContent = await this.getAllContent();
    return [...allContent].sort((a, b) => b.views - a.views).slice(0, limit);
  }

  /**
   * Get content by category
   */
  async getContentByCategory(categoryId: string): Promise<Content[]> {
    await this.delay(200);
    return this.getCategoryContent(categoryId);
  }

  /**
   * Get content by ID
   */
  async getContentById(id: string): Promise<Content | null> {
    await this.delay(100);
    
    // Check search cache first
    if (searchCache.has(id)) {
      return searchCache.get(id) || null;
    }
    
    // Search through all content (includes both Pexels and fallback)
    const allContent = await this.getAllContent();
    return allContent.find((content) => content.id === id) || null;
  }

  /**
   * Search content
   */
  async searchContent(filters: SearchFilters): Promise<Content[]> {
    await this.delay(300);

    // If there's a search query, try Pexels search
    if (filters.query && filters.query.trim().length > 0) {
      try {
        const searchResults = await pexelsService.searchVideos(filters.query, 20);
        if (searchResults.length > 0) {
          // Cache search results for later retrieval
          searchResults.forEach((content) => {
            searchCache.set(content.id, content);
          });

          // Apply additional filters
          let results = searchResults;

          if (filters.category) {
            results = results.filter((content) => content.category.id === filters.category);
          }

          if (filters.genre) {
            results = results.filter((content) => content.genre.includes(filters.genre!));
          }

          if (filters.minRating) {
            results = results.filter((content) => content.rating >= filters.minRating!);
          }

          return results;
        }
      } catch (error) {
        console.error('Error searching Pexels:', error);
      }
    }

    // Fallback: search through all content
    const allContent = await this.getAllContent();
    let results = allContent;

    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(
        (content) =>
          content.title.toLowerCase().includes(query) ||
          content.description.toLowerCase().includes(query)
      );
    }

    if (filters.category) {
      results = results.filter((content) => content.category.id === filters.category);
    }

    if (filters.genre) {
      results = results.filter((content) => content.genre.includes(filters.genre!));
    }

    if (filters.minRating) {
      results = results.filter((content) => content.rating >= filters.minRating!);
    }

    return results;
  }

  /**
   * Get related content (same category)
   */
  async getRelatedContent(contentId: string, limit: number = 5): Promise<Content[]> {
    await this.delay(200);
    const content = await this.getContentById(contentId);
    if (!content) return [];

    const categoryContent = await this.getContentByCategory(content.category.id);
    return categoryContent
      .filter((c) => c.id !== contentId)
      .slice(0, limit);
  }
}

export const contentService = new ContentService();
