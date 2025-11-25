import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Text, View } from 'react-native';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const { user } = useAuth();

  const getFirstName = (name: string) => {
    return name.split(' ')[0];
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].background,
        },
        headerTitleStyle: {
          fontSize: 24,
          fontWeight: '700',
        },
        headerTintColor: Colors[colorScheme ?? 'light'].text,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? 'light'].cardBackground,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: () => (
            <View>
              <Text style={{ 
                fontSize: 20, 
                fontWeight: '700', 
                color: Colors[colorScheme ?? 'light'].text 
              }}>
                Hi, {user?.name ? getFirstName(user.name) : 'Student'}! 👋
              </Text>
            </View>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          headerTitle: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="compass" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          headerTitle: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="bookmark" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Feather name="user" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
