import CourseCard from '@/components/CourseCard';
import EventCard from '@/components/EventCard';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { DataService } from '@/services/DataService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCoursesLoading, setCoursesSuccess } from '@/store/slices/coursesSlice';
import { setEventsLoading, setEventsSuccess } from '@/store/slices/eventsSlice';
import { Course, Event } from '@/types';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
  const { colorScheme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // Redux state
  const coursesFromRedux = useAppSelector((state) => state.courses.items);
  const eventsFromRedux = useAppSelector((state) => state.events.items);
  const coursesLoading = useAppSelector((state) => state.courses.loading);
  const eventsLoading = useAppSelector((state) => state.events.loading);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'courses' | 'events'>('courses');
  const [refreshKey, setRefreshKey] = useState(0);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);

  // Load data from API and store in Redux
  useEffect(() => {
    loadData();
  }, [refreshKey]);

  // Update filtered data when search changes or Redux state updates
  useEffect(() => {
    if (searchQuery) {
      searchData();
    } else {
      setFilteredCourses(coursesFromRedux);
      setFilteredEvents(eventsFromRedux);
    }
  }, [searchQuery, coursesFromRedux, eventsFromRedux]);

  const loadData = async () => {
    dispatch(setCoursesLoading(true));
    dispatch(setCoursesLoading(true));
    dispatch(setEventsLoading(true));
    try {
      const [courses, events] = await Promise.all([
        DataService.getCourses(),
        DataService.getEvents(),
      ]);
      dispatch(setCoursesSuccess(courses));
      dispatch(setEventsSuccess(events));
      setFilteredCourses(courses);
      setFilteredEvents(events);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const searchData = async () => {
    try {
      const results = await DataService.searchContent(searchQuery);
      setFilteredCourses(results.courses);
      setFilteredEvents(results.events);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  const handleCoursePress = (course: Course) => {
    console.log('Course pressed:', course.id, course.title);
    router.push(`/modal?id=${course.id}&type=course`);
  };

  const handleEventPress = (event: Event) => {
    console.log('Event pressed:', event.id, event.title);
    router.push(`/modal?id=${event.id}&type=event`);
  };

  const handleRefresh = async () => {
    await DataService.clearCache();
    setRefreshKey(prev => prev + 1);
  };

  const loading = coursesLoading || eventsLoading;

  if (loading && coursesFromRedux.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading courses and events...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors[colorScheme ?? 'light'].background}
      />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
          ]}
          >
          <Feather
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
              <Feather
                name="x-circle"
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
              <Feather
                name="book"
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
            <Feather
              name="calendar"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
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
