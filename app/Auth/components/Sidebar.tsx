import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: '1', name: 'Dashboard', icon: 'grid-outline' },
    { id: '2', name: 'Patients', icon: 'people-outline' },
    { id: '3', name: 'Doctors', icon: 'medkit-outline' },
    { id: '4', name: 'Records', icon: 'document-text-outline' },
    { id: '5', name: 'Reports', icon: 'stats-chart-outline' },
    { id: '6', name: 'Settings', icon: 'settings-outline' },
    { id: '7', name: 'Chat', icon: 'chatbubble-ellipses-outline' },
  ];

  return (
    <View className="w-56 bg-white border-r border-gray-200">
      <ScrollView className="flex-1 py-4">
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setActiveTab(item.name)}
            className={`flex-row items-center px-4 py-3 mx-2 rounded-lg mb-1 ${
              activeTab === item.name ? 'bg-blue-500' : 'bg-transparent'
            }`}
          >
            <Ionicons
              name={item.icon as any}
              size={20}
              color={activeTab === item.name ? '#FFFFFF' : '#6B7280'}
            />
            <Text
              className={`ml-3 text-sm font-medium ${
                activeTab === item.name ? 'text-white' : 'text-gray-600'
              }`}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
