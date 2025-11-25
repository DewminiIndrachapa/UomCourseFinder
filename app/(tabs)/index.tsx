import CourseCard from '@/components/CourseCard';
import EventCard from '@/components/EventCard';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { DataService } from '@/services/DataService';
import { Course, Event } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'events'>('courses');
  const [refreshKey, setRefreshKey] = useState(0);

  const allCourses = DataService.getCourses();
  const allEvents = DataService.getEvents();

  // Filter based on search
  const filteredCourses = searchQuery
    ? DataService.searchContent(searchQuery).courses
    : allCourses;

  const filteredEvents = searchQuery
    ? DataService.searchContent(searchQuery).events
    : allEvents;

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
        <View>
          <Text style={[styles.greeting, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            Welcome back!
          </Text>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            UoM Course Finder
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
          ]}
        >
          <Ionicons
            name="search"
            size={20}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <TextInput
            style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
            placeholder="Search courses and events..."
            placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={20}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
              />
            </TouchableOpacity>
          )}
        </View>
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
            Courses ({filteredCourses.length})
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
            Events ({filteredEvents.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'courses' ? (
          filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
                name="school-outline"
                size={64}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
              />
              <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
                No courses found
              </Text>
              <Text
                style={[styles.emptySubtext, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}
              >
                Try adjusting your search
              </Text>
            </View>
          )
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
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
              name="calendar-outline"
              size={64}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            <Text style={[styles.emptyText, { color: Colors[colorScheme ?? 'light'].text }]}>
              No events found
            </Text>
            <Text
              style={[styles.emptySubtext, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}
            >
              Try adjusting your search
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
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
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
  },
});
