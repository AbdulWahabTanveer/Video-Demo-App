import { Ionicons } from '@expo/vector-icons'; // Ensure you have @expo/vector-icons installed
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    LayoutAnimation,
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

// --- MOCK DATA GENERATORS ---

const generateRandomUser = (id: string) => ({
  id,
  name: `user_${Math.floor(Math.random() * 1000)}`,
  avatar: `https://i.pravatar.cc/150?u=${id}`,
  views: `${(Math.random() * 50).toFixed(1)}k`,
  image: `https://picsum.photos/200/350?random=${id}`, // Random vertical image
});

const INITIAL_STORIES = Array.from({ length: 8 }).map((_, i) => ({
  id: `story-${i}`,
  user: `user_${i}`,
  avatar: `https://i.pravatar.cc/150?u=story_${i}`,
  isSeen: Math.random() > 0.5,
}));

const INITIAL_POSTS = Array.from({ length: 15 }).map((_, i) => generateRandomUser(`post-${i}`));

export default function BrowseScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState(INITIAL_STORIES);
  const [isLoading, setIsLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  // 1. Simulate Initial Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(INITIAL_POSTS);
      setIsLoading(false);
    }, 2000); // 2 second mock load
    return () => clearTimeout(timer);
  }, []);

  // 2. Simulate "Live" Data Stream (New Content Injection)
  useEffect(() => {
    if (isLoading) return;

    const interval = setInterval(() => {
      // Create new post
      const newPost = generateRandomUser(`live-${Date.now()}`);
      
      // Animate the update
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      
      // Add to top of list
      setPosts((currentPosts) => [newPost, ...currentPosts]);
      
      // Optional: Scroll to top to show new item
      // listRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 5000); // Add new content every 5 seconds

    return () => clearInterval(interval);
  }, [isLoading]);

  // --- RENDER COMPONENTS ---

  const renderHeader = () => (
    <View>
      {/* Search & Points Header */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 8 }} />
          <TextInput 
            placeholder="Search people & stories" 
            placeholderTextColor="#888"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.pointsBadge}>
          <View style={styles.coinIcon}>
            <Text style={styles.coinText}>F</Text>
          </View>
          <View>
            <Text style={styles.pointsText}>1.2k</Text>
            <Text style={styles.pointsLabel}>Points</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stories Section */}
      <View style={styles.storiesContainer}>
        <Text style={styles.sectionTitle}>Stories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
          {/* Add Story Button */}
          <View style={styles.storyItem}>
            <View style={[styles.storyCircle, styles.addStoryCircle]}>
              <Ionicons name="add" size={30} color="#fff" />
              <View style={styles.addBadge}>
                <Ionicons name="add" size={12} color="#000" />
              </View>
            </View>
            <Text style={styles.storyUser}>Add Story</Text>
          </View>

          {/* Story Items */}
          {stories.map((story) => (
            <TouchableOpacity key={story.id} style={styles.storyItem}>
              <View style={[styles.storyCircle, !story.isSeen && styles.unseenStoryBorder]}>
                <Image source={{ uri: story.avatar }} style={styles.storyImage} />
              </View>
              <Text style={styles.storyUser} numberOfLines={1}>{story.user}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.sectionTitle}>Trending Now</Text>
    </View>
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.gridItem} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.gridImage} resizeMode="cover" />
      
      {/* 9:16 Badge */}
      <View style={styles.ratioBadge}>
        <Text style={styles.ratioText}>9:16</Text>
      </View>

      {/* Bottom Overlay */}
      <View style={styles.gridOverlay}>
        <Text style={styles.gridUsername}>{item.name}</Text>
        <View style={styles.viewsContainer}>
          <Ionicons name="eye-outline" size={12} color="#fff" />
          <Text style={styles.viewsText}> {item.views}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Loading Feed...</Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={COLUMN_COUNT}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
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
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700', // Gold
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  coinText: {
    fontWeight: '900',
    color: '#000',
    fontSize: 16,
  },
  pointsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pointsLabel: {
    color: '#888',
    fontSize: 10,
  },

  // --- STORIES ---
  storiesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  storiesScroll: {
    paddingHorizontal: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  storyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3, // Space for border
    marginBottom: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  unseenStoryBorder: {
    borderColor: '#FFD700', // Gold/Yellow border for active stories
  },
  addStoryCircle: {
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  addBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFD700',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  storyUser: {
    color: '#ccc',
    fontSize: 11,
    textAlign: 'center',
  },

  // --- GRID ---
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * ASPECT_RATIO, // Maintain 9:16 ratio
    padding: 1, // Tiny gap between items
    position: 'relative',
  },
  gridImage: {
    flex: 1,
    borderRadius: 6, // Slight rounded corners like screenshot
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
    // Simple gradient effect using opacity
    backgroundColor: 'rgba(0,0,0,0.3)', 
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
});