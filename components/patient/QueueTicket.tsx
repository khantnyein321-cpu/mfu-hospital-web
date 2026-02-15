/**
 * Queue Ticket Component
 * Displays patient queue number, position, and estimated wait time
 */

import React from 'react';
import { View, Text } from 'react-native';

interface QueueTicketProps {
  queueNumber: number;
  position: number;
  estimatedWait: number;
  currentStation: string;
  language?: 'th' | 'en';
}

const STATION_NAMES: Record<string, { th: string; en: string }> = {
  registration: { th: 'ลงทะเบียน', en: 'Registration' },
  screening: { th: 'คัดกรอง', en: 'Screening' },
  opd_gp: { th: 'พบแพทย์ทั่วไป', en: 'Doctor (GP)' },
  opd_specialist: { th: 'พบแพทย์เชี่ยวชาญ', en: 'Specialist' },
  pharmacy: { th: 'ห้องยา', en: 'Pharmacy' },
  cashier: { th: 'ชำระเงิน', en: 'Cashier' },
  lab: { th: 'ห้องแล็บ', en: 'Laboratory' },
  xray: { th: 'เอ็กซเรย์', en: 'X-Ray' },
};

export const QueueTicket: React.FC<QueueTicketProps> = ({
  queueNumber,
  position,
  estimatedWait,
  currentStation,
  language = 'th',
}) => {
  const stationName = STATION_NAMES[currentStation]?.[language] || currentStation;
  const canLeave = estimatedWait > 60;
  const hoursAvailable = Math.floor(estimatedWait / 60);

  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg mx-4 my-2">
      {/* Header */}
      <View className="items-center mb-6 border-b border-gray-200 pb-4">
        <Text className="text-center text-gray-500 text-sm mb-1">
          {language === 'th' ? 'คิวของคุณ' : 'Your Queue'}
        </Text>
        <View className="flex-row items-baseline">
          <Text className="text-6xl font-bold text-blue-600">#{queueNumber}</Text>
        </View>
      </View>

      {/* Current Station */}
      <View className="bg-blue-50 rounded-xl p-4 mb-4">
        <Text className="text-xs text-gray-600 mb-1">
          {language === 'th' ? 'สถานี' : 'Station'}
        </Text>
        <Text className="text-lg font-bold text-blue-800">{stationName}</Text>
      </View>

      {/* Position & Wait Time */}
      <View className="flex-row justify-around mb-4">
        {/* Position */}
        <View className="flex-1 items-center bg-gray-50 rounded-xl p-4 mr-2">
          <Text className="text-xs text-gray-500 mb-1">
            {language === 'th' ? 'ตำแหน่ง' : 'Position'}
          </Text>
          <Text className="text-3xl font-bold text-gray-800">{position}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {language === 'th' ? 'ในคิว' : 'in queue'}
          </Text>
        </View>

        {/* Estimated Wait */}
        <View className="flex-1 items-center bg-gray-50 rounded-xl p-4 ml-2">
          <Text className="text-xs text-gray-500 mb-1">
            {language === 'th' ? 'เวลารอโดยประมาณ' : 'Estimated Wait'}
          </Text>
          <Text className="text-3xl font-bold text-orange-600">{estimatedWait}</Text>
          <Text className="text-xs text-gray-500 mt-1">
            {language === 'th' ? 'นาที' : 'minutes'}
          </Text>
        </View>
      </View>

      {/* Freedom to Roam Message */}
      {canLeave && (
        <View className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💡</Text>
            <View className="flex-1">
              <Text className="font-bold text-green-800 mb-1">
                {language === 'th' ? 'คุณมีเวลาเพียงพอ!' : 'You have time!'}
              </Text>
              <Text className="text-green-700 text-sm leading-5">
                {language === 'th'
                  ? `คุณมีเวลาประมาณ ${hoursAvailable} ชั่วโมง สามารถไปรับประทานอาหารหรือพักผ่อนได้`
                  : `You have about ${hoursAvailable} hour(s). Feel free to grab food or rest.`}
              </Text>
              <View className="mt-2">
                <Text className="text-green-600 text-xs">
                  {language === 'th'
                    ? '🍽️ Food Court (ชั้น 1) • ☕ M-Square'
                    : '🍽️ Food Court (Floor 1) • ☕ M-Square'}
                </Text>
              </View>
              <Text className="text-green-600 text-xs mt-2">
                {language === 'th'
                  ? '⚠️ เราจะแจ้งเตือนคุณ 10 นาทีก่อนถึงคิว'
                  : '⚠️ We will notify you 10 minutes before your turn'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Urgency Message */}
      {!canLeave && position <= 5 && (
        <View className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">⚠️</Text>
            <View className="flex-1">
              <Text className="font-bold text-yellow-800 mb-1">
                {language === 'th' ? 'เกือบถึงคิวของคุณ!' : 'Almost your turn!'}
              </Text>
              <Text className="text-yellow-700 text-sm">
                {language === 'th'
                  ? 'โปรดเตรียมตัวและอยู่ในบริเวณใกล้เคียง'
                  : 'Please prepare and stay nearby'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Critical Urgency */}
      {position <= 3 && (
        <View className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mt-2">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">🔔</Text>
            <View className="flex-1">
              <Text className="font-bold text-red-800 mb-1">
                {language === 'th' ? 'ถึงคิวของคุณแล้ว!' : "It's your turn soon!"}
              </Text>
              <Text className="text-red-700 text-sm font-semibold">
                {language === 'th'
                  ? 'โปรดกลับมาที่เคาน์เตอร์ทันที'
                  : 'Please return to the counter immediately'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Last Updated */}
      <Text className="text-center text-xs text-gray-400 mt-4">
        {language === 'th' ? 'อัปเดตล่าสุด' : 'Last updated'}: {new Date().toLocaleTimeString('th-TH')}
      </Text>
    </View>
  );
};

export default QueueTicket;
