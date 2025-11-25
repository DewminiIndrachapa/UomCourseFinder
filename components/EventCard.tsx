import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { DataService } from '@/services/DataService';
import { Event } from '@/types';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onSaveToggle?: () => void;
}

export default function EventCard({ event, onPress, onSaveToggle }: EventCardProps) {
  const { colorScheme } = useTheme();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    checkSavedStatus();
  }, [event.id]);

  const checkSavedStatus = async () => {
    const saved = await DataService.isItemSaved(event.id, 'event');
    setIsSaved(saved);
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await DataService.unsaveItem(event.id, 'event');
      } else {
        await DataService.saveItem(event.id, 'event');
      }
      setIsSaved(!isSaved);
      onSaveToggle?.();
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getAvailabilityColor = () => {
    const availableSpots = event.capacity - event.registered;
    const percentage = (availableSpots / event.capacity) * 100;
    
    if (percentage > 30) return '#50C878';
    if (percentage > 10) return '#F39C12';
    return '#E74C3C';
  };

  const availableSpots = event.capacity - event.registered;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image source={{ uri: event.thumbnail }} style={styles.thumbnail} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text 
            style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]} 
            numberOfLines={2}
          >
            {event.title}
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
          {event.description}
        </Text>

        <View style={[styles.statusBadge, { backgroundColor: getAvailabilityColor() }]}>
          <Text style={styles.statusText}>
            {availableSpots > 0 ? `${availableSpots} spots available` : 'Fully Booked'}
          </Text>
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
