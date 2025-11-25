import CourseCard from '@/components/CourseCard';
import EventCard from '@/components/EventCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DataService } from '@/services/DataService';
import { Course, Event } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SavedScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [savedCourses, setSavedCourses] = useState<Course[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState<'courses' | 'events'>('courses');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadSavedItems = async () => {
    const courses = await DataService.getSavedCourses();
    const events = await DataService.getSavedEvents();
    setSavedCourses(courses);
    setSavedEvents(events);
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedItems();
    }, [])
  );

  useEffect(() => {
    loadSavedItems();
  }, [refreshKey]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedItems();
    setRefreshing(false);
  };

  const handleCoursePress = (course: Course) => {
    router.push({
      pathname: '/modal',
      params: { id: course.id, type: 'course' },
    });
  };

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: '/modal',
      params: { id: event.id, type: 'event' },
    });
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors[colorScheme ?? 'light'].background}
      />

      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
          Saved
        </Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          Your bookmarked courses and events
        </Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'courses' && styles.activeTab,
            activeTab === 'courses' && { borderBottomColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={() => setActiveTab('courses')}
        >
          <Text
            style={[
              styles.tabText,
              { color: Colors[colorScheme ?? 'light'].tabIconDefault },
              activeTab === 'courses' && {
                color: Colors[colorScheme ?? 'light'].tint,
                fontWeight: '700',
              },
            ]}
          >
            Courses ({savedCourses.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'events' && styles.activeTab,
            activeTab === 'events' && { borderBottomColor: Colors[colorScheme ?? 'light'].tint },
          ]}
          onPress={() => setActiveTab('events')}
        >
          <Text
            style={[
              styles.tabText,
              { color: Colors[colorScheme ?? 'light'].tabIconDefault },
              activeTab === 'events' && {
                color: Colors[colorScheme ?? 'light'].tint,
                fontWeight: '700',
              },
            ]}
          >
            Events ({savedEvents.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors[colorScheme ?? 'light'].tint}
          />
        }
      >
        {activeTab === 'courses' ? (
          savedCourses.length > 0 ? (
            savedCourses.map((course) => (
              <CourseCard
                key={course.id + refreshKey}
                course={course}
                onPress={() => handleCoursePress(course)}
                onSaveToggle={handleRefresh}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="bookmark-outline"
                size={64}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
              />
              <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                No saved courses
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: Colors[colorScheme ?? 'light'].tabIconDefault },
                ]}
              >
                Bookmark courses to access them quickly
              </Text>
            </View>
          )
        ) : savedEvents.length > 0 ? (
          savedEvents.map((event) => (
            <EventCard
              key={event.id + refreshKey}
              event={event}
              onPress={() => handleEventPress(event)}
              onSaveToggle={handleRefresh}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="bookmark-outline"
              size={64}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
              No saved events
            </Text>
            <Text
              style={[
                styles.emptySubtext,
                { color: Colors[colorScheme ?? 'light'].tabIconDefault },
              ]}
            >
              Bookmark events to access them quickly
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
