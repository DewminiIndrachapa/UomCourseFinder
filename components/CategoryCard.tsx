import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Category } from '@/types';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const { colorScheme } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <Feather 
          name={category.icon as any} 
          size={32} 
          color={category.color} 
        />
      </View>
      <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 120,
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
