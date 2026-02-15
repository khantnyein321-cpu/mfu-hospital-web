import React from 'react';
import { View, Text } from 'react-native';

export default function AllDepartments() {
  const departments = [
    { name: 'Cardio med', fullName: 'Cardiology Medicine', count: 45, percentage: '22%', color: 'bg-blue-500' },
    { name: 'Ortho', fullName: 'Orthopedics', count: 38, percentage: '19%', color: 'bg-green-500' },
    { name: 'Gen Sx', fullName: 'General Surgery', count: 32, percentage: '16%', color: 'bg-purple-500' },
    { name: 'ENT', fullName: 'Ear, Nose, and Throat', count: 28, percentage: '14%', color: 'bg-orange-500' },
    { name: 'EYE', fullName: 'Ophthalmology', count: 24, percentage: '12%', color: 'bg-pink-500' },
    { name: 'Cardio sx', fullName: 'Cardiothoracic Surgery', count: 18, percentage: '9%', color: 'bg-red-500' },
    { name: 'Neuro Sx', fullName: 'Neurosurgery', count: 10, percentage: '5%', color: 'bg-indigo-500' },
    { name: 'Plastic Sx', fullName: 'Plastic Surgery', count: 8, percentage: '4%', color: 'bg-yellow-500' },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-800 mb-3">All Departments - Today</Text>
      <View className="bg-white rounded-lg shadow-sm p-4">
        <View className="flex-row flex-wrap gap-3">
          {departments.map((dept, index) => (
            <View key={index} className="w-[48%] bg-gray-50 rounded-lg p-3 border border-gray-200">
              <View className="flex-row items-center gap-2 mb-2">
                <View className={`w-3 h-3 ${dept.color} rounded-full`} />
                <Text className="text-sm font-bold text-gray-800">{dept.name}</Text>
              </View>
              <Text className="text-xs text-gray-600 mb-2">{dept.fullName}</Text>
              <View className="flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-800">{dept.count}</Text>
                <Text className="text-xs text-gray-500">{dept.percentage}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
