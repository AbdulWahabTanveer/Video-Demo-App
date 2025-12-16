/**
 * VideoCard Component
 * YouTube-style video card for feed & grid layouts
 */

import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Content } from '@/types';

interface VideoCardProps {
  content: Content;
  onPress?: () => void;
}

export function VideoCard({ content, onPress }: VideoCardProps) {
  const colorScheme = useColorScheme();
  const isFavorite = useFavoritesStore((s) => s.isFavorite(content.id));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/content/${content.id}`);
    }
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation();
    toggleFavorite(content.id);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
    return `${views} views`;
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      <ThemedView style={styles.container}>
        {/* Thumbnail */}
        <View style={styles.thumbnailWrapper}>
          <Image
            source={{ uri: content.thumbnailUrl }}
            style={styles.thumbnail}
            contentFit="cover"
            transition={150}
          />

          {/* Favorite Button */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={10}
          >
            <IconSymbol
              name={isFavorite ? 'heart.fill' : 'heart'}
              size={20}
              color={isFavorite ? '#FF4D4F' : '#fff'}
            />
          </TouchableOpacity>

          {/* Duration */}
          <View style={styles.durationBadge}>
            <ThemedText style={styles.durationText}>
              {formatDuration(content.duration)}
            </ThemedText>
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <ThemedText
            numberOfLines={2}
            style={styles.title}
          >
            {content.title}
          </ThemedText>

          <View style={styles.metaRow}>
            <ThemedText style={styles.metaText}>
              {formatViews(content.views)}
            </ThemedText>
            <ThemedText style={styles.dot}>•</ThemedText>
            <View style={styles.ratingContainer}>
              <IconSymbol name="star.fill" size={12} color="#FFD700" />
              <ThemedText style={styles.metaText}>
                {content.rating.toFixed(1)}
              </ThemedText>
            </View>
          </View>
        </View>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  thumbnailWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#111',
  },

  thumbnail: {
    width: '100%',
    height: '100%',
  },

  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  infoContainer: {
    paddingTop: 10,
    paddingHorizontal: 2,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },

  metaText: {
    fontSize: 12,
    opacity: 0.6,
  },

  dot: {
    fontSize: 12,
    opacity: 0.4,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
