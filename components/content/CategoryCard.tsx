/**
 * CategoryCard Component
 * Displays a category with icon and color
 */

import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Category } from '@/types';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface CategoryCardProps {
  category: Category;
  onPress?: () => void;
  isSelected?: boolean;
}

export function CategoryCard({ category, onPress, isSelected = false }: CategoryCardProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = isSelected
    ? category.color
    : Colors[colorScheme ?? 'light'].background;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor: isSelected ? category.color : Colors[colorScheme ?? 'light'].icon + '30',
        },
      ]}
      activeOpacity={0.7}>
      <IconSymbol
        name={category.icon as any}
        size={24}
        color={isSelected ? '#fff' : category.color}
      />
      <ThemedText
        style={[
          styles.name,
          { color: isSelected ? '#fff' : Colors[colorScheme ?? 'light'].text },
        ]}>
        {category.name}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

