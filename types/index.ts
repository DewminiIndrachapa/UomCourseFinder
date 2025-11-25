export interface User {
  id: string;
  email: string;
  name: string;
  studentId: string;
  faculty: string;
  year: string;
  avatar?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  enrolledCount: number;
  thumbnail: string;
  startDate: string;
  endDate: string;
  location: string;
  price: number;
  tags: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  capacity: number;
  registered: number;
  thumbnail: string;
  tags: string[];
  isOnline: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export type ContentType = 'course' | 'event';

export interface SavedItem {
  id: string;
  type: ContentType;
  savedAt: string;
}
