/**
 * Home Screen
 * TikTok-style vertical video grid layout
 */

import { CategoryCard } from '@/components/content/CategoryCard';
import { VideoGridItem } from '@/components/content/VideoGridItem';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { DEBOUNCE_DELAY_MS } from '@/constants/theme';
import { useCategories, useContent, useContentByCategory, useSearchContent } from '@/hooks/useContent';
import { useDebounce } from '@/hooks/useDebounce';
import { Category, Content } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 3;
const ITEM_WIDTH = width / COLUMN_COUNT;
const ASPECT_RATIO = 16 / 9; // Vertical video aspect ratio

export default function BrowseScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    params.categoryId || null
  );
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set());
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50, // Video is considered visible when 50% is shown
  });

  const debouncedSearchQuery = useDebounce(searchQuery, DEBOUNCE_DELAY_MS);
  const { results, loading: searchLoading, error: searchError, search } = useSearchContent();
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

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ item: Content; key: string }> }) => {
      const visibleIds = new Set(viewableItems.map((item) => item.item.id));
      setVisibleItems(visibleIds);
    },
    []
  );

  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfig.current,
      onViewableItemsChanged,
    },
  ]);

  const renderHeader = () => (
    <View>
      {/* Search & Categories Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Search content..." 
            placeholderTextColor="#888"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

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

      <Text style={styles.sectionTitle}>
        {searchQuery && debouncedSearchQuery 
          ? `Search Results` 
          : selectedCategory 
          ? categories.find(c => c.id === selectedCategory)?.name || 'Category'
          : 'Trending Now'}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: Content }) => (
    <VideoGridItem
      content={item}
      isVisible={visibleItems.has(item.id)}
      onPress={() => handleContentPress(item)}
      itemWidth={ITEM_WIDTH}
      aspectRatio={ASPECT_RATIO}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {isLoading && displayContent.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading Feed...</Text>
        </View>
      ) : (
        <FlatList
          data={displayContent}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          removeClippedSubviews={true}
          maxToRenderPerBatch={6}
          updateCellsBatchingPeriod={50}
          windowSize={5}
          initialNumToRender={9}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              {isLoading ? (
                <Text style={styles.emptyText}>Loading amazing content...</Text>
              ) : searchError ? (
                <Text style={styles.emptyText}>Error: {searchError.message}</Text>
              ) : (
                <>
                  <IconSymbol 
                    name="magnifyingglass" 
                    size={48} 
                    color="#888" 
                    style={{ opacity: 0.3, marginBottom: 16 }} 
                  />
                  <Text style={styles.emptyText}>
                    {searchQuery
                      ? `No results found for "${searchQuery}"`
                      : selectedCategory
                      ? 'No content in this category'
                      : 'Search or select a category to browse content'}
                  </Text>
                </>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Pitch black background
  },
  // --- HEADER & SEARCH ---
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 44,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  
  // --- CATEGORIES ---
  categoriesContainer: {
    marginBottom: 12,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
    marginTop: 8,
  },


  // --- LOADING ---
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  
  // --- EMPTY STATE ---
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
  },
});
