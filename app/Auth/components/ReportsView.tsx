import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReportsViewProps {
  timePeriod: string;
  showDropdown: boolean;
  setTimePeriod: (period: string) => void;
  setShowDropdown: (show: boolean) => void;
}

export default function ReportsView({ 
  timePeriod, 
  showDropdown, 
  setTimePeriod, 
  setShowDropdown 
}: ReportsViewProps) {
  const departmentStats = {
    Today: [
      { name: 'Cardio med', patients: 45, percentage: 22, color: 'bg-blue-500' },
      { name: 'Ortho', patients: 38, percentage: 19, color: 'bg-green-500' },
      { name: 'Gen Sx', patients: 32, percentage: 16, color: 'bg-purple-500' },
      { name: 'ENT', patients: 28, percentage: 14, color: 'bg-orange-500' },
      { name: 'EYE', patients: 24, percentage: 12, color: 'bg-pink-500' },
      { name: 'Cardio sx', patients: 18, percentage: 9, color: 'bg-red-500' },
      { name: 'Neuro Sx', patients: 10, percentage: 5, color: 'bg-indigo-500' },
      { name: 'Plastic Sx', patients: 8, percentage: 4, color: 'bg-yellow-500' },
    ],
    'This Month': [
      { name: 'Cardio med', patients: 1350, percentage: 23, color: 'bg-blue-500' },
      { name: 'Ortho', patients: 1140, percentage: 19, color: 'bg-green-500' },
      { name: 'Gen Sx', patients: 960, percentage: 16, color: 'bg-purple-500' },
      { name: 'ENT', patients: 840, percentage: 14, color: 'bg-orange-500' },
      { name: 'EYE', patients: 720, percentage: 12, color: 'bg-pink-500' },
      { name: 'Cardio sx', patients: 540, percentage: 9, color: 'bg-red-500' },
      { name: 'Neuro Sx', patients: 300, percentage: 5, color: 'bg-indigo-500' },
      { name: 'Plastic Sx', patients: 150, percentage: 3, color: 'bg-yellow-500' },
    ],
  };

  return (
    <>
      {/* Reports Header with Dropdown */}
      <View className="mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-semibold text-gray-800">Department Reports</Text>
          
          {/* Time Period Dropdown */}
          <View className="relative">
            <TouchableOpacity
              onPress={() => setShowDropdown(!showDropdown)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 flex-row items-center gap-2"
            >
              <Text className="text-sm text-gray-700">{timePeriod}</Text>
              <Ionicons 
                name={showDropdown ? "chevron-up" : "chevron-down"} 
                size={16} 
                color="#6B7280" 
              />
            </TouchableOpacity>
            
            {showDropdown && (
              <View className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-32">
                <TouchableOpacity
                  onPress={() => {
                    setTimePeriod('Today');
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2 border-b border-gray-100"
                >
                  <Text className="text-sm text-gray-700">Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setTimePeriod('This Month');
                    setShowDropdown(false);
                  }}
                  className="px-4 py-2"
                >
                  <Text className="text-sm text-gray-700">This Month</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
        
        <Text className="text-sm text-gray-500">Number of patient visits to different departments {timePeriod.toLowerCase()}</Text>
      </View>

      {/* Bar Chart Graph */}
      <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <Text className="text-sm font-semibold text-gray-800 mb-2">Patient Visit Statistics</Text>
        <Text className="text-xs text-gray-500 mb-4">Number of patients visiting each department</Text>
        
        {/* Graph with Coordinates */}
        <View className="flex-row">
          {/* Y-axis labels */}
          <View className="justify-between items-end pr-2" style={{ height: 192 }}>
            {timePeriod === 'Today' ? (
              <>
                <Text className="text-xs text-gray-500">50</Text>
                <Text className="text-xs text-gray-500">40</Text>
                <Text className="text-xs text-gray-500">30</Text>
                <Text className="text-xs text-gray-500">20</Text>
                <Text className="text-xs text-gray-500">10</Text>
                <Text className="text-xs text-gray-500">0</Text>
              </>
            ) : (
              <>
                <Text className="text-xs text-gray-500">1500</Text>
                <Text className="text-xs text-gray-500">1200</Text>
                <Text className="text-xs text-gray-500">900</Text>
                <Text className="text-xs text-gray-500">600</Text>
                <Text className="text-xs text-gray-500">300</Text>
                <Text className="text-xs text-gray-500">0</Text>
              </>
            )}
          </View>

          {/* Graph area with grid */}
          <View className="flex-1">
            {/* Horizontal grid lines */}
            <View className="absolute left-0 right-0" style={{ height: 192 }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <View 
                  key={i} 
                  className="absolute left-0 right-0 border-t border-gray-200"
                  style={{ top: i * 32 }}
                />
              ))}
            </View>

            {/* Bars */}
            <View className="flex-row items-end justify-around gap-1 border-b-2 border-l-2 border-gray-400" style={{ height: 192 }}>
              {departmentStats[timePeriod as keyof typeof departmentStats].map((dept, index) => {
                const maxValue = timePeriod === 'Today' ? 50 : 1500;
                const barHeight = (dept.patients / maxValue) * 180;
                
                return (
                  <View key={index} className="flex-1 items-center justify-end">
                    {/* Value label above bar */}
                    <View className="mb-1">
                      <Text className="text-xs font-bold text-gray-800">{dept.patients}</Text>
                    </View>
                    {/* Bar */}
                    <View 
                      className={`w-full ${dept.color} rounded-t-lg items-center justify-center`}
                      style={{ height: Math.max(barHeight, 4) }}
                    >
                      {barHeight > 30 && (
                        <Text className="text-white text-xs font-bold">{dept.patients}</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* X-axis labels */}
            <View className="flex-row justify-around mt-2">
              {departmentStats[timePeriod as keyof typeof departmentStats].map((dept, index) => (
                <View key={index} className="flex-1 items-center">
                  <Text className="text-xs text-gray-600 font-medium text-center" numberOfLines={2}>{dept.name}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Axis Labels */}
        <View className="flex-row justify-between mt-3 px-2">
          <Text className="text-xs text-gray-500 font-semibold">Y-axis: Number of Patients</Text>
          <Text className="text-xs text-gray-500 font-semibold">X-axis: Departments</Text>
        </View>
        
        {/* Total Summary */}
        <View className="mt-3 pt-3 border-t border-gray-200">
          <Text className="text-sm text-center font-semibold text-gray-700">
            Total Visits: {departmentStats[timePeriod as keyof typeof departmentStats].reduce((sum, dept) => sum + dept.patients, 0)} patients
          </Text>
        </View>
      </View>

      {/* Detailed List */}
      <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <Text className="text-sm font-semibold text-gray-800 mb-4">Department Details</Text>
        
        {departmentStats[timePeriod as keyof typeof departmentStats].map((dept, index) => (
          <View key={index} className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3 flex-1">
              <View className={`w-4 h-4 ${dept.color} rounded`} />
              <Text className="text-sm font-medium text-gray-700">{dept.name}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-bold text-gray-800">{dept.patients} patients</Text>
              <Text className="text-xs text-gray-500">{dept.percentage}% of total</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Top Department Card */}
      <View className="bg-blue-500 rounded-lg p-6 shadow-sm">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 bg-blue-400 rounded-full items-center justify-center">
            <Ionicons name="trophy" size={24} color="white" />
          </View>
          <View className="flex-1">
            <Text className="text-white text-sm font-medium">Most Visited Department</Text>
            <Text className="text-white text-2xl font-bold">
              {departmentStats[timePeriod as keyof typeof departmentStats][0].name}
            </Text>
          </View>
        </View>
        <Text className="text-white text-sm">
          {departmentStats[timePeriod as keyof typeof departmentStats][0].patients} patients visited {timePeriod.toLowerCase()}
        </Text>
      </View>
    </>
  );
}
 