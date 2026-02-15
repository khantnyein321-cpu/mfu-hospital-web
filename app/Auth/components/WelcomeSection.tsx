import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeSectionProps {
  timePeriod: string;
  showDropdown: boolean;
  setTimePeriod: (period: string) => void;
  setShowDropdown: (show: boolean) => void;
}

export default function WelcomeSection({ 
  timePeriod, 
  showDropdown, 
  setTimePeriod, 
  setShowDropdown 
}: WelcomeSectionProps) {
  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-1">
        <View>
          <Text className="text-base font-semibold text-gray-800 mb-1">Welcome back!</Text>
          <Text className="text-sm text-gray-500">Here's what's happening today</Text>
        </View>
        
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
            <View className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-32">
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
    </View>
  );
}
