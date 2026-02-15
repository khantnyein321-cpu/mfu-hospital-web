/**
 * Journey Tracker Component
 * Visualizes patient progress through hospital stations
 */

import React from 'react';
import { View, Text, ScrollView } from 'react-native';

interface JourneyStep {
  station: string;
  status: 'pending' | 'waiting' | 'in_progress' | 'completed' | 'skipped';
  position?: number;
  estimated_wait?: number;
  entry_time?: string;
  exit_time?: string;
  duration_minutes?: number;
}

interface JourneyTrackerProps {
  steps: JourneyStep[];
  language?: 'th' | 'en';
  overallProgress?: number;
}

const STATION_NAMES: Record<string, { th: string; en: string; icon: string }> = {
  registration: { th: 'ลงทะเบียน', en: 'Registration', icon: '📝' },
  screening: { th: 'คัดกรอง', en: 'Screening', icon: '🩺' },
  opd_gp: { th: 'พบแพทย์ทั่วไป', en: 'Doctor (GP)', icon: '👨‍⚕️' },
  opd_specialist: { th: 'พบแพทย์เชี่ยวชาญ', en: 'Specialist', icon: '👩‍⚕️' },
  pharmacy: { th: 'ห้องยา', en: 'Pharmacy', icon: '💊' },
  cashier: { th: 'ชำระเงิน', en: 'Cashier', icon: '💳' },
  lab: { th: 'ห้องแล็บ', en: 'Laboratory', icon: '🧪' },
  xray: { th: 'เอ็กซเรย์', en: 'X-Ray', icon: '🩸' },
};

const STATUS_CONFIG = {
  completed: {
    icon: '✅',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    lineColor: 'bg-green-500',
  },
  waiting: {
    icon: '🔵',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    lineColor: 'bg-blue-400',
  },
  in_progress: {
    icon: '⏳',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500',
    lineColor: 'bg-orange-400',
  },
  pending: {
    icon: '⚪',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    lineColor: 'bg-gray-300',
  },
  skipped: {
    icon: '⏩',
    color: 'text-gray-400',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-300',
    lineColor: 'bg-gray-300',
  },
};

const formatTime = (timeString?: string): string => {
  if (!timeString) return '';
  try {
    return new Date(timeString).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  steps,
  language = 'th',
  overallProgress,
}) => {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg mx-4 my-2">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          {language === 'th' ? 'การเดินทางของคุณ' : 'Your Journey'}
        </Text>
        
        {/* Progress Bar */}
        {overallProgress !== undefined && (
          <View className="mt-3">
            <View className="flex-row justify-between mb-1">
              <Text className="text-xs text-gray-500">
                {language === 'th' ? 'ความคืบหน้า' : 'Progress'}
              </Text>
              <Text className="text-xs font-bold text-blue-600">{overallProgress}%</Text>
            </View>
            <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <View
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${overallProgress}%` }}
              />
            </View>
          </View>
        )}
      </View>

      {/* Journey Steps */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {steps.map((step, index) => {
          const config = STATUS_CONFIG[step.status];
          const stationInfo = STATION_NAMES[step.station] || {
            th: step.station,
            en: step.station,
            icon: '🏥',
          };
          const stationName = stationInfo[language];
          const isLast = index === steps.length - 1;

          return (
            <View key={index} className="mb-4">
              {/* Step Content */}
              <View className="flex-row">
                {/* Left Side - Icon & Line */}
                <View className="items-center mr-4">
                  {/* Status Icon */}
                  <View
                    className={`w-12 h-12 rounded-full ${config.bgColor} border-2 ${config.borderColor} items-center justify-center`}
                  >
                    <Text className="text-2xl">{config.icon}</Text>
                  </View>

                  {/* Connecting Line */}
                  {!isLast && (
                    <View className={`w-1 flex-1 min-h-[40px] ${config.lineColor} my-1`} />
                  )}
                </View>

                {/* Right Side - Content */}
                <View className="flex-1 pb-4">
                  {/* Station Name & Icon */}
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg">{stationInfo.icon}</Text>
                    <Text className={`ml-2 text-lg font-semibold ${config.color}`}>
                      {stationName}
                    </Text>
                  </View>

                  {/* Status Details */}
                  {step.status === 'completed' && (
                    <View>
                      {step.exit_time && (
                        <Text className="text-sm text-green-600 mb-1">
                          {language === 'th' ? 'เสร็จแล้ว' : 'Completed'}: {formatTime(step.exit_time)}
                        </Text>
                      )}
                      {step.duration_minutes && (
                        <Text className="text-xs text-gray-500">
                          {language === 'th' ? 'ใช้เวลา' : 'Duration'}: {step.duration_minutes}{' '}
                          {language === 'th' ? 'นาที' : 'min'}
                        </Text>
                      )}
                    </View>
                  )}

                  {step.status === 'waiting' && (
                    <View className="bg-blue-50 rounded-lg p-3 mt-2">
                      {step.position && (
                        <Text className="text-sm text-blue-700 font-semibold mb-1">
                          {language === 'th' ? 'ตำแหน่งที่' : 'Position'}: {step.position}
                        </Text>
                      )}
                      {step.estimated_wait && (
                        <View className="flex-row items-center">
                          <Text className="text-2xl mr-2">⏱️</Text>
                          <Text className="text-sm text-blue-600">
                            {language === 'th' ? 'เหลืออีกประมาณ' : 'About'} ~{step.estimated_wait}{' '}
                            {language === 'th' ? 'นาที' : 'min'}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}

                  {step.status === 'in_progress' && (
                    <View className="bg-orange-50 rounded-lg p-3 mt-2">
                      <View className="flex-row items-center">
                        <Text className="text-2xl mr-2">👨‍⚕️</Text>
                        <Text className="text-sm text-orange-700 font-semibold">
                          {language === 'th'
                            ? 'กำลังดำเนินการ...'
                            : 'In progress...'}
                        </Text>
                      </View>
                      {step.entry_time && (
                        <Text className="text-xs text-gray-500 mt-1">
                          {language === 'th' ? 'เริ่ม' : 'Started'}: {formatTime(step.entry_time)}
                        </Text>
                      )}
                    </View>
                  )}

                  {step.status === 'pending' && (
                    <Text className="text-sm text-gray-500 italic mt-1">
                      ({language === 'th' ? 'ถัดไป' : 'Next'})
                    </Text>
                  )}

                  {step.status === 'skipped' && (
                    <Text className="text-sm text-gray-400 italic mt-1">
                      ({language === 'th' ? 'ข้าม' : 'Skipped'})
                    </Text>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer Info */}
      <View className="mt-4 pt-4 border-t border-gray-200">
        <Text className="text-center text-xs text-gray-500">
          {language === 'th'
            ? '📡 อัปเดตแบบเรียลไทม์'
            : '📡 Real-time updates'}
        </Text>
      </View>
    </View>
  );
};

export default JourneyTracker;
