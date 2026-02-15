/**
 * Station Card Component
 * Displays real-time metrics for a hospital station
 * Color-coded by status: optimal (green), normal (blue), warning (yellow), critical (red)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface StationCardProps {
  station: string;
  queue_length: number;
  average_wait_minutes: number;
  throughput_per_hour: number;
  status: 'optimal' | 'normal' | 'warning' | 'critical';
  active_staff: number;
  onPress?: () => void;
  language?: 'th' | 'en';
}

const STATION_NAMES: Record<string, { th: string; en: string }> = {
  registration: { th: 'ลงทะเบียน', en: 'Registration' },
  screening: { th: 'คัดกรอง', en: 'Screening' },
  opd_gp: { th: 'พบแพทย์', en: 'Doctor' },
  opd_specialist: { th: 'เชี่ยวชาญ', en: 'Specialist' },
  pharmacy: { th: 'ห้องยา', en: 'Pharmacy' },
  cashier: { th: 'ชำระเงิน', en: 'Cashier' },
  lab: { th: 'แล็บ', en: 'Lab' },
  xray: { th: 'เอ็กซเรย์', en: 'X-Ray' },
};

const STATUS_CONFIG = {
  optimal: {
    bg: 'bg-green-500',
    emoji: '🟢',
    textColor: 'text-white',
    ringColor: 'border-green-600',
    label: { th: 'ปกติ', en: 'Optimal' },
  },
  normal: {
    bg: 'bg-blue-500',
    emoji: '🔵',
    textColor: 'text-white',
    ringColor: 'border-blue-600',
    label: { th: 'ปกติ', en: 'Normal' },
  },
  warning: {
    bg: 'bg-yellow-500',
    emoji: '🟡',
    textColor: 'text-gray-900',
    ringColor: 'border-yellow-600',
    label: { th: 'ระวัง', en: 'Warning' },
  },
  critical: {
    bg: 'bg-red-500',
    emoji: '🔴',
    textColor: 'text-white',
    ringColor: 'border-red-600',
    label: { th: 'วิกฤต', en: 'Critical' },
  },
};

export const StationCard: React.FC<StationCardProps> = ({
  station,
  queue_length,
  average_wait_minutes,
  throughput_per_hour,
  status,
  active_staff,
  onPress,
  language = 'th',
}) => {
  const config = STATUS_CONFIG[status];
  const stationName = STATION_NAMES[station]?.[language] || station;

  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      className={`${config.bg} rounded-2xl p-5 mr-4 min-w-[200px] shadow-lg border-2 ${config.ringColor}`}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <Text className={`${config.textColor} font-bold text-lg`} numberOfLines={1}>
            {stationName}
          </Text>
          <Text className={`${config.textColor} opacity-80 text-xs mt-0.5`}>
            {config.label[language]}
          </Text>
        </View>
        <View className="ml-2">
          <Text className="text-4xl">{config.emoji}</Text>
        </View>
      </View>

      {/* Queue Length - Large Display */}
      <View className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
        <Text className={`${config.textColor} text-4xl font-bold text-center`}>
          {queue_length}
        </Text>
        <Text className={`${config.textColor} opacity-80 text-xs text-center mt-1`}>
          {language === 'th' ? 'คิว / คน' : 'Queue / Pax'}
        </Text>
      </View>

      {/* Metrics Grid */}
      <View className="flex-row justify-between items-center mb-3">
        {/* Average Wait */}
        <View className="flex-1">
          <Text className={`${config.textColor} opacity-70 text-xs`}>
            {language === 'th' ? 'รอเฉลี่ย' : 'Avg Wait'}
          </Text>
          <View className="flex-row items-baseline">
            <Text className={`${config.textColor} font-bold text-2xl`}>{average_wait_minutes}</Text>
            <Text className={`${config.textColor} opacity-80 text-xs ml-1`}>
              {language === 'th' ? 'นท' : 'm'}
            </Text>
          </View>
        </View>

        {/* Throughput */}
        <View className="flex-1 items-end">
          <Text className={`${config.textColor} opacity-70 text-xs`}>
            {language === 'th' ? 'อัตรา' : 'Rate'}
          </Text>
          <View className="flex-row items-baseline">
            <Text className={`${config.textColor} font-bold text-2xl`}>
              {throughput_per_hour.toFixed(1)}
            </Text>
            <Text className={`${config.textColor} opacity-80 text-xs ml-1`}>
              {language === 'th' ? '/ชม' : '/hr'}
            </Text>
          </View>
        </View>
      </View>

      {/* Staff Count */}
      <View className="bg-white/10 rounded-lg p-2 flex-row items-center justify-center">
        <Text className="text-xl mr-2">👥</Text>
        <Text className={`${config.textColor} font-semibold text-sm`}>
          {active_staff} {language === 'th' ? 'พนักงาน' : 'Staff'}
        </Text>
      </View>

      {/* Pulse Animation for Critical Status */}
      {status === 'critical' && (
        <View className="absolute -top-1 -right-1">
          <View className="w-4 h-4 bg-red-700 rounded-full animate-ping" />
        </View>
      )}
    </CardWrapper>
  );
};

export default StationCard;
