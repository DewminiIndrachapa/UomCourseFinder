import { LoginCredentials, RegisterData, User } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiService from './ApiService';

const AUTH_KEY = '@auth_user';
const USERS_KEY = '@registered_users';
const API_BASE_URL = 'https://dummyjson.com';

export class AuthService {
  // Get current user
  static async getCurrentUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Login with DummyJSON API
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // First try DummyJSON API authentication
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.email.split('@')[0], // Use email prefix as username
          password: credentials.password,
          expiresInMins: 30,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create user object from API response
        const user: User = {
          id: data.id.toString(),
          name: `${data.firstName} ${data.lastName}`,
          email: credentials.email,
          studentId: `${data.id}24090C`, // Generate student ID
          faculty: 'Information Technology',
          year: '3rd Year',
          createdAt: new Date().toISOString(),
        };

        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
        console.log('✅ Login successful via DummyJSON API');
        return { success: true, user };
      }

      // If API fails, check local storage
      const localUser = await this.loginLocal(credentials);
      if (localUser.success) {
        return localUser;
      }

      return { success: false, error: 'Invalid email or password' };
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to local authentication
      return await this.loginLocal(credentials);
    }
  }

  // Local login fallback
  private static async loginLocal(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      const user = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.id === credentials.password // Using id as password for demo
      );

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      console.log('✅ Login successful via local storage');
      return { success: true, user };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    }
  }

  // Register with DummyJSON API
  static async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Register with DummyJSON API
      const response = await fetch(`${API_BASE_URL}/users/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' ') || 'Student',
          email: data.email,
          username: data.email.split('@')[0],
          password: data.password,
        }),
      });

      if (response.ok) {
        const apiData = await response.json();
        
        const user: User = {
          id: apiData.id.toString(),
          name: data.name,
          email: data.email,
          studentId: data.studentId,
          faculty: data.faculty,
          year: data.year,
          createdAt: new Date().toISOString(),
        };

        // Save to local storage as well
        await this.saveUserLocally(user);
        await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));

        console.log('✅ Registration successful via DummyJSON API');
        return { success: true, user };
      }

      // Fallback to local registration
      return await this.registerLocal(data);
    } catch (error) {
      console.error('Registration error:', error);
      return await this.registerLocal(data);
    }
  }

  // Local registration fallback
  private static async registerLocal(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'Email already registered' };
      }

      // Check if student ID already exists
      const existingStudentId = users.find(u => u.studentId === data.studentId);
      if (existingStudentId) {
        return { success: false, error: 'Student ID already registered' };
      }

      const newUser: User = {
        id: data.password, // Using password as id for demo
        name: data.name,
        email: data.email,
        studentId: data.studentId,
        faculty: data.faculty,
        year: data.year,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));

      console.log('✅ Registration successful via local storage');
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  // Save user to local storage
  private static async saveUserLocally(user: User): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const existingIndex = users.findIndex(u => u.email === user.email);
      if (existingIndex >= 0) {
        users[existingIndex] = user;
      } else {
        users.push(user);
      }
      
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving user locally:', error);
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Update user profile
  static async updateProfile(user: User): Promise<{ success: boolean; error?: string }> {
    try {
      // Update in users list
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      // Update current user
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      return false;
    }
  }

  // Initialize demo users from DummyJSON API
  static async initializeDemoUser(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if already initialized
      if (users.length > 0) {
        console.log('✅ Demo users already initialized');
        return;
      }

      // Fetch users from DummyJSON API
      const apiUsers = await ApiService.fetchDemoUsers();
      
      if (apiUsers.length > 0) {
        const demoUsers: User[] = apiUsers.map((apiUser: any) => ({
          id: apiUser.id.toString(),
          name: `${apiUser.firstName} ${apiUser.lastName}`,
          email: apiUser.email,
          studentId: `${apiUser.id}24090C`,
          faculty: 'Information Technology',
          year: '3rd Year',
          createdAt: new Date().toISOString(),
        }));

        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
        console.log('✅ Demo users initialized from DummyJSON API');
        return;
      }

      // Fallback to hardcoded demo user
      await this.initializeLocalDemoUser();
    } catch (error) {
      console.error('Error initializing demo users:', error);
      await this.initializeLocalDemoUser();
    }
  }

  // Fallback demo user
  private static async initializeLocalDemoUser(): Promise<void> {
    const demoUser: User = {
      id: 'demo123',
      name: 'Demo Student',
      email: 'demo@uom.lk',
      studentId: '224090C',
      faculty: 'Information Technology',
      year: '3rd Year',
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([demoUser]));
    console.log('✅ Local demo user initialized');
  }
}
