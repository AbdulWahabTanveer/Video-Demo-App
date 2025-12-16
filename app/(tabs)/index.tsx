/**
 * Home Screen
 * YouTube-style feed layout
 */

import { CategoryCard } from '@/components/content/CategoryCard';
import { SearchBar } from '@/components/content/SearchBar';
import { VideoCard } from '@/components/content/VideoCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCategories, useContent, useContentByCategory, useSearchContent } from '@/hooks/useContent';
import { useDebounce } from '@/hooks/useDebounce';
import { Category, Content } from '@/types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BrowseScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.categoryId || null
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const { results, loading: searchLoading, search } = useSearchContent();
  const { categories } = useCategories();
  const {
    content: categoryContent,
    loading: categoryLoading,
  } = useContentByCategory(selectedCategory || '');

  useEffect(() => {
    if (debouncedSearchQuery && debouncedSearchQuery.trim().length > 0) {
      search({
        query: debouncedSearchQuery,
        category: selectedCategory || undefined,
      });
    } else {
      // Clear search results when query is empty
      search({ query: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, selectedCategory]);

  const handleContentPress = (content: Content) => {
    router.push(`/content/${content.id}`);
  };

  const handleCategoryPress = (category: Category) => {
    if (selectedCategory === category.id) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category.id);
    }
    setSearchQuery(''); // Clear search when selecting category
  };

  // Update selected category when params change
  useEffect(() => {
    if (params.categoryId && params.categoryId !== selectedCategory) {
      setSelectedCategory(params.categoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.categoryId]);

  // Get all content for "All" view
  const { content: allContent, loading: allLoading } = useContent();
  
  const displayContent = searchQuery && debouncedSearchQuery
    ? results
    : selectedCategory
    ? categoryContent
    : allContent;

  const isLoading = searchQuery && debouncedSearchQuery 
    ? searchLoading 
    : selectedCategory 
    ? categoryLoading 
    : allLoading;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Browse
          </ThemedText>
        </View>

      <SearchBar
        value={searchQuery}
        onSearch={setSearchQuery}
        placeholder="Search movies, shows, and more..."
      />

      {/* Categories Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}>
          <CategoryCard
            category={{ id: 'all', name: 'All', icon: 'square.grid.2x2', color: '#6366f1' }}
            isSelected={!selectedCategory}
            onPress={() => setSelectedCategory(null)}
          />
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Content Grid */}
      <FlatList
        data={displayContent}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <VideoCard
              content={item}
              size="medium"
              fullWidth={true}
              onPress={() => handleContentPress(item)}
            />
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.contentGrid}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <ThemedText style={styles.emptyText}>Loading amazing content...</ThemedText>
            ) : (
              <>
                <IconSymbol name="magnifyingglass" size={48} color={Colors[colorScheme ?? 'light'].icon} style={{ opacity: 0.3, marginBottom: 16 }} />
                <ThemedText style={styles.emptyText}>
                  {searchQuery
                    ? `No results found for "${searchQuery}"`
                    : selectedCategory
                    ? 'No content in this category'
                    : 'Search or select a category to browse content'}
                </ThemedText>
              </>
            )}
          </View>
        }
        refreshing={isLoading}
      />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginVertical: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  contentGrid: {
    padding: 16,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 0,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 8,
  },
});
