import CategoryCard from '@/components/CategoryCard';
import CourseCard from '@/components/CourseCard';
import EventCard from '@/components/EventCard';
import { CATEGORIES } from '@/constants/data';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { DataService } from '@/services/DataService';
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
    TouchableOpacity,
    View,
} from 'react-native';

export default function ExploreScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'courses' | 'events'>('courses');
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [displayCourses, setDisplayCourses] = useState<Course[]>([]);
  const [displayEvents, setDisplayEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  useEffect(() => {
    filterByCategory();
  }, [selectedCategory, allCourses, allEvents]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [courses, events] = await Promise.all([
        DataService.getCourses(),
        DataService.getEvents(),
      ]);
      setAllCourses(courses);
      setAllEvents(events);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByCategory = async () => {
    if (selectedCategory) {
      const filtered = await DataService.filterByCategory(selectedCategory);
      setDisplayCourses(filtered.courses);
      setDisplayEvents(filtered.events);
    } else {
      setDisplayCourses(allCourses);
      setDisplayEvents(allEvents);
    }
  };

  const handleCategoryPress = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
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

  const handleRefresh = async () => {
    await DataService.clearCache();
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? 'light'].text }]}>
            Loading content...
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

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Categories
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => handleCategoryPress(category.name)}
              >
                <View
                  style={[
                    selectedCategory === category.name && styles.selectedCategoryWrapper,
                  ]}
                >
                  <CategoryCard
                    category={category}
                    onPress={() => handleCategoryPress(category.name)}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Selected Category Indicator */}
        {selectedCategory && (
          <View style={styles.filterBadge}>
            <Text style={[styles.filterText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Filtered by: {selectedCategory}
            </Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Feather
                name="x-circle"
                size={20}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </TouchableOpacity>
          </View>
        )}

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
              Courses ({displayCourses.length})
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
              Events ({displayEvents.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content List */}
        <View style={styles.listContainer}>
          {activeTab === 'courses' ? (
            displayCourses.length > 0 ? (
              displayCourses.map((course) => (
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
                  style={[
                    styles.emptySubtext,
                    { color: Colors[colorScheme ?? 'light'].tabIconDefault },
                  ]}
                >
                  Try selecting a different category
                </Text>
              </View>
            )
          ) : displayEvents.length > 0 ? (
            displayEvents.map((event) => (
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
                style={[
                  styles.emptySubtext,
                  { color: Colors[colorScheme ?? 'light'].tabIconDefault },
                ]}
              >
                Try selecting a different category
              </Text>
            </View>
          )}
        </View>
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
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  selectedCategoryWrapper: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  filterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    marginBottom: 16,
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
  listContainer: {
    paddingHorizontal: 20,
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
    textAlign: 'center',
  },
});
