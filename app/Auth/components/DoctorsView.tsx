import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Doctor {
  id: number;
  name: string;
  department: string;
  specialization: string;
  status: 'Available' | 'Busy' | 'Off Duty';
  patients: number;
}

export default function DoctorsView() {
  const doctors: Doctor[] = [
    { id: 1, name: 'Dr. Sarah Johnson', department: 'Cardio med', specialization: 'Cardiologist', status: 'Available', patients: 8 },
    { id: 2, name: 'Dr. Michael Chen', department: 'Cardio med', specialization: 'Cardiac Surgeon', status: 'Busy', patients: 5 },
    { id: 3, name: 'Dr. Emily Brown', department: 'Ortho', specialization: 'Orthopedic Surgeon', status: 'Available', patients: 6 },
    { id: 4, name: 'Dr. James Wilson', department: 'Ortho', specialization: 'Sports Medicine', status: 'Busy', patients: 4 },
    { id: 5, name: 'Dr. Lisa Anderson', department: 'Gen Sx', specialization: 'General Surgeon', status: 'Available', patients: 7 },
    { id: 6, name: 'Dr. Robert Taylor', department: 'Gen Sx', specialization: 'Laparoscopic Surgeon', status: 'Off Duty', patients: 0 },
    { id: 7, name: 'Dr. Maria Garcia', department: 'ENT', specialization: 'ENT Specialist', status: 'Available', patients: 5 },
    { id: 8, name: 'Dr. David Martinez', department: 'ENT', specialization: 'Head & Neck Surgeon', status: 'Busy', patients: 3 },
    { id: 9, name: 'Dr. Jennifer Lee', department: 'EYE', specialization: 'Ophthalmologist', status: 'Available', patients: 4 },
    { id: 10, name: 'Dr. Thomas White', department: 'EYE', specialization: 'Retina Specialist', status: 'Available', patients: 3 },
    { id: 11, name: 'Dr. Patricia Davis', department: 'Cardio sx', specialization: 'Cardiothoracic Surgeon', status: 'Busy', patients: 2 },
    { id: 12, name: 'Dr. Christopher Moore', department: 'Neuro Sx', specialization: 'Neurosurgeon', status: 'Available', patients: 3 },
    { id: 13, name: 'Dr. Amanda Clark', department: 'Neuro Sx', specialization: 'Spine Surgeon', status: 'Off Duty', patients: 0 },
    { id: 14, name: 'Dr. Daniel Rodriguez', department: 'Plastic Sx', specialization: 'Plastic Surgeon', status: 'Available', patients: 2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' };
      case 'Busy':
        return { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-300' };
    }
  };

  const availableCount = doctors.filter(d => d.status === 'Available').length;
  const busyCount = doctors.filter(d => d.status === 'Busy').length;
  const offDutyCount = doctors.filter(d => d.status === 'Off Duty').length;

  return (
    <View>
      {/* Header Stats */}
      <View className="flex-row gap-3 mb-4">
        <View className="flex-1 bg-green-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Available</Text>
          <Text className="text-white text-3xl font-bold">{availableCount}</Text>
        </View>
        
        <View className="flex-1 bg-orange-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Busy</Text>
          <Text className="text-white text-3xl font-bold">{busyCount}</Text>
        </View>
        
        <View className="flex-1 bg-gray-500 rounded-lg p-4">
          <Text className="text-white text-sm font-medium mb-1">Off Duty</Text>
          <Text className="text-white text-3xl font-bold">{offDutyCount}</Text>
        </View>
      </View>

      {/* Doctors List */}
      <View className="bg-white rounded-lg shadow-sm overflow-hidden">
        <View className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <Text className="text-base font-semibold text-gray-800">Medical Staff Directory</Text>
        </View>
        
        <ScrollView className="max-h-[600px]">
          {doctors.map((doctor, index) => {
            const statusStyle = getStatusColor(doctor.status);
            return (
              <View 
                key={doctor.id}
                className={`flex-row items-center justify-between px-4 py-4 ${
                  index !== doctors.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                {/* Doctor Info */}
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-800">{doctor.name}</Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="medical" size={12} color="#6B7280" />
                      <Text className="text-xs text-gray-600">{doctor.department}</Text>
                    </View>
                    <Text className="text-xs text-gray-400">•</Text>
                    <Text className="text-xs text-gray-600">{doctor.specialization}</Text>
                  </View>
                </View>

                {/* Patients Count */}
                <View className="items-center mx-4">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="person-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600">{doctor.patients} patients</Text>
                  </View>
                </View>

                {/* Status */}
                <View className={`px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border}`}>
                  <Text className={`text-xs font-semibold ${statusStyle.text}`}>
                    {doctor.status}
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
