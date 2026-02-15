import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PatientRecord {
  id: number;
  patientName: string;
  patientId: string;
  department: string;
  service: string;
  amount: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Insurance';
  date: string;
  time: string;
  status: 'Paid' | 'Partially Paid' | 'Pending';
}

export default function RecordsView() {
  const records: PatientRecord[] = [
    { id: 1, patientName: 'John Smith', patientId: 'P-2024-001', department: 'Cardio med', service: 'Consultation + ECG', amount: 1500, paymentMethod: 'Insurance', date: '2024-02-15', time: '09:30 AM', status: 'Paid' },
    { id: 2, patientName: 'Sarah Johnson', patientId: 'P-2024-002', department: 'Ortho', service: 'X-Ray + Consultation', amount: 2800, paymentMethod: 'Credit Card', date: '2024-02-15', time: '10:15 AM', status: 'Paid' },
    { id: 3, patientName: 'Mike Davis', patientId: 'P-2024-003', department: 'ENT', service: 'Hearing Test', amount: 800, paymentMethod: 'Cash', date: '2024-02-15', time: '11:00 AM', status: 'Paid' },
    { id: 4, patientName: 'Emily Brown', patientId: 'P-2024-004', department: 'Gen Sx', service: 'Minor Surgery', amount: 15000, paymentMethod: 'Insurance', date: '2024-02-15', time: '08:45 AM', status: 'Partially Paid' },
    { id: 5, patientName: 'David Wilson', patientId: 'P-2024-005', department: 'EYE', service: 'Eye Examination', amount: 1200, paymentMethod: 'Cash', date: '2024-02-15', time: '01:30 PM', status: 'Paid' },
    { id: 6, patientName: 'Lisa Anderson', patientId: 'P-2024-006', department: 'Cardio sx', service: 'Cardiac Consultation', amount: 2500, paymentMethod: 'Credit Card', date: '2024-02-15', time: '02:00 PM', status: 'Paid' },
    { id: 7, patientName: 'James Taylor', patientId: 'P-2024-007', department: 'Neuro Sx', service: 'MRI Scan', amount: 8500, paymentMethod: 'Insurance', date: '2024-02-15', time: '03:15 PM', status: 'Paid' },
    { id: 8, patientName: 'Maria Garcia', patientId: 'P-2024-008', department: 'Plastic Sx', service: 'Consultation', amount: 1000, paymentMethod: 'Cash', date: '2024-02-15', time: '04:00 PM', status: 'Paid' },
    { id: 9, patientName: 'Robert Lee', patientId: 'P-2024-009', department: 'Ortho', service: 'Physiotherapy Session', amount: 1500, paymentMethod: 'Cash', date: '2024-02-14', time: '10:30 AM', status: 'Paid' },
    { id: 10, patientName: 'Jennifer White', patientId: 'P-2024-010', department: 'Cardio med', service: 'Stress Test', amount: 3500, paymentMethod: 'Insurance', date: '2024-02-14', time: '02:45 PM', status: 'Paid' },
    { id: 11, patientName: 'Michael Brown', patientId: 'P-2024-011', department: 'ENT', service: 'Surgery', amount: 25000, paymentMethod: 'Insurance', date: '2024-02-14', time: '09:00 AM', status: 'Partially Paid' },
    { id: 12, patientName: 'Patricia Davis', patientId: 'P-2024-012', department: 'EYE', service: 'Cataract Surgery', amount: 35000, paymentMethod: 'Insurance', date: '2024-02-13', time: '11:30 AM', status: 'Paid' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' };
      case 'Partially Paid':
        return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' };
      default:
        return { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-300' };
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'Cash':
        return 'cash-outline';
      case 'Credit Card':
        return 'card-outline';
      default:
        return 'shield-checkmark-outline';
    }
  };

  const totalRevenue = records.reduce((sum, record) => sum + record.amount, 0);
  const paidCount = records.filter(r => r.status === 'Paid').length;
  const partiallyPaidCount = records.filter(r => r.status === 'Partially Paid').length;

  return (
    <View>
      {/* Summary Stats */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-blue-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Total Records</Text>
          <Text className="text-white text-3xl font-bold">{records.length}</Text>
        </View>
        
        <View className="flex-1 bg-green-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Fully Paid</Text>
          <Text className="text-white text-3xl font-bold">{paidCount}</Text>
        </View>
        
        <View className="flex-1 bg-orange-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Partially Paid</Text>
          <Text className="text-white text-3xl font-bold">{partiallyPaidCount}</Text>
        </View>

        <View className="flex-1 bg-purple-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Total Revenue</Text>
          <Text className="text-white text-2xl font-bold">฿{totalRevenue.toLocaleString()}</Text>
        </View>
      </View>

      {/* Payment Records List */}
      <View className="bg-white rounded-lg shadow-sm overflow-hidden">
        <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <Text className="text-base font-semibold text-gray-800">Patient Payment Records</Text>
        </View>
        
        <ScrollView className="max-h-[600px]">
          {records.map((record, index) => {
            const statusStyle = getStatusColor(record.status);
            return (
              <View 
                key={record.id}
                className={`px-4 py-4 ${
                  index !== records.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-row items-center justify-between mb-2">
                  {/* Patient Info */}
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800">{record.patientName}</Text>
                    <Text className="text-xs text-gray-500">{record.patientId}</Text>
                  </View>

                  {/* Amount */}
                  <View className="items-end mx-4">
                    <Text className="text-lg font-bold text-gray-800">฿{record.amount.toLocaleString()}</Text>
                  </View>

                  {/* Status */}
                  <View className={`px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                    <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                      {record.status}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4 mt-2">
                  {/* Department */}
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="medical" size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-600">{record.department}</Text>
                  </View>

                  {/* Service */}
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="clipboard-outline" size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-600">{record.service}</Text>
                  </View>

                  {/* Payment Method */}
                  <View className="flex-row items-center gap-1">
                    <Ionicons name={getPaymentMethodIcon(record.paymentMethod) as any} size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-600">{record.paymentMethod}</Text>
                  </View>

                  {/* Date & Time */}
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                    <Text className="text-xs text-gray-600">{record.date} • {record.time}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
