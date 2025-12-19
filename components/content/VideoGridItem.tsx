/**
 * VideoGridItem Component
 * TikTok-style video grid item with autoplay
 */

import { Content } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VideoGridItemProps {
  content: Content;
  isVisible: boolean;
  onPress: () => void;
  itemWidth: number;
  aspectRatio: number;
}

function VideoGridItemComponent({ 
  content, 
  isVisible, 
  onPress, 
  itemWidth, 
  aspectRatio 
}: VideoGridItemProps) {
  const isMountedRef = useRef(true);
  const wasVisibleRef = useRef(false);
  
  // Create video player instance - only create if we have a valid URL
  const player = useVideoPlayer(content.videoUrl || '', (player) => {
    player.loop = true;
    player.muted = true; // Muted by default for autoplay
    player.pause();
  });

  // Handle visibility changes
  useEffect(() => {
    if (!isMountedRef.current || !content.videoUrl) return;
    
    // Only toggle if visibility actually changed
    if (isVisible && !wasVisibleRef.current) {
      wasVisibleRef.current = true;
      try {
        player.play();
      } catch {
        // Silently handle errors
      }
    } else if (!isVisible && wasVisibleRef.current) {
      wasVisibleRef.current = false;
      try {
        player.pause();
      } catch {
        // Silently handle errors
      }
    }
  }, [isVisible, player, content.videoUrl]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      wasVisibleRef.current = false;
      try {
        player.pause();
      } catch {
        // Silently handle cleanup errors
      }
    };
  }, [player]);

  const formatViews = (views: number) => {
    if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
    if (views >= 1_000) return `${(views / 1_000).toFixed(1)}k`;
    return `${views}`;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePress = () => {
    // Pause video when navigating away
    player.pause();
    onPress();
  };

  return (
    <TouchableOpacity 
      style={[styles.gridItem, { width: itemWidth, height: itemWidth * aspectRatio }]} 
      activeOpacity={0.8}
      onPress={handlePress}
    >
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        allowsFullscreen={false}
      />
      
      {/* Duration Badge */}
      <View style={styles.ratioBadge}>
        <Text style={styles.ratioText}>{formatDuration(content.duration)}</Text>
      </View>

      {/* Bottom Overlay */}
      <View style={styles.gridOverlay}>
        <Text style={styles.gridUsername} numberOfLines={1}>{content.title}</Text>
        <View style={styles.viewsContainer}>
          <Ionicons name="eye-outline" size={12} color="#fff" />
          <Text style={styles.viewsText}> {formatViews(content.views)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export const VideoGridItem = React.memo(VideoGridItemComponent, (prevProps, nextProps) => {
  // Only re-render if visibility or content ID changes
  return (
    prevProps.content.id === nextProps.content.id &&
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.itemWidth === nextProps.itemWidth &&
    prevProps.aspectRatio === nextProps.aspectRatio
  );
});

const styles = StyleSheet.create({
  gridItem: {
    padding: 1, // Tiny gap between items
    position: 'relative',
    borderRadius: 6,
    overflow: 'hidden',
  },
  video: {
    flex: 1,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  ratioBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  ratioText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  gridUsername: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    color: '#ddd',
    fontSize: 10,
  },
});

