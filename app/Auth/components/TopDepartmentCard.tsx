import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopDepartmentCardProps {
  departmentName: string;
  patients: number;
  timePeriod: string;
}

export default function TopDepartmentCard({ departmentName, patients, timePeriod }: TopDepartmentCardProps) {
  return (
    <View className="bg-blue-500 rounded-lg p-6 shadow-sm">
      <View className="flex-row items-center gap-3 mb-2">
        <View className="w-12 h-12 bg-blue-400 rounded-full items-center justify-center">
          <Ionicons name="trophy" size={24} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-sm font-medium">Most Visited Department</Text>
          <Text className="text-white text-2xl font-bold">
            {departmentName}
          </Text>
        </View>
      </View>
      <Text className="text-white text-sm">
        {patients} patients visited {timePeriod.toLowerCase()}
      </Text>
    </View>
  );
}
