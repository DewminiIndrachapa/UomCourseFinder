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
          <TouchableOpacity onPress={handleSaveToggle} style={styles.saveButton}>
            <Feather
              name="bookmark"
              size={24}
              color={isSaved ? '#4A90E2' : Colors[colorScheme ?? 'light'].icon}
              fill={isSaved ? '#4A90E2' : 'none'}
            />
          </TouchableOpacity>
        </View>

        <Text 
          style={[styles.organizer, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]} 
          numberOfLines={1}
        >
          Organized by {event.organizer}
        </Text>

        <Text 
          style={[styles.description, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]} 
          numberOfLines={2}
        >
          {event.description}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather 
              name="calendar" 
              size={16} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {formatDate(event.date)}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Feather 
              name="clock" 
              size={16} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <Text style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {event.time}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Feather 
              name={event.isOnline ? 'video' : 'map-pin'} 
              size={16} 
              color={Colors[colorScheme ?? 'light'].tint} 
            />
            <Text 
              style={[styles.infoText, { color: Colors[colorScheme ?? 'light'].text }]} 
              numberOfLines={1}
            >
              {event.location}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.availabilityContainer}>
            <View style={[styles.availabilityDot, { backgroundColor: getAvailabilityColor() }]} />
            <Text style={[styles.availabilityText, { color: Colors[colorScheme ?? 'light'].text }]}>
              {availableSpots} spots left
            </Text>
          </View>

          <View style={styles.tagsContainer}>
            {event.tags && event.tags.length > 0 && event.tags.slice(0, 2).map((tag, index) => (
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
  organizer: {
    fontSize: 13,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: '45%',
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
