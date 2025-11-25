import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function LoginScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string; general?: string } = {};

    // Email validation
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Clear previous general error
    setErrors(prev => ({ ...prev, general: undefined }));
    
    if (!validateForm()) return;

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);

    if (result.success) {
      // Navigation will be handled by root layout
    } else {
      // Show inline error message
      const errorMessage = result.error || 'Invalid email or password. Please try again.';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      
      // Also show alert
      Alert.alert('Login Failed', errorMessage);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors[colorScheme ?? 'light'].background}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Feather
                name="book"
                size={60}
                color={Colors[colorScheme ?? 'light'].tint}
              />
            </View>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
              Welcome Back!
            </Text>
            <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              Sign in to continue to UoM Course Finder
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Email Address
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.email && styles.inputError,
                ]}
              >
                <Feather
                  name="mail"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                  placeholder="your.email@uom.lk"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.password && styles.inputError,
                ]}
              >
                <Feather
                  name="lock"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tabIconDefault}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* General Error Message (for incorrect credentials) */}
            {errors.general && (
              <View style={[styles.generalErrorContainer, { backgroundColor: '#FFEBEE', borderColor: '#E74C3C' }]}>
                <Feather name="alert-circle" size={20} color="#E74C3C" />
                <Text style={styles.generalErrorText}>{errors.general}</Text>
              </View>
            )}

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault }]} />
              <Text style={[styles.dividerText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                OR
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: Colors[colorScheme ?? 'light'].tabIconDefault }]} />
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={[styles.signupLink, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Demo Credentials */}
            <View style={styles.demoContainer}>
              <Text style={[styles.demoTitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                Demo Account:
              </Text>
              <Text style={[styles.demoText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                Email: demo@uom.lk
              </Text>
              <Text style={[styles.demoText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                Password: demo123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#E74C3C',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  generalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    gap: 10,
  },
  generalErrorText: {
    color: '#E74C3C',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    opacity: 0.2,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  demoContainer: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    alignItems: 'center',
  },
  demoTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 12,
    marginTop: 2,
  },
});
