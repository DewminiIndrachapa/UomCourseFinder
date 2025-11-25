import { COURSES, EVENTS } from '@/constants/data';
import { Course, Event, SavedItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

const SAVED_ITEMS_KEY = '@saved_items';
const COURSES_CACHE_KEY = '@courses_cache';
const EVENTS_CACHE_KEY = '@events_cache';
const CACHE_TIMESTAMP_KEY = '@cache_timestamp';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class DataService {
  private static coursesCache: Course[] | null = null;
  private static eventsCache: Event[] | null = null;

  // Get all courses (with API integration and caching)
  static async getCourses(): Promise<Course[]> {
    try {
      // Return memory cache if available
      if (this.coursesCache) {
        return this.coursesCache;
      }

      // Check if cache is valid
      const cacheTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      const now = Date.now();

      if (cacheTimestamp && now - parseInt(cacheTimestamp) < CACHE_DURATION) {
        // Return cached data
        const cachedCourses = await AsyncStorage.getItem(COURSES_CACHE_KEY);
        if (cachedCourses) {
          this.coursesCache = JSON.parse(cachedCourses);
          console.log('✅ Loaded courses from cache');
          return this.coursesCache || [];
        }
      }

      // Fetch fresh data from API
      console.log('🌐 Fetching courses from Open Library API...');
      const apiCourses = await ApiService.fetchCoursesFromAPI();

      if (apiCourses.length > 0) {
        this.coursesCache = apiCourses;
        await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(apiCourses));
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        console.log('✅ Courses cached successfully');
        return apiCourses;
      }

      // Fallback to static data
      console.log('⚠️ Using fallback static courses data');
      return COURSES;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return COURSES;
    }
  }

  // Get all events (with API integration and caching)
  static async getEvents(): Promise<Event[]> {
    try {
      // Return memory cache if available
      if (this.eventsCache) {
        return this.eventsCache;
      }

      const cacheTimestamp = await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY);
      const now = Date.now();

      if (cacheTimestamp && now - parseInt(cacheTimestamp) < CACHE_DURATION) {
        const cachedEvents = await AsyncStorage.getItem(EVENTS_CACHE_KEY);
        if (cachedEvents) {
          this.eventsCache = JSON.parse(cachedEvents);
          console.log('✅ Loaded events from cache');
          return this.eventsCache || [];
        }
      }

      console.log('🌐 Fetching events from DummyJSON API...');
      const apiEvents = await ApiService.fetchEventsFromAPI();

      if (apiEvents.length > 0) {
        this.eventsCache = apiEvents;
        await AsyncStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(apiEvents));
        await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, now.toString());
        console.log('✅ Events cached successfully');
        return apiEvents;
      }

      console.log('⚠️ Using fallback static events data');
      return EVENTS;
    } catch (error) {
      console.error('Error fetching events:', error);
      return EVENTS;
    }
  }

  // Get course by ID
  static async getCourseById(id: string): Promise<Course | undefined> {
    const courses = await this.getCourses();
    return courses.find(course => course.id === id);
  }

  // Get event by ID
  static async getEventById(id: string): Promise<Event | undefined> {
    const events = await this.getEvents();
    return events.find(event => event.id === id);
  }

  // Search courses and events
  static async searchContent(query: string): Promise<{ courses: Course[]; events: Event[] }> {
    const lowerQuery = query.toLowerCase();
    const allCourses = await this.getCourses();
    const allEvents = await this.getEvents();
    
    const courses = allCourses.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.category.toLowerCase().includes(lowerQuery)
    );

    const events = allEvents.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    return { courses, events };
  }

  // Filter by category
  static async filterByCategory(category: string): Promise<{ courses: Course[]; events: Event[] }> {
    const allCourses = await this.getCourses();
    const allEvents = await this.getEvents();
    
    const courses = allCourses.filter(course => course.category === category);
    const events = allEvents.filter(event => event.category === category);
    return { courses, events };
  }

  // Get saved items
  static async getSavedItems(): Promise<SavedItem[]> {
    try {
      const savedItems = await AsyncStorage.getItem(SAVED_ITEMS_KEY);
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error('Error getting saved items:', error);
      return [];
    }
  }

  // Save an item
  static async saveItem(id: string, type: 'course' | 'event'): Promise<void> {
    try {
      const savedItems = await this.getSavedItems();
      const exists = savedItems.some(item => item.id === id && item.type === type);
      
      if (!exists) {
        const newItem: SavedItem = {
          id,
          type,
          savedAt: new Date().toISOString(),
        };
        savedItems.push(newItem);
        await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(savedItems));
      }
    } catch (error) {
      console.error('Error saving item:', error);
      throw error;
    }
  }

  // Unsave an item
  static async unsaveItem(id: string, type: 'course' | 'event'): Promise<void> {
    try {
      const savedItems = await this.getSavedItems();
      const filteredItems = savedItems.filter(item => !(item.id === id && item.type === type));
      await AsyncStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(filteredItems));
    } catch (error) {
      console.error('Error unsaving item:', error);
      throw error;
    }
  }

  // Check if item is saved
  static async isItemSaved(id: string, type: 'course' | 'event'): Promise<boolean> {
    try {
      const savedItems = await this.getSavedItems();
      return savedItems.some(item => item.id === id && item.type === type);
    } catch (error) {
      console.error('Error checking if item is saved:', error);
      return false;
    }
  }

  // Get saved courses
  static async getSavedCourses(): Promise<Course[]> {
    try {
      const savedItems = await this.getSavedItems();
      const courseIds = savedItems
        .filter(item => item.type === 'course')
        .map(item => item.id);
      const allCourses = await this.getCourses();
      return allCourses.filter(course => courseIds.includes(course.id));
    } catch (error) {
      console.error('Error getting saved courses:', error);
      return [];
    }
  }

  // Get saved events
  static async getSavedEvents(): Promise<Event[]> {
    try {
      const savedItems = await this.getSavedItems();
      const eventIds = savedItems
        .filter(item => item.type === 'event')
        .map(item => item.id);
      const allEvents = await this.getEvents();
      return allEvents.filter(event => eventIds.includes(event.id));
    } catch (error) {
      console.error('Error getting saved events:', error);
      return [];
    }
  }

  // Clear cache (for testing)
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        COURSES_CACHE_KEY,
        EVENTS_CACHE_KEY,
        CACHE_TIMESTAMP_KEY,
      ]);
      this.coursesCache = null;
      this.eventsCache = null;
      console.log('✅ Cache cleared - fresh data will be fetched from APIs');
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
}
