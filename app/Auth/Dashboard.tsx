import React, { useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import WelcomeSection from './components/WelcomeSection';
import DepartmentCards from './components/DepartmentCards';
import AllDepartments from './components/AllDepartments';
import RecentActivity from './components/RecentActivity';
import BottomStats from './components/BottomStats';
import ReportsView from './components/ReportsView';
import PatientQueue from './components/PatientQueue';
import DoctorsView from './components/DoctorsView';
import RecordsView from './components/RecordsView';
import SettingsView from './components/SettingsView';
import ChatView from './components/ChatView';

interface DashboardProps {
  onNavigateToLogin?: () => void;
}

export default function Dashboard({ onNavigateToLogin }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [timePeriod, setTimePeriod] = useState('Today');
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <Header onNavigateToLogin={onNavigateToLogin} />

      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content */}
        <ScrollView className="flex-1 p-4">
          {activeTab === 'Dashboard' && (
            <>
              <WelcomeSection 
                timePeriod={timePeriod}
                showDropdown={showDropdown}
                setTimePeriod={setTimePeriod}
                setShowDropdown={setShowDropdown}
              />
              {/* System Status */}
              <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <Text className="text-sm font-semibold text-gray-800 mb-3">System Status</Text>
                <View className="flex-row items-center gap-2 py-2">
                  <View className="w-3 h-3 rounded-full bg-green-500" />
                  <Text className="text-sm text-gray-700">System Online</Text>
                </View>
                <View className="flex-row items-center gap-2 py-2">
                  <View className="w-3 h-3 rounded-full bg-green-500" />
                  <Text className="text-sm text-gray-700">AI Agent</Text>
                </View>
              </View>
              <DepartmentCards />
              <AllDepartments />
              <RecentActivity />
              <BottomStats />
            </>
          )}

          {activeTab === 'Reports' && (
            <ReportsView
              timePeriod={timePeriod}
              showDropdown={showDropdown}
              setTimePeriod={setTimePeriod}
              setShowDropdown={setShowDropdown}
            />
          )}

          {activeTab === 'Patients' && (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-1">Patient Queue Management</Text>
                <Text className="text-sm text-gray-500">Monitor and manage patients in queue</Text>
              </View>
              <PatientQueue />
            </>
          )}

          {activeTab === 'Doctors' && (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-1">Medical Staff</Text>
                <Text className="text-sm text-gray-500">View all doctors and their availability</Text>
              </View>
              <DoctorsView />
            </>
          )}

          {activeTab === 'Records' && (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-1">Patient Payment Records</Text>
                <Text className="text-sm text-gray-500">View all patient payment transactions</Text>
              </View>
              <RecordsView />
            </>
          )}

          {activeTab === 'Settings' && (
            <>
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-1">Account Settings</Text>
                <Text className="text-sm text-gray-500">Manage your account and preferences</Text>
              </View>
              <SettingsView />
            </>
          )}

            {activeTab === 'Chat' && (
              <ChatView />
            )}

          {(activeTab !== 'Dashboard' && activeTab !== 'Reports' && activeTab !== 'Patients' && activeTab !== 'Doctors' && activeTab !== 'Records' && activeTab !== 'Settings') && (
            <View className="bg-white rounded-lg p-6 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-2">{activeTab}</Text>
              <Text className="text-sm text-gray-500">This section is under development</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
