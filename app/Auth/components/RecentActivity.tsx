import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function RecentActivity() {
  const recentActivities = [
    { id: 1, patient: 'John Smith', time: '10 mins ago', status: 'Checked In' },
    { id: 2, patient: 'Sarah Johnson', time: '25 mins ago', status: 'In Treatment' },
    { id: 3, patient: 'Mike Davis', time: '1 hour ago', status: 'Discharged' },
    { id: 4, patient: 'Emily Brown', time: '2 hours ago', status: 'Waiting' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Checked In':
        return { bg: 'bg-blue-100', text: 'text-blue-600' };
      case 'In Treatment':
        return { bg: 'bg-purple-100', text: 'text-purple-600' };
      case 'Discharged':
        return { bg: 'bg-green-100', text: 'text-green-600' };
      default:
        return { bg: 'bg-orange-100', text: 'text-orange-600' };
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-800 mb-2">Recent Activity</Text>
      <View className="bg-white rounded-lg shadow-sm overflow-hidden">
        {recentActivities.map((activity, index) => {
          const statusStyle = getStatusStyle(activity.status);
          return (
            <View 
              key={activity.id} 
              className={`flex-row items-center justify-between p-3 ${
                index !== recentActivities.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View className="flex-row items-center gap-2 flex-1">
                <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                  <Ionicons name="person" size={16} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-gray-800">{activity.patient}</Text>
                  <Text className="text-xs text-gray-500">{activity.time}</Text>
                </View>
              </View>
              <View className={`px-2 py-1 rounded-full ${statusStyle.bg}`}>
                <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                  {activity.status}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
