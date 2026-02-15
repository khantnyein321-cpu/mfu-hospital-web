import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoginProps {
  onNavigateToDashboard?: () => void;
}

export default function Login({ onNavigateToDashboard }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    
    console.log('Login attempt:', { email, password });
    alert('Login successful!');
    
    // Navigate to Dashboard
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    }
  };

  return (
    <View style={styles.outerContainer}>
      
      {/* Header - Admin Login (Top Left) */}
      <View style={styles.headerContainer}>
        <Text style={styles.adminLoginText}>Admin Login</Text>
      </View>

      {/* Centered Content */}
      <View style={styles.centeredContent}>
        
        {/* Logo and MFU Text */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../../assets/csm_logo_mfu_3d_colour_630b77d675.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.mfuText}>(MFU Medical Center)</Text>
        </View>

        {/* White Login Card */}
        <View style={styles.loginCard}>
          
          <Text style={styles.instructionText}>
            Please fill in your unique admin login details below
          </Text>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, styles.passwordWrapper]}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={22} 
                  color="#9CA3AF" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity 
            onPress={handleSignIn}
            style={styles.signInButton}
            activeOpacity={0.85}
          >
            <Text style={styles.signInButtonText}>Sign In</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#C1271D',
  },
  headerContainer: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 30 : 60,
    left: 24,
    zIndex: 10,
  },
  adminLoginText: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '400',
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  mfuText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginCard: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: '85%',
    maxWidth: 450,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  instructionText: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: '#111827',
    fontSize: 15,
    padding: 0,
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 28,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
  signInButton: {
    backgroundColor: '#C1271D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#C1271D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
