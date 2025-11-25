import { Course, Event } from '@/types';

const OPEN_LIBRARY_API = 'https://openlibrary.org';
const DUMMYJSON_API = 'https://dummyjson.com';

class ApiService {
  // Fetch courses from Open Library API
  async fetchCoursesFromAPI(): Promise<Course[]> {
    try {
      // Fetch educational books from Open Library
      const subjects = ['computer_science', 'mathematics', 'engineering', 'business', 'design', 'science'];
      const courses: Course[] = [];

      for (let i = 0; i < subjects.length && courses.length < 8; i++) {
        const response = await fetch(
          `${OPEN_LIBRARY_API}/subjects/${subjects[i]}.json?limit=2`
        );

        if (response.ok) {
          const data = await response.json();
          
          data.works?.slice(0, 2).forEach((work: any, index: number) => {
            const randomRating = 4 + Math.random();
            const randomPrice = Math.floor(Math.random() * 100) + 20;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + (Math.floor(Math.random() * 8) + 4) * 7);

            courses.push({
              id: `${i}_${index}`,
              title: work.title || 'Educational Course',
              instructor: work.authors?.[0]?.name || 'Expert Instructor',
              duration: `${Math.floor(Math.random() * 8) + 4} weeks`,
              level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as any,
              rating: parseFloat(randomRating.toFixed(1)),
              enrolledCount: Math.floor(Math.random() * 5000) + 1000,
              price: Math.random() > 0.5 ? 0 : randomPrice,
              thumbnail: work.cover_id 
                ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
                : 'https://via.placeholder.com/300x200?text=Course',
              description: work.subject?.slice(0, 3).join(', ') || 'Comprehensive course content covering essential topics and practical applications.',
              category: subjects[i].replace('_', ' '),
              tags: work.subject?.slice(0, 3) || ['Education', 'Learning', subjects[i].replace('_', ' ')],
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
              location: Math.random() > 0.5 ? 'Online' : 'Campus - Main Building',
            });
          });
        }
      }

      return courses.slice(0, 8);
    } catch (error) {
      console.error('Error fetching courses from API:', error);
      return [];
    }
  }

  // Fetch events from Open Library API (education-related)
  async fetchEventsFromAPI(): Promise<Event[]> {
    try {
      // Use Open Library search API to get recent popular books for events
      const topics = [
        'artificial intelligence',
        'web development',
        'data science',
        'mobile programming',
        'cybersecurity',
        'machine learning',
        'software engineering',
        'cloud computing'
      ];
      
      const events: Event[] = [];
      const eventTypes = ['Workshop', 'Seminar', 'Conference', 'Webinar', 'Hackathon', 'Tech Talk'];
      const locations = ['Main Auditorium', 'Computer Lab 1', 'Engineering Building', 'Online', 'Lecture Hall A', 'Innovation Center'];

      for (let i = 0; i < Math.min(topics.length, 8); i++) {
        const topic = topics[i];
        const response = await fetch(
          `${OPEN_LIBRARY_API}/search.json?q=${encodeURIComponent(topic)}&limit=1`
        );

        if (response.ok) {
          const data = await response.json();
          const book = data.docs?.[0];

          if (book) {
            const eventType = eventTypes[i % eventTypes.length];
            const capacity = Math.floor(Math.random() * 100) + 50;
            const registered = Math.floor(capacity * (0.5 + Math.random() * 0.4));

            events.push({
              id: `event_${i}`,
              title: `${topic.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${eventType}`,
              date: this.getRandomFutureDate(),
              time: `${9 + (i % 6)}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
              location: locations[i % locations.length],
              organizer: 'UoM Tech Club',
              capacity: capacity,
              registered: registered,
              thumbnail: book.cover_i 
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
                : 'https://via.placeholder.com/300x200?text=Event',
              description: `Join us for an exciting ${eventType.toLowerCase()} on ${topic}. Learn from industry experts and enhance your skills in this cutting-edge field.`,
              tags: [topic.split(' ')[0], 'Education', 'Technology'],
              category: eventType,
              isOnline: locations[i % locations.length] === 'Online',
            });
          }
        }
      }

      return events.length > 0 ? events : this.getFallbackEvents();
    } catch (error) {
      console.error('Error fetching events from API:', error);
      return this.getFallbackEvents();
    }
  }

  // Fallback events if API fails
  private getFallbackEvents(): Event[] {
    const eventTypes = ['Workshop', 'Seminar', 'Conference', 'Webinar'];
    const topics = ['AI & Machine Learning', 'Web Development', 'Mobile App Development', 'Cybersecurity', 'Data Science', 'Cloud Computing', 'DevOps', 'Blockchain'];
    
    return topics.slice(0, 8).map((topic, i) => ({
      id: `fallback_${i}`,
      title: `${topic} ${eventTypes[i % eventTypes.length]}`,
      date: this.getRandomFutureDate(),
      time: `${10 + i}:00 AM`,
      location: i % 2 === 0 ? 'Online' : 'Main Auditorium',
      organizer: 'UoM Tech Club',
      capacity: 100,
      registered: 65 + i * 5,
      thumbnail: 'https://via.placeholder.com/300x200?text=Tech+Event',
      description: `An intensive ${eventTypes[i % eventTypes.length].toLowerCase()} focusing on ${topic.toLowerCase()}. Perfect for students looking to enhance their technical skills.`,
      tags: [topic.split(' ')[0], 'Education', 'Technology'],
      category: eventTypes[i % eventTypes.length],
      isOnline: i % 2 === 0,
    }));
  }

  // Get user data from DummyJSON
  async fetchUserProfile(userId: string): Promise<any> {
    try {
      const response = await fetch(`${DUMMYJSON_API}/users/${userId}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  }

  // Fetch demo users from DummyJSON
  async fetchDemoUsers(): Promise<any[]> {
    try {
      const response = await fetch(`${DUMMYJSON_API}/users?limit=5`);
      if (response.ok) {
        const data = await response.json();
        return data.users || [];
      }
    } catch (error) {
      console.error('Error fetching demo users:', error);
    }
    return [];
  }

  // Helper: Generate random future date
  private getRandomFutureDate(): string {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + Math.floor(Math.random() * 60) + 1));
    return futureDate.toISOString().split('T')[0];
  }
}

export default new ApiService();
