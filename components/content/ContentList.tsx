/**
 * ContentList Component
 * Horizontal scrolling list of content items
 */

import React from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { VideoCard } from './VideoCard';
import { Content } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ContentListProps {
  title: string;
  content: Content[];
  loading?: boolean;
  onContentPress?: (content: Content) => void;
  size?: 'small' | 'medium' | 'large';
  horizontal?: boolean;
}

export function ContentList({
  title,
  content,
  loading = false,
  onContentPress,
  size = 'medium',
  horizontal = true,
}: ContentListProps) {
  const colorScheme = useColorScheme();

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors[colorScheme ?? 'light'].tint} />
        </View>
      </ThemedView>
    );
  }

  if (content.length === 0) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <FlatList
        data={content}
        renderItem={({ item }) => (
          <VideoCard
            content={item}
            size={size}
            onPress={() => onContentPress?.(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        horizontal={horizontal}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>No content available</ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingRight: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    opacity: 0.6,
  },
});

