import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Secure Storage Utility
 * Uses expo-secure-store for secure token storage on native platforms
 * Falls back to AsyncStorage for web
 */

const IS_WEB = Platform.OS === 'web';

export class SecureStorage {
  /**
   * Save a value securely
   */
  static async setItem(key: string, value: string): Promise<void> {
    if (IS_WEB) {
      // Fallback to localStorage for web
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  }

  /**
   * Retrieve a secure value
   */
  static async getItem(key: string): Promise<string | null> {
    if (IS_WEB) {
      // Fallback to localStorage for web
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    } else {
      return await SecureStore.getItemAsync(key);
    }
  }

  /**
   * Remove a secure value
   */
  static async removeItem(key: string): Promise<void> {
    if (IS_WEB) {
      // Fallback to localStorage for web
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }

  /**
   * Save auth token securely
   */
  static async saveAuthToken(token: string): Promise<void> {
    await this.setItem('auth_token', token);
  }

  /**
   * Get auth token
   */
  static async getAuthToken(): Promise<string | null> {
    return await this.getItem('auth_token');
  }

  /**
   * Remove auth token
   */
  static async removeAuthToken(): Promise<void> {
    await this.removeItem('auth_token');
  }

  /**
   * Save user data securely (as JSON)
   */
  static async saveUser(user: any): Promise<void> {
    await this.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Get user data
   */
  static async getUser(): Promise<any | null> {
    const userData = await this.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Remove user data
   */
  static async removeUser(): Promise<void> {
    await this.removeItem('user_data');
  }

  /**
   * Clear all secure storage
   */
  static async clearAll(): Promise<void> {
    await this.removeAuthToken();
    await this.removeUser();
  }
}
