import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
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

const FACULTIES = [
  'Engineering',
  'Medicine',
  'Science',
  'Architecture',
  'Information Technology',
  'Business',
  'Graduate Studies',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];

export default function RegisterScreen() {
  const { colorScheme } = useTheme();
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    faculty: '',
    year: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showFacultyPicker, setShowFacultyPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    } else if (!/^\d{6}[A-Z]$/.test(formData.studentId)) {
      newErrors.studentId = 'Invalid format (e.g., 224090C)';
    }

    if (!formData.faculty) {
      newErrors.faculty = 'Please select your faculty';
    }

    if (!formData.year) {
      newErrors.year = 'Please select your year';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      // Navigation will be handled by root layout
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
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
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather
                name="arrow-left"
                size={24}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
            <Text style={[styles.title, { color: Colors[colorScheme ?? 'light'].text }]}>
              Create Account
            </Text>
            <Text style={[styles.subtitle, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
              Sign up to get started
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Full Name
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.name && styles.inputError,
                ]}
              >
                <Feather
                  name="user"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                  placeholder="John Doe"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                  value={formData.name}
                  onChangeText={(text) => updateField('name', text)}
                  autoCapitalize="words"
                />
              </View>
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Email */}
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
                  value={formData.email}
                  onChangeText={(text) => updateField('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Student ID */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Student ID
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.studentId && styles.inputError,
                ]}
              >
                <Feather
                  name="credit-card"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                  placeholder="224090C"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                  value={formData.studentId}
                  onChangeText={(text) => updateField('studentId', text.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={7}
                />
              </View>
              {errors.studentId && <Text style={styles.errorText}>{errors.studentId}</Text>}
            </View>

            {/* Faculty */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Faculty
              </Text>
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.faculty && styles.inputError,
                ]}
                onPress={() => setShowFacultyPicker(!showFacultyPicker)}
              >
                <Feather
                  name="briefcase"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <Text
                  style={[
                    styles.input,
                    { color: formData.faculty ? Colors[colorScheme ?? 'light'].text : Colors[colorScheme ?? 'light'].tabIconDefault },
                  ]}
                >
                  {formData.faculty || 'Select your faculty'}
                </Text>
                <Feather
                  name="chevron-down"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
              </TouchableOpacity>
              {errors.faculty && <Text style={styles.errorText}>{errors.faculty}</Text>}
              
              {showFacultyPicker && (
                <ScrollView 
                  style={[styles.picker, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}
                  nestedScrollEnabled={true}
                >
                  {FACULTIES.map((faculty) => (
                    <TouchableOpacity
                      key={faculty}
                      style={styles.pickerItem}
                      onPress={() => {
                        updateField('faculty', faculty);
                        setShowFacultyPicker(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {faculty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Year */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Year of Study
              </Text>
              <TouchableOpacity
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.year && styles.inputError,
                ]}
                onPress={() => setShowYearPicker(!showYearPicker)}
              >
                <Feather
                  name="calendar"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <Text
                  style={[
                    styles.input,
                    { color: formData.year ? Colors[colorScheme ?? 'light'].text : Colors[colorScheme ?? 'light'].tabIconDefault },
                  ]}
                >
                  {formData.year || 'Select your year'}
                </Text>
                <Feather
                  name="chevron-down"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
              </TouchableOpacity>
              {errors.year && <Text style={styles.errorText}>{errors.year}</Text>}
              
              {showYearPicker && (
                <ScrollView 
                  style={[styles.picker, { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground }]}
                  nestedScrollEnabled={true}
                >
                  {YEARS.map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={styles.pickerItem}
                      onPress={() => {
                        updateField('year', year);
                        setShowYearPicker(false);
                      }}
                    >
                      <Text style={[styles.pickerItemText, { color: Colors[colorScheme ?? 'light'].text }]}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Password */}
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
                  placeholder="Minimum 6 characters"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                  value={formData.password}
                  onChangeText={(text) => updateField('password', text)}
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
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: Colors[colorScheme ?? 'light'].text }]}>
                Confirm Password
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  { backgroundColor: Colors[colorScheme ?? 'light'].cardBackground },
                  errors.confirmPassword && styles.inputError,
                ]}
              >
                <Feather
                  name="lock"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
                <TextInput
                  style={[styles.input, { color: Colors[colorScheme ?? 'light'].text }]}
                  placeholder="Re-enter password"
                  placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateField('confirmPassword', text)}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Feather
                    name={showConfirmPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={Colors[colorScheme ?? 'light'].tabIconDefault}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                { backgroundColor: Colors[colorScheme ?? 'light'].tint },
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: Colors[colorScheme ?? 'light'].tabIconDefault }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={[styles.loginLink, { color: Colors[colorScheme ?? 'light'].tint }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
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
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
  picker: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    maxHeight: 200,
  },
  pickerItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  pickerItemText: {
    fontSize: 16,
  },
  registerButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
  },
});
