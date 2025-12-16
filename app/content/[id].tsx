/**
 * Content Detail Screen
 * Displays video player and content details
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useContentById } from '@/hooks/useContent';
import { useFavoritesStore } from '@/store/favoritesStore';
import { VideoCard } from '@/components/content/VideoCard';
import { contentService } from '@/services/contentService';
import { Content } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function ContentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { content, loading } = useContentById(id || '');
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<Error | null>(null);
  const colorScheme = useColorScheme();

  const isFavorite = useFavoritesStore((state) => state.isFavorite(id || ''));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // Create video player instance (only when content is loaded)
  const player = useVideoPlayer(content?.videoUrl || '', (player) => {
    player.loop = false;
    player.muted = false;
  });

  React.useEffect(() => {
    if (id) {
      setRelatedLoading(true);
      setRelatedError(null);
      contentService.getRelatedContent(id)
        .then(setRelatedContent)
        .catch((error) => {
          setRelatedError(error instanceof Error ? error : new Error('Failed to load related content'));
          setRelatedContent([]);
        })
        .finally(() => setRelatedLoading(false));
    }
  }, [id]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number): string => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
        </View>
      </ThemedView>
    );
  }

  if (!content) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText type="subtitle">Content not found</ThemedText>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <ThemedText>Go Back</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        {content && (
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls
              allowsFullscreen
            />
          </View>
        )}

        {/* Content Info */}
        <View style={styles.infoContainer}>
          <ThemedText type="title" style={styles.title}>
            {content.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <IconSymbol name="eye.fill" size={16} color={Colors[colorScheme ?? 'light'].icon} />
              <ThemedText style={styles.metaText}>{formatViews(content.views)}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="star.fill" size={16} color="#FFD700" />
              <ThemedText style={styles.metaText}>{content.rating.toFixed(1)}</ThemedText>
            </View>
            <View style={styles.metaItem}>
              <IconSymbol name="clock.fill" size={16} color={Colors[colorScheme ?? 'light'].icon} />
              <ThemedText style={styles.metaText}>{formatDuration(content.duration)}</ThemedText>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => toggleFavorite(content.id)}>
              <IconSymbol
                name={isFavorite ? 'heart.fill' : 'heart'}
                size={24}
                color={isFavorite ? '#FF6B6B' : Colors[colorScheme ?? 'light'].text}
              />
              <ThemedText style={styles.actionText}>
                {isFavorite ? 'Saved' : 'Save'}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol
                name="square.and.arrow.up"
                size={24}
                color={Colors[colorScheme ?? 'light'].text}
              />
              <ThemedText style={styles.actionText}>Share</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Description
            </ThemedText>
            <ThemedText style={styles.description}>{content.description}</ThemedText>
          </View>

          {/* Genre Tags */}
          <View style={styles.genreContainer}>
            {content.genre.map((genre) => (
              <View key={genre} style={styles.genreTag}>
                <ThemedText style={styles.genreText}>{genre}</ThemedText>
              </View>
            ))}
          </View>

          {/* Related Content */}
          {relatedLoading && (
            <View style={styles.relatedContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                More Like This
              </ThemedText>
              <View style={styles.relatedLoadingContainer}>
                <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
              </View>
            </View>
          )}
          
          {relatedError && (
            <View style={styles.relatedContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                More Like This
              </ThemedText>
              <ThemedText style={styles.errorText}>Could not load related content</ThemedText>
            </View>
          )}
          
          {!relatedLoading && relatedContent.length > 0 && (
            <View style={styles.relatedContainer}>
              <ThemedText type="subtitle" style={styles.sectionTitle}>
                More Like This
              </ThemedText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedScroll}>
                {relatedContent.map((item) => (
                  <View key={item.id} style={styles.relatedCardWrapper}>
                    <VideoCard
                      content={item}
                      onPress={() => router.replace(`/content/${item.id}`)}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  videoContainer: {
    width: '100%',
    height: width * 0.56, // 16:9 aspect ratio
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 15,
    opacity: 0.75,
    fontWeight: '500',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 28,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.85,
    fontWeight: '400',
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  genreTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(128, 128, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
  },
  genreText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  relatedContainer: {
    marginTop: 8,
    marginBottom: 20,
  },
  relatedScroll: {
    paddingRight: 16,
    gap: 12,
  },
  relatedCardWrapper: {
    width: 160,
    marginRight: 12,
  },
  relatedLoadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    opacity: 0.6,
    color: '#FF6B6B',
  },
});

