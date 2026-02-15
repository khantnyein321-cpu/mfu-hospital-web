/**
 * Patient Check-In Screen
 * Connected to Phoenix AI Backend
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { patientApi } from '@/src/services/api';
import { useQueueStore } from '@/src/stores/queueStore';

export default function CheckInScreen() {
  const [patientId, setPatientId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { setPatient, setLoading: setStoreLoading, language } = useQueueStore();

  const handleCheckIn = async () => {
    if (!patientId || !complaint) {
      Alert.alert(
        language === 'th' ? 'ข้อมูลไม่ครบ' : 'Missing Information',
        language === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill all fields'
      );
      return;
    }

    setLoading(true);
    setStoreLoading(true);

    try {
      console.log('🔵 Checking in patient:', patientId);
      
      const response = await patientApi.checkIn({
        patient_id: patientId,
        chief_complaint: complaint,
        language,
      });

      console.log('✅ Check-in successful:', response);

      // Save to Zustand store
      setPatient({
        patient_id: response.patient_id,
        queue_number: response.queue_number,
        current_station: response.current_station,
        position_in_queue: response.position_in_queue,
        estimated_wait_minutes: response.estimated_wait_minutes,
        complexity_score: response.complexity_score,
        check_in_time: response.timestamp,
        status: 'waiting',
        last_updated: new Date().toISOString(),
      });

      // Navigate to queue screen
      router.push('/(patient)/queue');
    } catch (error: any) {
      console.error('❌ Check-in failed:', error);
      Alert.alert(
        language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error',
        error.response?.data?.detail || (language === 'th' ? 'ไม่สามารถลงทะเบียนได้' : 'Check-in failed')
      );
    } finally {
      setLoading(false);
      setStoreLoading(false);
    }
  };

  const quickFillDemo = () => {
    setPatientId('P042');
    setComplaint('ปวดหัว มีไข้ ไอมาก');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-6">
        {/* Header */}
        <View className="bg-white rounded-2xl p-6 mb-4 shadow-lg">
          <View className="items-center mb-4">
            <Text className="text-4xl mb-2">🏥</Text>
            <Text className="text-2xl font-bold text-gray-800">
              {language === 'th' ? 'ลงทะเบียนผู้ป่วย' : 'Patient Check-In'}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {language === 'th' ? 'MFU Medical Center' : 'MFU Medical Center'}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Patient ID */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              {language === 'th' ? 'รหัสผู้ป่วย' : 'Patient ID'}
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-lg"
              placeholder={language === 'th' ? 'เช่น P001, P042' : 'e.g., P001, P042'}
              value={patientId}
              onChangeText={setPatientId}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          {/* Chief Complaint */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              {language === 'th' ? 'อาการของคุณวันนี้?' : 'Chief Complaint'}
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-base h-32"
              placeholder={
                language === 'th'
                  ? 'บอกอาการของคุณ เช่น ปวดหัว มีไข้ ไอมาก'
                  : 'Describe your symptoms...'
              }
              multiline
              textAlignVertical="top"
              value={complaint}
              onChangeText={setComplaint}
              editable={!loading}
            />
          </View>

          {/* Check-In Button */}
          <TouchableOpacity
            className={`bg-blue-600 rounded-xl p-4 items-center ${
              loading ? 'opacity-50' : ''
            }`}
            onPress={handleCheckIn}
            disabled={loading}
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="white" />
                <Text className="text-white font-bold text-lg ml-2">
                  {language === 'th' ? 'กำลังลงทะเบียน...' : 'Processing...'}
                </Text>
              </View>
            ) : (
              <Text className="text-white font-bold text-lg">
                {language === 'th' ? 'ลงทะเบียน' : 'Check In'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Demo Button */}
          <TouchableOpacity
            className="mt-3 border border-gray-300 rounded-xl p-3 items-center"
            onPress={quickFillDemo}
            disabled={loading}
          >
            <Text className="text-gray-600 font-semibold">
              🎬 {language === 'th' ? 'ใช้ข้อมูลตัวอย่าง (Demo)' : 'Quick Fill (Demo)'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mt-4">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <View className="flex-1">
              <Text className="text-blue-800 font-semibold mb-1">
                {language === 'th' ? 'หมายเหตุ' : 'Note'}
              </Text>
              <Text className="text-blue-700 text-sm leading-5">
                {language === 'th'
                  ? 'หลังจากลงทะเบียนแล้ว คุณจะได้รับหมายเลขคิว และระบบจะแจ้งเตือนเมื่อถึงคิวของคุณ'
                  : 'After check-in, you will receive a queue number and get notified when it\'s your turn.'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
