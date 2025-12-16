/**
 * Pexels API Service
 * Free video API for fetching real video content
 * Get your API key from: https://www.pexels.com/api/
 */

import { PEXELS_API_KEY } from '@/config/api';
import { Category, Content } from '@/types';

const PEXELS_API_URL = 'https://api.pexels.com/videos';

// Category to Pexels search term mapping
const CATEGORY_SEARCH_TERMS: Record<string, string> = {
  '1': 'action adventure', // Action
  '2': 'comedy funny', // Comedy
  '3': 'drama emotional', // Drama
  '4': 'sci-fi technology space', // Sci-Fi
  '5': 'documentary nature wildlife', // Documentary
  '6': 'horror dark spooky', // Horror
};

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  duration: number;
  image: string;
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
  video_pictures: {
    id: number;
    picture: string;
    nr: number;
  }[];
}

interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  videos: PexelsVideo[];
}

class PexelsService {
  private apiKey: string;

  constructor(apiKey: string = PEXELS_API_KEY) {
    this.apiKey = apiKey;
  }

  /**
   * Get the best quality video URL from Pexels video files
   */
  private getBestVideoUrl(videoFiles: PexelsVideo['video_files']): string {
    // Prefer HD quality, fallback to SD
    const hdVideo = videoFiles.find((file) => file.quality === 'hd' && file.height >= 720);
    if (hdVideo) return hdVideo.link;

    const sdVideo = videoFiles.find((file) => file.quality === 'sd');
    if (sdVideo) return sdVideo.link;

    // Fallback to first available
    return videoFiles[0]?.link || '';
  }

