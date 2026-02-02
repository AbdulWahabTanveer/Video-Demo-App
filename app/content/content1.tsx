/**
 * Browse Screen
 * TikTok-style vertical video feed with immersive experience
 */

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContent } from '@/hooks/useContent';
import { useFavoritesStore } from '@/store/favoritesStore';
import { Content } from '@/types';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export default function BrowseScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { content, loading, error } = useContent();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const isFavorite = useFavoritesStore((s) => s.isFavorite);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const videoRefs = useRef<Map<string, any>>(new Map());

  // Create ref at top level for viewability callback
  const onViewableItemsChangedRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const newActiveId = viewableItems[0].key as string;
      setActiveVideoId(newActiveId);
      
      // Pause all videos except the active one
      videoRefs.current.forEach((player, id) => {
        if (player) {
          if (id === newActiveId) {
            player.play();
          } else {
            player.pause();
          }
        }
      });
    }
  });

  const handleContentPress = (content: Content) => {
    router.push(`/content/${content.id}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
    return `${views}`;
  };

  // Render individual video item
  const renderItem = ({ item }: { item: Content }) => {
    const isLiked = isFavorite(item.id);
    const isActive = activeVideoId === item.id;
    
    return (
      <VideoItem
        item={item}
        isLiked={isLiked}
        isActive={isActive}
        onToggleFavorite={toggleFavorite}
        onPress={handleContentPress}
        formatDuration={formatDuration}
        formatViews={formatViews}
        videoRefs={videoRefs}
        screenHeight={SCREEN_HEIGHT - insets.bottom}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <ThemedText style={styles.loadingText}>Loading amazing content...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <IconSymbol name="exclamationmark.triangle" size={56} color="#ff4d4d" />
        <ThemedText style={styles.errorText}>Failed to load content</ThemedText>
        <ThemedText style={styles.errorSubtext}>{error.message}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT - insets.bottom}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        onViewableItemsChanged={onViewableItemsChangedRef.current}
        ListEmptyComponent={
          <View style={[styles.emptyFullContainer, { height: SCREEN_HEIGHT - insets.bottom }]}>
            <IconSymbol name="film" size={80} color="rgba(255,255,255,0.3)" />
            <ThemedText style={styles.emptyTitle}>No content available</ThemedText>
            <ThemedText style={styles.emptyText}>Check back soon for new videos</ThemedText>
          </View>
        }
      />
    </View>
  );
}

// VideoItem component with video player
interface VideoItemProps {
  item: Content;
  isLiked: boolean;
  isActive: boolean;
  onToggleFavorite: (id: string) => void;
  onPress: (content: Content) => void;
  formatDuration: (seconds: number) => string;
  formatViews: (views: number) => string;
  videoRefs: React.MutableRefObject<Map<string, any>>;
  screenHeight: number;
}

const VideoItem = React.memo(({ 
  item, 
  isLiked, 
  isActive,
  onToggleFavorite, 
  onPress, 
  formatDuration, 
  formatViews,
  videoRefs,
  screenHeight 
}: VideoItemProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(item.videoUrl, (player) => {
    player.loop = true;
    player.muted = false;
  });

  useEffect(() => {
    videoRefs.current.set(item.id, player);
    return () => {
      videoRefs.current.delete(item.id);
    };
  }, [item.id, player]);

  useEffect(() => {
    if (isActive) {
      player.play();
      setIsPlaying(true);
    } else {
      player.pause();
      setIsPlaying(false);
    }
  }, [isActive, player]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={[styles.videoContainer, { height: screenHeight }]}>
      {/* Video Player */}
      <VideoView
        style={styles.videoPlayer}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        nativeControls={false}
      />

      {/* Gradient Overlay for Better Text Visibility */}
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
        style={StyleSheet.absoluteFillObject}
        pointerEvents="none"
      />

      {/* Top Profile Section */}
      <SafeAreaView style={styles.topProfileContainer} edges={['top']}>
        <View style={styles.profileRow}>
          <View style={styles.categoryBadge}>
            <IconSymbol 
              name="film" 
              size={18} 
              color="#FFF" 
            />
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.contentType}>
              {item.genre && item.genre.length > 0 ? item.genre[0].toUpperCase() : 'VIDEO'}
            </ThemedText>
            <ThemedText style={styles.category}>
              {typeof item.category === 'string' ? item.category : item.category?.name || 'General'}
            </ThemedText>
          </View>
          <View style={styles.durationBadge}>
            <ThemedText style={styles.durationText}>{formatDuration(item.duration)}</ThemedText>
          </View>
        </View>
      </SafeAreaView>

      {/* Left Side Interaction Buttons */}
      <View style={styles.leftInteractionContainer}>
        <TouchableOpacity 
          style={styles.interactionBtn}
          onPress={() => onToggleFavorite(item.id)}
        >
          <View style={[styles.iconBlur, isLiked && styles.iconBlurActive]}>
            <IconSymbol 
              name={isLiked ? 'heart.fill' : 'heart'} 
              size={28} 
              color={isLiked ? '#ff4d4d' : '#FFF'} 
            />
          </View>
          <ThemedText style={styles.interactionLabel}>{formatViews(item.views)}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.interactionBtn}>
          <View style={styles.iconBlur}>
            <IconSymbol name="star.fill" size={28} color="#FFD700" />
          </View>
          <ThemedText style={styles.interactionLabel}>{item.rating.toFixed(1)}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.interactionBtn}
          onPress={() => onPress(item)}
        >
          <View style={styles.iconBlur}>
            <IconSymbol name="info.circle.fill" size={28} color="#FFF" />
          </View>
          <ThemedText style={styles.interactionLabel}>Info</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.interactionBtn}>
          <View style={styles.iconBlur}>
            <IconSymbol name="square.and.arrow.up.fill" size={28} color="#FFF" />
          </View>
          <ThemedText style={styles.interactionLabel}>Share</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Play/Pause Button Overlay */}
      <TouchableOpacity 
        style={styles.playbackControls}
        onPress={handlePlayPause}
      >
        <View style={styles.playPauseButton}>
          <IconSymbol 
            name={isPlaying ? 'pause.fill' : 'play.fill'} 
            size={32} 
            color="#FFF" 
          />
        </View>
      </TouchableOpacity>

      {/* Bottom Info - Title & Description */}
      <View style={styles.bottomInfoContainer}>
        <ThemedText style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </ThemedText>
        <ThemedText style={styles.videoDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },
  videoPlayer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  
  // TOP PROFILE SECTION
  topProfileContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    zIndex: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    padding: 10,
    borderRadius: 30,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  profileInfo: {
    marginLeft: 12,
    marginRight: 12,
  },
  contentType: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  category: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
  },
  durationBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  durationText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // LEFT SIDE INTERACTIONS
  leftInteractionContainer: {
    position: 'absolute',
    left: 16,
    bottom: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
    zIndex: 10,
  },
  interactionBtn: {
    alignItems: 'center',
  },
  iconBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  iconBlurActive: {
    backgroundColor: 'rgba(255,77,79,0.3)',
    borderColor: 'rgba(255,77,79,0.5)',
  },
  interactionLabel: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  // PLAYBACK CONTROLS
  playbackControls: {
    position: 'absolute',
    alignSelf: 'center',
    opacity: 0.9,
  },
  playPauseButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(10px)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // BOTTOM INFO
  bottomInfoContainer: {
    position: 'absolute',
    bottom: 30,
    left: 80,
    right: 16,
    zIndex: 5,
  },
  videoTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    letterSpacing: -0.3,
  },
  videoDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  // LOADING & ERROR STATES
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
  },
  errorSubtext: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyFullContainer: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 32,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
});
