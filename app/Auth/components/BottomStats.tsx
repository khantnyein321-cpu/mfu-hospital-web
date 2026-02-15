import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomStats() {
  return (
    <View className="flex-row gap-3 mb-4">
      <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text className="text-xs text-gray-600">Avg. Wait Time</Text>
        </View>
        <Text className="text-lg font-bold text-gray-800">25 min</Text>
      </View>
      
      <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="happy-outline" size={16} color="#6B7280" />
          <Text className="text-xs text-gray-600">Satisfaction</Text>
        </View>
        <Text className="text-lg font-bold text-gray-800">4.8/5.0</Text>
      </View>
    </View>
  );
}
