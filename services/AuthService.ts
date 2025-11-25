import { LoginCredentials, RegisterData, User } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@auth_user';
const USERS_KEY = '@registered_users';

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

  // Login
  static async login(credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Get registered users
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Find user with matching email and password
      // In production, password should be hashed
      const user = users.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase() && 
        u.id === credentials.password // Using id as password for demo
      );

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Save current user
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Register
  static async register(data: RegisterData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Passwords do not match' };
      }

      // Get existing users
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

      // Create new user
      const newUser: User = {
        id: data.password, // Using password as id for demo - in production use UUID
        email: data.email,
        name: data.name,
        studentId: data.studentId,
        faculty: data.faculty,
        year: data.year,
        createdAt: new Date().toISOString(),
      };

      // Add to users list
      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Set as current user
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(newUser));

      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
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

  // Initialize demo user (call this on app startup)
  static async initializeDemoUser(): Promise<void> {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];

      // Check if demo user already exists
      const demoExists = users.find(u => u.email === 'demo@uom.lk');
      if (!demoExists) {
        const demoUser: User = {
          id: 'demo123', // This is also the password
          email: 'demo@uom.lk',
          name: 'Demo Student',
          studentId: '224090C',
          faculty: 'Faculty of Engineering',
          year: 'Year 3',
          createdAt: new Date().toISOString(),
        };
        users.push(demoUser);
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        console.log('Demo user created successfully');
      }
    } catch (error) {
      console.error('Failed to initialize demo user:', error);
    }
  }
}