  /**
   * Fetch videos from Pexels API
   */
  private async fetchVideos(query: string, perPage: number = 15): Promise<PexelsVideo[]> {
    try {
      const response = await fetch(
        `${PEXELS_API_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
        {
          headers: {
            Authorization: this.apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`);
      }

      const data: PexelsResponse = await response.json();
      return data.videos || [];
    } catch (error) {
      console.error('Error fetching from Pexels:', error);
      return [];
    }
  }

  /**
   * Convert Pexels video to Content format
   */
  private pexelsToContent(
    pexelsVideo: PexelsVideo,
    category: Category,
    index: number,
    searchQuery?: string
  ): Content {
    const videoUrl = this.getBestVideoUrl(pexelsVideo.video_files);
    const thumbnailUrl = pexelsVideo.video_pictures[0]?.picture || pexelsVideo.image;

    // Use search query-based title if available, otherwise generate from category
    let title: string;
    if (searchQuery) {
      // Capitalize the search query and add a counter for uniqueness
      title = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1) + ` (${index + 1})`;
    } else {
      const titles = this.generateTitle(category, index);
      title = titles.title;
    }

    const descriptions = this.generateDescription(category, index);

    return {
      id: `pexels-${pexelsVideo.id}`,
      title,
      description: descriptions.description,
      thumbnailUrl,
      videoUrl,
      duration: pexelsVideo.duration,
      category,
      genre: this.getGenresForCategory(category),
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      releaseDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      views: Math.floor(10000 + Math.random() * 500000),
      isFeatured: index < 3, // First 3 are featured
    };
  }

  /**
   * Generate title based on category
   */
  private generateTitle(category: Category, index: number): { title: string } {
    const titles: Record<string, string[]> = {
      '1': [
        'Epic Action Sequence',
        'Thrilling Adventure',
        'Action-Packed Moments',
        'High-Octane Thrills',
        'Intense Action Scene',
      ],
      '2': [
        'Hilarious Comedy Moments',
        'Funny Compilation',
        'Laugh Out Loud',
        'Comedy Gold',
        'Side-Splitting Fun',
      ],
      '3': [
        'Emotional Drama',
        'Cinematic Storytelling',
        'Dramatic Moments',
        'Artistic Expression',
        'Deep Narrative',
      ],
      '4': [
        'Future Technology',
        'Space Exploration',
        'Sci-Fi Wonders',
        'Technological Marvels',
        'Cosmic Journey',
      ],
      '5': [
        'Nature Documentary',
        'Wildlife Chronicles',
        'Natural Wonders',
        'Earth\'s Beauty',
        'Wildlife Adventure',
      ],
      '6': [
        'Dark Atmosphere',
        'Mysterious Shadows',
        'Eerie Moments',
        'Haunting Scenes',
        'Thrilling Suspense',
      ],
    };

    const categoryTitles = titles[category.id] || ['Amazing Content'];
    return {
      title: categoryTitles[index % categoryTitles.length] || 'Amazing Video',
    };
  }

  /**
   * Generate description based on category
   */
  private generateDescription(category: Category, index: number): { description: string } {
    const descriptions: Record<string, string[]> = {
      '1': [
        'Experience heart-pounding action with breathtaking stunts and intense sequences.',
        'High-octane adventure that will keep you on the edge of your seat.',
        'Thrilling action-packed content with incredible cinematography.',
      ],
      '2': [
        'Laugh along with the funniest moments guaranteed to brighten your day.',
        'A hilarious compilation that will have you in stitches.',
        'Comedy gold that brings joy and laughter to your screen.',
      ],
      '3': [
        'A cinematic journey through emotional storytelling and artistic vision.',
        'Deep, meaningful content that touches the heart and soul.',
        'Beautifully crafted drama with compelling narratives.',
      ],
      '4': [
        'Explore the future of technology and the wonders of space.',
        'Journey through sci-fi landscapes and technological marvels.',
        'Discover the mysteries of the cosmos and advanced technology.',
      ],
      '5': [
        'Immerse yourself in the beauty of nature and wildlife.',
        'A documentary experience showcasing Earth\'s natural wonders.',
        'Witness the incredible diversity of wildlife and nature.',
      ],
      '6': [
        'A spine-chilling experience that will send shivers down your spine.',
        'Dark and mysterious content that creates an eerie atmosphere.',
        'Thrilling suspense that keeps you guessing until the end.',
      ],
    };

    const categoryDescriptions = descriptions[category.id] || ['Amazing content to enjoy.'];
    return {
      description: categoryDescriptions[index % categoryDescriptions.length] || 'Enjoy this amazing content.',
    };
  }

  /**
   * Get genres for category
   */
  private getGenresForCategory(category: Category): string[] {
    const genreMap: Record<string, string[]> = {
      '1': ['Action', 'Adventure', 'Thriller'],
      '2': ['Comedy', 'Entertainment', 'Fun'],
      '3': ['Drama', 'Cinematic', 'Artistic'],
      '4': ['Sci-Fi', 'Technology', 'Space'],
      '5': ['Documentary', 'Nature', 'Wildlife'],
      '6': ['Horror', 'Thriller', 'Suspense'],
    };

    return genreMap[category.id] || ['General'];
  }

  /**
   * Fetch videos for a category
   */
  async getVideosForCategory(category: Category, limit: number = 15): Promise<Content[]> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      if (__DEV__) {
        console.warn('Pexels API key not configured. Using fallback content.');
      }
      return this.getFallbackContent(category, limit);
    }

    const searchTerm = CATEGORY_SEARCH_TERMS[category.id] || category.name.toLowerCase();
    const pexelsVideos = await this.fetchVideos(searchTerm, limit);

    if (pexelsVideos.length === 0) {
      return this.getFallbackContent(category, limit);
    }

    return pexelsVideos.map((video, index) => this.pexelsToContent(video, category, index));
  }

  /**
   * Search videos
   */
  async searchVideos(query: string, limit: number = 20): Promise<Content[]> {
    if (!this.apiKey || this.apiKey.trim() === '') {
      if (__DEV__) {
        console.warn('Pexels API key not configured. Search unavailable.');
      }
      return [];
    }

    const pexelsVideos = await this.fetchVideos(query, limit);
    // For search, we'll use a generic category
    const genericCategory: Category = {
      id: 'search',
      name: 'Search Results',
      icon: 'magnifyingglass',
      color: '#6366f1',
    };

    return pexelsVideos.map((video, index) => this.pexelsToContent(video, genericCategory, index, query));
  }

  /**
   * Fallback content when API is not configured
   */
  private getFallbackContent(category: Category, limit: number): Content[] {
    // Return empty array - will be handled by contentService fallback
    return [];
  }
}

// Export singleton instance
export const pexelsService = new PexelsService();

