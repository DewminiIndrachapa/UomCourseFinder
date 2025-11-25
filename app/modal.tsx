import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DataService } from '@/services/DataService';
import { Course, Event } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, type } = params;

  const [isSaved, setIsSaved] = useState(false);
  const [content, setContent] = useState<Course | Event | null>(null);

  useEffect(() => {
    loadContent();
    checkSavedStatus();
  }, [id, type]);

  const loadContent = () => {
    if (type === 'course') {
      const course = DataService.getCourseById(id as string);
      setContent(course || null);
    } else if (type === 'event') {
      const event = DataService.getEventById(id as string);
      setContent(event || null);
    }
  };

  const checkSavedStatus = async () => {
    const saved = await DataService.isItemSaved(id as string, type as 'course' | 'event');
    setIsSaved(saved);
  };

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await DataService.unsaveItem(id as string, type as 'course' | 'event');
      } else {
        await DataService.saveItem(id as string, type as 'course' | 'event');
      }
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error toggling save:', error);
    }
  };

  if (!content) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Content not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isCourse = type === 'course';
  const courseData = isCourse ? (content as Course) : null;
  const eventData = !isCourse ? (content as Event) : null;

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors[colorScheme ?? 'light'].background}
      />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="close"
            size={28}
            color={Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSaveToggle} style={styles.saveButton}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color={isSaved ? '#4A90E2' : Colors[colorScheme ?? 'light'].text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Thumbnail */}
        <Image source={{ uri: content.thumbnail }} style={styles.thumbnail} />

        {/* Main Content */}
        <View style={styles.mainContent}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            {content.title}
          </Text>

          {isCourse && courseData && (
            <>
              <View style={styles.metaRow}>
                <View style={[styles.levelBadge, { backgroundColor: getLevelColor(courseData.level) }]}>
                  <Text style={styles.levelText}>{courseData.level}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={18} color="#F39C12" />
                  <Text style={[styles.rating, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {courseData.rating} ({courseData.enrolledCount} enrolled)
                  </Text>
                </View>
              </View>

              <View style={styles.instructorRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tint}
                />
                <Text style={[styles.instructor, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {courseData.instructor}
                </Text>
              </View>
            </>
          )}

          {eventData && (
            <>
              <Text
                style={[styles.organizer, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}
              >
                Organized by {eventData.organizer}
              </Text>

              <View style={styles.eventInfoContainer}>
                <View style={styles.eventInfoRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tint}
                  />
                  <Text style={[styles.eventInfo, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {formatDate(eventData.date)}
                  </Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons
                    name="time-outline"
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tint}
                  />
                  <Text style={[styles.eventInfo, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {eventData.time}
                  </Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons
                    name={eventData.isOnline ? 'videocam-outline' : 'location-outline'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tint}
                  />
                  <Text style={[styles.eventInfo, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {eventData.location}
                  </Text>
                </View>
                <View style={styles.eventInfoRow}>
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tint}
                  />
                  <Text style={[styles.eventInfo, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {eventData.registered} / {eventData.capacity} registered
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Description
            </Text>
            <Text
              style={[styles.description, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}
            >
              {content.description}
            </Text>
          </View>

          {/* Course Details */}
          {isCourse && courseData && (
            <>
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
                  Course Details
                </Text>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    Duration
                  </Text>
                  <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {courseData.duration}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    Location
                  </Text>
                  <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {courseData.location}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    Start Date
                  </Text>
                  <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {formatDate(courseData.startDate)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    End Date
                  </Text>
                  <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {formatDate(courseData.endDate)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                    Category
                  </Text>
                  <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                    {courseData.category}
                  </Text>
                </View>
              </View>
            </>
          )}

          {/* Tags */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
              Tags
            </Text>
            <View style={styles.tagsContainer}>
              {content.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' },
                  ]}
                >
                  <Text style={[styles.tagText, { color: Colors[colorScheme ?? 'light'].tint }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View
        style={[
          styles.footer,
          { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
        ]}
      >
        <TouchableOpacity
          style={[styles.ctaButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
        >
          <Text style={styles.ctaButtonText}>
            {isCourse ? 'Enroll Now' : 'Register for Event'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  thumbnail: {
    width: '100%',
    height: 250,
    backgroundColor: '#E1E8ED',
  },
  mainContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 34,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
  },
  instructorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  instructor: {
    fontSize: 16,
    fontWeight: '600',
  },
  organizer: {
    fontSize: 16,
    marginBottom: 20,
    fontStyle: 'italic',
  },
  eventInfoContainer: {
    marginBottom: 20,
    gap: 12,
  },
  eventInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  eventInfo: {
    fontSize: 16,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  detailLabel: {
    fontSize: 15,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
});
