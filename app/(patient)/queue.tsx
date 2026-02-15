/**
 * Patient Queue Screen
 * Real-time queue tracking with WebSocket
 */

import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueueStore } from '@/src/stores/queueStore';
import { patientApi } from '@/src/services/api';
import { useWebSocket } from '@/src/services/websocket';
import QueueTicket from '@/components/patient/QueueTicket';
import JourneyTracker from '@/components/patient/JourneyTracker';

export default function QueueScreen() {
  const router = useRouter();
  const {
    currentPatient,
    updatePosition,
    updateJourney,
    updateStation,
    setConnected,
    language,
    clearPatient,
  } = useQueueStore();
  
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not checked in
  useEffect(() => {
    if (!currentPatient) {
      router.replace('/(patient)/check-in');
    }
  }, [currentPatient]);

  // WebSocket for real-time updates
  const { isConnected } = useWebSocket({
    clientId: `patient_${currentPatient?.patient_id || 'guest'}`,
    onMessage: (data) => {
      console.log('📨 WebSocket message:', data);
      
      if (data.event_type === 'queue_updated') {
        console.log('🔄 Queue updated:', data);
        updatePosition(data.position, data.estimated_wait);
        if (data.station) {
          updateStation(data.station);
        }
      } else if (data.event_type === 'notification_trigger') {
        console.log('🔔 Notification:', data);
        // Add notification to store
      }
    },
    onConnect: () => {
      console.log('✅ WebSocket connected');
      setConnected(true);
    },
    onDisconnect: () => {
      console.log('❌ WebSocket disconnected');
      setConnected(false);
    },
  });

  const onRefresh = async () => {
    if (!currentPatient) return;
    
    setRefreshing(true);
    try {
      console.log('🔄 Refreshing patient data...');
      
      const [statusData, journeyData] = await Promise.all([
        patientApi.getStatus(currentPatient.patient_id),
        patientApi.getJourney(currentPatient.patient_id),
      ]);

      console.log('✅ Status:', statusData);
      console.log('✅ Journey:', journeyData);

      updatePosition(statusData.position_in_queue, statusData.estimated_wait_minutes);
      updateStation(statusData.current_station);
      
      if (journeyData.journey) {
        updateJourney(journeyData.journey, journeyData.overall_progress_percent);
      }
    } catch (error) {
      console.error('❌ Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleClearData = async () => {
    if (!currentPatient) return;
    
    try {
      await patientApi.clearData(currentPatient.patient_id);
      clearPatient();
      router.replace('/(patient)/check-in');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };

  if (!currentPatient) {
    return null;
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Connection Status */}
      <View className="bg-white px-4 py-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`w-3 h-3 rounded-full mr-2 ${
              isConnected ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <Text className="text-sm text-gray-600">
            {isConnected
              ? language === 'th'
                ? '🔗 เชื่อมต่อแบบเรียลไทม์'
                : '🔗 Live'
              : language === 'th'
              ? '⚠️ กำลังเชื่อมต่อ...'
              : '⚠️ Connecting...'}
          </Text>
        </View>
        
        <TouchableOpacity onPress={onRefresh}>
          <Text className="text-blue-600 font-semibold">
            {language === 'th' ? '🔄 รีเฟรช' : '🔄 Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Queue Ticket */}
      <QueueTicket
        queueNumber={currentPatient.queue_number}
        position={currentPatient.position_in_queue}
        estimatedWait={currentPatient.estimated_wait_minutes}
        currentStation={currentPatient.current_station}
        language={language}
      />

      {/* Journey Tracker */}
      {currentPatient.journey && (
        <JourneyTracker
          steps={currentPatient.journey}
          overallProgress={currentPatient.overall_progress_percent}
          language={language}
        />
      )}

      {/* Complexity Info */}
      {currentPatient.complexity_score && (
        <View className="bg-white rounded-2xl p-6 shadow-lg mx-4 my-2">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            {language === 'th' ? '📊 การวิเคราะห์ AI' : '📊 AI Analysis'}
          </Text>
          
          <View className="bg-blue-50 rounded-xl p-4 mb-2">
            <Text className="text-sm text-gray-600 mb-1">
              {language === 'th' ? 'ความซับซ้อน' : 'Complexity'}
            </Text>
            <Text className="text-xl font-bold text-blue-700">
              {currentPatient.complexity_score.complexity}
            </Text>
          </View>
          
          <View className="bg-gray-50 rounded-xl p-4 mb-2">
            <Text className="text-sm text-gray-600 mb-1">
              {language === 'th' ? 'เวลาโดยประมาณ' : 'Estimated Duration'}
            </Text>
            <Text className="text-xl font-bold text-gray-800">
              {currentPatient.complexity_score.estimated_duration_minutes}{' '}
              {language === 'th' ? 'นาที' : 'min'}
            </Text>
          </View>
          
          {currentPatient.complexity_score.reasoning && (
            <View className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-3">
              <Text className="text-sm text-yellow-800">
                💭 {currentPatient.complexity_score.reasoning}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Debug/Demo Buttons */}
      <View className="mx-4 my-2">
        <TouchableOpacity
          className="bg-red-100 border border-red-300 rounded-xl p-3 items-center"
          onPress={handleClearData}
        >
          <Text className="text-red-700 font-semibold">
            🗑️ {language === 'th' ? 'ออกจากระบบ (Demo)' : 'Clear & Exit (Demo)'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
