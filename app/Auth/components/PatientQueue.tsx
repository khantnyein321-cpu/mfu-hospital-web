import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Patient {
  id: number;
  queueNumber: string;
  name: string;
  department: string;
  status: 'Waiting' | 'In Progress' | 'Called';
  waitingTime: string;
}

export default function PatientQueue() {
  const patients: Patient[] = [
    { id: 1, queueNumber: 'A001', name: 'John Smith', department: 'Cardio med', status: 'In Progress', waitingTime: '5 mins' },
    { id: 2, queueNumber: 'A002', name: 'Sarah Johnson', department: 'Ortho', status: 'Waiting', waitingTime: '12 mins' },
    { id: 3, queueNumber: 'B015', name: 'Mike Davis', department: 'ENT', status: 'Called', waitingTime: '2 mins' },
    { id: 4, queueNumber: 'A003', name: 'Emily Brown', department: 'Gen Sx', status: 'Waiting', waitingTime: '18 mins' },
    { id: 5, queueNumber: 'C008', name: 'David Wilson', department: 'EYE', status: 'Waiting', waitingTime: '8 mins' },
    { id: 6, queueNumber: 'A004', name: 'Lisa Anderson', department: 'Cardio sx', status: 'Waiting', waitingTime: '25 mins' },
    { id: 7, queueNumber: 'D003', name: 'James Taylor', department: 'Neuro Sx', status: 'In Progress', waitingTime: '3 mins' },
    { id: 8, queueNumber: 'B016', name: 'Maria Garcia', department: 'Plastic Sx', status: 'Waiting', waitingTime: '15 mins' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' };
      case 'Called':
        return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' };
      default:
        return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' };
    }
  };

  return (
    <View>
      {/* Header Stats */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-blue-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Total in Queue</Text>
          <Text className="text-white text-3xl font-bold">{patients.length}</Text>
        </View>
        
        <View className="flex-1 bg-green-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">In Progress</Text>
          <Text className="text-white text-3xl font-bold">
            {patients.filter(p => p.status === 'In Progress').length}
          </Text>
        </View>
        
        <View className="flex-1 bg-orange-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Waiting</Text>
          <Text className="text-white text-3xl font-bold">
            {patients.filter(p => p.status === 'Waiting').length}
          </Text>
        </View>
      </View>

      {/* Patient Queue List */}
      <View className="bg-white rounded-lg shadow-sm overflow-hidden">
        <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <Text className="text-base font-semibold text-gray-800">Patient Queue</Text>
        </View>
        
        <ScrollView className="max-h-96">
          {patients.map((patient, index) => {
            const statusStyle = getStatusColor(patient.status);
            return (
              <View 
                key={patient.id}
                className={`flex-row items-center justify-between px-4 py-3 ${
                  index !== patients.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Queue Number */}
                <View className="w-16">
                  <Text className="text-lg font-bold text-gray-800">{patient.queueNumber}</Text>
                </View>

                {/* Patient Info */}
                <View className="flex-1 mx-3">
                  <Text className="text-sm font-semibold text-gray-800">{patient.name}</Text>
                  <Text className="text-xs text-gray-500">{patient.department}</Text>
                </View>

                {/* Waiting Time */}
                <View className="items-center mx-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600">{patient.waitingTime}</Text>
                  </View>
                </View>

                {/* Status */}
                <View className={`px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                  <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                    {patient.status}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
