import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  onNavigateToLogin?: () => void;
}

export default function Header({ onNavigateToLogin }: HeaderProps) {
  return (
    <View className="bg-white px-4 py-3 shadow-sm">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-red-600">
            MFU Hospital
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity className="w-8 h-8 items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNavigateToLogin} className="w-8 h-8 bg-gray-200 rounded-full items-center justify-center">
            <Ionicons name="person-outline" size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
