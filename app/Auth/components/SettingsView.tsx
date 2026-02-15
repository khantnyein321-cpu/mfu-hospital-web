import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsView() {
  const [isEditing, setIsEditing] = useState(false);
  const [accountInfo, setAccountInfo] = useState({
    fullName: 'Dr. Admin User',
    email: 'admin@mfuhospital.com',
    phone: '+66 81 234 5678',
    role: 'Hospital Administrator',
    department: 'Administration',
    employeeId: 'EMP-2024-001',
    joinDate: 'January 15, 2024',
  });

  return (
    <ScrollView>
      {/* Account Information Card */}
      <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3">
            <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white text-2xl font-bold">
                {accountInfo.fullName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text className="text-xl font-bold text-gray-800">{accountInfo.fullName}</Text>
              <Text className="text-sm text-gray-500">{accountInfo.role}</Text>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-blue-500 rounded-lg"
          >
            <Text className="text-white text-sm font-semibold">
              {isEditing ? 'Save' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4">
          {/* Employee ID */}
          <View className="border-b border-gray-200 pb-3">
            <Text className="text-xs text-gray-500 mb-1">Employee ID</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="id-card-outline" size={20} color="#6B7280" />
              <Text className="text-sm text-gray-800 font-medium">{accountInfo.employeeId}</Text>
            </View>
          </View>

          {/* Email */}
          <View className="border-b border-gray-200 pb-3">
            <Text className="text-xs text-gray-500 mb-1">Email Address</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              {isEditing ? (
                <TextInput
                  value={accountInfo.email}
                  onChangeText={(text) => setAccountInfo({...accountInfo, email: text})}
                  className="flex-1 text-sm text-gray-800 font-medium border border-gray-300 rounded px-2 py-1"
                  keyboardType="email-address"
                />
              ) : (
                <Text className="text-sm text-gray-800 font-medium">{accountInfo.email}</Text>
              )}
            </View>
          </View>

          {/* Phone */}
          <View className="border-b border-gray-200 pb-3">
            <Text className="text-xs text-gray-500 mb-1">Phone Number</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="call-outline" size={20} color="#6B7280" />
              {isEditing ? (
                <TextInput
                  value={accountInfo.phone}
                  onChangeText={(text) => setAccountInfo({...accountInfo, phone: text})}
                  className="flex-1 text-sm text-gray-800 font-medium border border-gray-300 rounded px-2 py-1"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-sm text-gray-800 font-medium">{accountInfo.phone}</Text>
              )}
            </View>
          </View>

          {/* Department */}
          <View className="border-b border-gray-200 pb-3">
            <Text className="text-xs text-gray-500 mb-1">Department</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="business-outline" size={20} color="#6B7280" />
              <Text className="text-sm text-gray-800 font-medium">{accountInfo.department}</Text>
            </View>
          </View>

          {/* Join Date */}
          <View className="pb-3">
            <Text className="text-xs text-gray-500 mb-1">Join Date</Text>
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text className="text-sm text-gray-800 font-medium">{accountInfo.joinDate}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Security Settings */}
      <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">Security Settings</Text>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <Ionicons name="key-outline" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-800">Change Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <Ionicons name="shield-checkmark-outline" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-800">Two-Factor Authentication</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="px-2 py-1 bg-green-100 rounded">
              <Text className="text-xs text-green-600 font-semibold">Enabled</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-800">Login History</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">Preferences</Text>
        
        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-800">Notifications</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-12 h-6 bg-blue-500 rounded-full items-end justify-center px-1">
              <View className="w-5 h-5 bg-white rounded-full" />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3 border-b border-gray-200">
          <View className="flex-row items-center gap-3">
            <Ionicons name="language-outline" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-800">Language</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-gray-500">English</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center justify-between py-3">
          <View className="flex-row items-center gap-3">
            <Ionicons name="color-palette-outline" size={20} color="#6B7280" />
            <Text className="text-sm text-gray-800">Theme</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-gray-500">Light</Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </View>
        </TouchableOpacity>
      </View>

      {/* System Information */}
      <View className="bg-white rounded-lg shadow-sm p-6 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">System Information</Text>
        
        <View className="py-3 border-b border-gray-200">
          <Text className="text-xs text-gray-500 mb-1">Application Version</Text>
          <Text className="text-sm text-gray-800">v1.0.0</Text>
        </View>

        <View className="py-3 border-b border-gray-200">
          <Text className="text-xs text-gray-500 mb-1">Last Updated</Text>
          <Text className="text-sm text-gray-800">February 15, 2026</Text>
        </View>

        <View className="py-3">
          <Text className="text-xs text-gray-500 mb-1">Server Status</Text>
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-green-500" />
            <Text className="text-sm text-gray-800">Online</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity className="bg-red-500 rounded-lg p-4 mb-6">
        <View className="flex-row items-center justify-center gap-2">
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold">Logout</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}
