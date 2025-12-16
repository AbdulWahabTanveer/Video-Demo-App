/**
 * SearchBar Component
 * Reusable search input component with controlled value
 */

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  value: string;
}

export function SearchBar({ onSearch, placeholder = 'Search content...', value }: SearchBarProps) {
  const colorScheme = useColorScheme();

  const handleChange = (text: string) => {
    onSearch(text);
  };

  const handleClear = () => {
    onSearch('');
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.searchContainer}>
        <IconSymbol
          name="magnifyingglass"
          size={20}
          color={Colors[colorScheme ?? 'light'].icon}
          style={styles.searchIcon}
        />
        <TextInput
          style={[
            styles.input,
            { color: Colors[colorScheme ?? 'light'].text },
          ]}
          placeholder={placeholder}
          placeholderTextColor={Colors[colorScheme ?? 'light'].icon}
          value={value}
          onChangeText={handleChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <IconSymbol
              name="xmark.circle.fill"
              size={20}
              color={Colors[colorScheme ?? 'light'].icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.15)',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
});

