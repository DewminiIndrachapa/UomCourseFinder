import { COURSES, EVENTS } from '@/constants/data';
import { Course, Event, SavedItem } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_ITEMS_KEY = '@saved_items';

export class DataService {
  // Get all courses
  static getCourses(): Course[] {
    return COURSES;
  }

  // Get all events
  static getEvents(): Event[] {
    return EVENTS;
  }

  // Get course by ID
  static getCourseById(id: string): Course | undefined {
    return COURSES.find(course => course.id === id);
  }

  // Get event by ID
  static getEventById(id: string): Event | undefined {
    return EVENTS.find(event => event.id === id);
  }

  // Search courses and events
  static searchContent(query: string): { courses: Course[]; events: Event[] } {
    const lowerQuery = query.toLowerCase();
    
    const courses = COURSES.filter(course =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      course.category.toLowerCase().includes(lowerQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    const events = EVENTS.filter(event =>
      event.title.toLowerCase().includes(lowerQuery) ||
      event.description.toLowerCase().includes(lowerQuery) ||
      event.category.toLowerCase().includes(lowerQuery) ||
      event.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    return { courses, events };
  }

  // Filter by category
  static filterByCategory(category: string): { courses: Course[]; events: Event[] } {
    const courses = COURSES.filter(course => course.category === category);
    const events = EVENTS.filter(event => event.category === category);
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
      return COURSES.filter(course => courseIds.includes(course.id));
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
      return EVENTS.filter(event => eventIds.includes(event.id));
    } catch (error) {
      console.error('Error getting saved events:', error);
      return [];
    }
  }
}
