import React from 'react';
import { View, Text } from 'react-native';

interface StatusItem {
  name: string;
  isOnline: boolean;
}

export default function SystemStatus() {
  const statusItems: StatusItem[] = [
    { name: 'System Online', isOnline: true },
    { name: 'AI Agent', isOnline: true },
  ];

  return (
    <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
      <Text className="text-sm font-semibold text-gray-800 mb-3">System Status</Text>
      
      {statusItems.map((item, index) => (
        <View 
          key={index} 
          className="flex-row items-center justify-between py-2"
        >
          <Text className="text-sm text-gray-700">{item.name}</Text>
          <View className="flex-row items-center gap-2">
            <View 
              className={`w-3 h-3 rounded-full ${
                item.isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Text className={`text-xs font-medium ${
              item.isOnline ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
