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
            courses.push({
              id: `${i}_${index}`,
              title: work.title || 'Educational Course',
              instructor: work.authors?.[0]?.name || 'Expert Instructor',
              duration: `${Math.floor(Math.random() * 8) + 4} weeks`,
              level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)] as any,
              rating: (4 + Math.random()).toFixed(1),
              students: Math.floor(Math.random() * 5000) + 1000,
              price: Math.random() > 0.5 ? 'Free' : `$${Math.floor(Math.random() * 100) + 20}`,
              thumbnail: work.cover_id 
                ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
                : 'https://via.placeholder.com/300x200?text=Course',
              description: work.subject?.slice(0, 3).join(', ') || 'Comprehensive course content covering essential topics and practical applications.',
              category: subjects[i].replace('_', ' '),
              syllabus: [
                'Introduction and fundamentals',
                'Core concepts and principles',
                'Practical applications',
                'Advanced techniques',
                'Final project',
              ],
              requirements: ['Basic understanding of the subject', 'Computer with internet connection'],
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

  // Fetch events from DummyJSON products (as event data)
  async fetchEventsFromAPI(): Promise<Event[]> {
    try {
      const response = await fetch(`${DUMMYJSON_API}/products?limit=8`);
      
      if (response.ok) {
        const data = await response.json();
        
        const events: Event[] = data.products.map((product: any, index: number) => ({
          id: product.id.toString(),
          title: `${product.title} Workshop`,
          date: this.getRandomFutureDate(),
          time: `${9 + (index % 8)}:00 AM`,
          location: ['Main Hall', 'Lab A', 'Conference Room', 'Auditorium', 'Room 301', 'Tech Hub'][index % 6],
          type: ['workshop', 'seminar', 'conference'][index % 3] as any,
          speaker: product.brand || 'Industry Expert',
          attendees: Math.floor(product.stock * 1.5),
          maxAttendees: product.stock * 2,
          thumbnail: product.thumbnail,
          description: product.description,
          tags: product.tags || ['Technology', 'Innovation'],
          agenda: [
            'Registration and Welcome',
            'Keynote Session',
            'Interactive Workshop',
            'Q&A Session',
            'Networking',
          ],
          organizer: 'UoM Tech Club',
        }));

        return events;
      }

      return [];
    } catch (error) {
      console.error('Error fetching events from API:', error);
      return [];
    }
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
