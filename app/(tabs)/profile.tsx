import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  if (!user) {
    return null;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
          ]}
        >
          <View
            style={[
              styles.avatar,
              { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' },
            ]}
          >
            <Text style={[styles.avatarText, { color: Colors[colorScheme ?? 'light'].tint }]}>
              {getInitials(user.name)}
            </Text>
          </View>

          <Text style={[styles.name, { color: Colors[colorScheme ?? 'light'].text }]}>
            {user.name}
          </Text>
          <Text style={[styles.studentId, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {user.studentId}
          </Text>
          <Text style={[styles.email, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
            {user.email}
          </Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Account Details
          </Text>

          <View
            style={[
              styles.detailCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
            ]}
          >
            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  Faculty
                </Text>
                <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {user.faculty}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '20' }]} />

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  Year of Study
                </Text>
                <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {user.year}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault + '20' }]} />

            <View style={styles.detailRow}>
              <View style={styles.detailIcon}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tint}
                />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                  Member Since
                </Text>
                <Text style={[styles.detailValue, { color: Colors[colorScheme ?? 'light'].text }]}>
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? 'light'].text }]}>
            Settings
          </Text>

          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
            ]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </View>
            <Text style={[styles.actionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Notifications
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
            ]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </View>
            <Text style={[styles.actionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Privacy & Security
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
            ]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </View>
            <Text style={[styles.actionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              Help & Support
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
            ]}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </View>
            <Text style={[styles.actionText, { color: Colors[colorScheme ?? 'light'].text }]}>
              About
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: '#E74C3C' }]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={[styles.version, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
          Version 1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  profileCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 16,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  detailCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
  },
});
