import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DataService } from '@/services/DataService';
import { Course } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CourseCardProps {
  course: Course;
  onPress: () => void;
  onSaveToggle?: () => void;
}

export default function CourseCard({ course, onPress, onSaveToggle }: CourseCardProps) {
  const colorScheme = useColorScheme();
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
          <TouchableOpacity onPress={handleSaveToggle} style={styles.saveButton}>
            <Ionicons
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={isSaved ? '#4A90E2' : Colors[colorScheme ?? 'light'].icon}
            />
          </TouchableOpacity>
        </View>

        <Text 
          style={[styles.instructor, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]} 
          numberOfLines={1}
        >
          {course.instructor}
        </Text>

        <Text 
          style={[styles.description, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]} 
          numberOfLines={2}
        >
          {course.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.leftFooter}>
            <View style={[styles.levelBadge, { backgroundColor: getLevelColor(course.level) }]}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F39C12" />
              <Text style={[styles.rating, { color: Colors[colorScheme ?? 'light'].text }]}>
                {course.rating}
              </Text>
            </View>
          </View>
          
          <View style={styles.metaContainer}>
            <Ionicons 
              name="time-outline" 
              size={14} 
              color={Colors[colorScheme ?? 'light'].tabIconDefault} 
            />
            <Text style={[styles.metaText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              {course.duration}
            </Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {course.tags && course.tags.length > 0 && course.tags.slice(0, 3).map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tag, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}
            >
              <Text style={[styles.tagText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                {tag}
              </Text>
            </View>
          ))}
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
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    padding: 4,
  },
  instructor: {
    fontSize: 14,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  leftFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
