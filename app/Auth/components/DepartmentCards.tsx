import React from 'react';
import { View, Text } from 'react-native';

export default function DepartmentCards() {
  const departments = [
    { name: 'Registration', count: 12, rate: '5 pax/hr', color: 'bg-green-500' },
    { name: 'Doctor', count: 45, rate: '2 pax/hr', color: 'bg-red-500' },
    { name: 'Pharmacy', count: 23, rate: '6 pax/hr', color: 'bg-yellow-500' },
    { name: 'Cashier', count: 8, rate: '10 pax', color: 'bg-green-500' },
  ];

  return (
    <View className="flex-row gap-3 mb-4">
      {departments.map((dept, index) => (
        <View key={index} className="flex-1 bg-gray-100 rounded-lg p-4">
          <Text className="text-sm font-semibold text-gray-800 mb-2">{dept.name}</Text>
          <View className="flex-row items-center gap-2 mb-1">
            <View className={`w-3 h-3 ${dept.color} rounded-full`} />
            <Text className="text-2xl font-bold text-gray-800">{dept.count}</Text>
          </View>
          <Text className="text-xs text-gray-500">({dept.rate})</Text>
        </View>
      ))}
    </View>
  );
}
