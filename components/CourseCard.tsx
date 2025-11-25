import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { DataService } from '@/services/DataService';
import { Course } from '@/types';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  onSaveToggle?: () => void;
}

export default function CourseCard({ course, onPress, onSaveToggle }: CourseCardProps) {
  const { colorScheme } = useTheme();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    checkSavedStatus();
  }, [course.id]);

  const checkSavedStatus = async () => {
    const saved = await DataService.isItemSaved(course.id, 'course');
    setIsSaved(saved);
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await DataService.unsaveItem(course.id, 'course');
      } else {
        await DataService.saveItem(course.id, 'course');
      }
      setIsSaved(!isSaved);
      onSaveToggle?.();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return '#50C878';
      case 'Intermediate':
        return '#F39C12';
      case 'Advanced':
        return '#E74C3C';
      default:
        return '#95A5A6';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: course.thumbnail }} style={styles.thumbnail} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text 
            style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]} 
            numberOfLines={2}
          >
            {course.title}
          </Text>
          <TouchableOpacity 
            onPress={(e) => {
              e.stopPropagation();
              handleSaveToggle();
            }} 
            style={styles.bookmarkButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name="bookmark"
              size={24}
              color={isSaved ? Colors[colorScheme ?? 'light'].tint : Colors[colorScheme ?? 'light'].tabIconDefault}
              fill={isSaved ? Colors[colorScheme ?? 'light'].tint : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <Text 
          style={[styles.description, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]} 
          numberOfLines={2}
        >
          {course.description}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getLevelColor(course.level) }]}>
          <Text style={styles.statusText}>{course.level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  thumbnail: {
    width: '100%',
    height: 180,
    backgroundColor: '#E1E8ED',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  bookmarkButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
