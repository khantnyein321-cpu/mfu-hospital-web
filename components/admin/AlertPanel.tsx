/**
 * Alert Panel Component
 * Displays active alerts and AI-generated action recommendations
 */

import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface AlertRecommendation {
  action: string;
  priority: number;
  estimated_impact: string;
}

interface Alert {
  alert_id: string;
  station: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  detected_at: string;
  recommendations: AlertRecommendation[];
  dismissed?: boolean;
}

interface AlertPanelProps {
  alerts: Alert[];
  onApplyAction?: (alertId: string, actionIndex: number) => void;
  onDismiss?: (alertId: string) => void;
  language?: 'th' | 'en';
}

const SEVERITY_CONFIG = {
  critical: {
    bg: 'bg-red-50',
    border: 'border-red-500',
    textColor: 'text-red-800',
    icon: '🔴',
    label: { th: 'วิกฤต', en: 'Critical' },
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-500',
    textColor: 'text-yellow-800',
    icon: '🟡',
    label: { th: 'เตือน', en: 'Warning' },
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-500',
    textColor: 'text-blue-800',
    icon: 'ℹ️',
    label: { th: 'ข้อมูล', en: 'Info' },
  },
};

const STATION_NAMES: Record<string, { th: string; en: string }> = {
  registration: { th: 'ลงทะเบียน', en: 'Registration' },
  screening: { th: 'คัดกรอง', en: 'Screening' },
  opd_gp: { th: 'พบแพทย์', en: 'Doctor' },
  pharmacy: { th: 'ห้องยา', en: 'Pharmacy' },
  cashier: { th: 'ชำระเงิน', en: 'Cashier' },
};

const formatTime = (timestamp: string): string => {
  try {
    return new Date(timestamp).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
};

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onApplyAction,
  onDismiss,
  language = 'th',
}) => {
  if (alerts.length === 0) {
    return (
      <View className="bg-white rounded-2xl p-6 shadow-lg mx-4 my-2">
        <View className="items-center py-8">
          <Text className="text-5xl mb-3">✅</Text>
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {language === 'th' ? 'ทุกอย่างเป็นปกติ' : 'All Systems Normal'}
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            {language === 'th'
              ? 'ไม่มีการแจ้งเตือนในขณะนี้'
              : 'No active alerts at this time'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-2xl p-6 shadow-lg mx-4 my-2">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <Text className="text-2xl mr-2">🤖</Text>
        <Text className="text-xl font-bold text-gray-800">
          {language === 'th' ? 'คำแนะนำจาก AI Agent' : 'AI Agent Recommendations'}
        </Text>
      </View>

      {/* Alerts List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {alerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const stationName = STATION_NAMES[alert.station]?.[language] || alert.station;

          return (
            <View
              key={alert.alert_id}
              className={`${config.bg} border-l-4 ${config.border} rounded-lg p-4 mb-4`}
            >
              {/* Alert Header */}
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-2xl mr-2">{config.icon}</Text>
                    <View>
                      <Text className={`font-bold ${config.textColor} text-lg`}>
                        {stationName}
                      </Text>
                      <Text className="text-xs text-gray-500">
                        [{formatTime(alert.detected_at)}]
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Alert Message */}
              <Text className={`${config.textColor} mb-3 leading-5`}>{alert.message}</Text>

              {/* Recommendations */}
              {alert.recommendations.length > 0 && (
                <View className="mb-3">
                  <Text className={`text-sm font-semibold ${config.textColor} mb-2`}>
                    💡 {language === 'th' ? 'แนะนำ:' : 'Suggestions:'}
                  </Text>
                  {alert.recommendations
                    .sort((a, b) => a.priority - b.priority)
                    .map((rec, index) => (
                      <View key={index} className="mb-2">
                        <View className="flex-row items-start">
                          <View className="bg-white rounded-full w-6 h-6 items-center justify-center mr-2 mt-0.5">
                            <Text className="text-xs font-bold text-gray-700">{index + 1}</Text>
                          </View>
                          <View className="flex-1">
                            <Text className={`${config.textColor} text-sm leading-5`}>
                              {rec.action}
                            </Text>
                            {rec.estimated_impact && (
                              <Text className="text-xs text-gray-600 mt-1">
                                → {rec.estimated_impact}
                              </Text>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                </View>
              )}

              {/* Action Buttons */}
              <View className="flex-row mt-3 space-x-2">
                {onApplyAction && alert.recommendations.length > 0 && (
                  <TouchableOpacity
                    className="bg-blue-600 px-4 py-2.5 rounded-lg flex-1 mr-2"
                    onPress={() => onApplyAction(alert.alert_id, 0)}
                  >
                    <Text className="text-white font-semibold text-center text-sm">
                      {language === 'th' ? 'ใช้การแนะนำที่ 1' : 'Apply Action 1'}
                    </Text>
                  </TouchableOpacity>
                )}

                {onDismiss && (
                  <TouchableOpacity
                    className="border border-gray-300 px-4 py-2.5 rounded-lg"
                    onPress={() => onDismiss(alert.alert_id)}
                  >
                    <Text className="text-gray-600 font-semibold text-center text-sm">
                      {language === 'th' ? 'ปิด' : 'Dismiss'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AlertPanel;
