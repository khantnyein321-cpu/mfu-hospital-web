/**
 * Admin Dashboard Screen
 * Real-time hospital flow control with AI recommendations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useAdminStore } from '@/src/stores/adminStore';
import { adminApi } from '@/src/services/api';
import { useWebSocket } from '@/src/services/websocket';
import StationCard from '@/components/admin/StationCard';
import AlertPanel from '@/components/admin/AlertPanel';

export default function AdminDashboard() {
  const {
    stations,
    alerts,
    bottlenecks,
    setStations,
    setAlerts,
    setBottlenecks,
    addAlert,
    dismissAlert,
    setConnected,
    autoRefresh,
  } = useAdminStore();

  const [refreshing, setRefreshing] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // WebSocket for real-time admin updates
  const { isConnected } = useWebSocket({
    clientId: 'admin_dashboard',
    onMessage: (data) => {
      console.log('📨 Admin WebSocket message:', data);
      
      if (data.event_type === 'bottleneck_detected') {
        console.log('🚨 Bottleneck detected:', data);
        addAlert({
          alert_id: `alert_${Date.now()}`,
          station: data.station,
          severity: data.severity || 'warning',
          message: data.message || `Bottleneck at ${data.station}`,
          detected_at: new Date().toISOString(),
          recommendations: data.recommendations || [],
          dismissed: false,
        });
      }
    },
    onConnect: () => {
      console.log('✅ Admin WebSocket connected');
      setConnected(true);
    },
    onDisconnect: () => {
      console.log('❌ Admin WebSocket disconnected');
      setConnected(false);
    },
  });

  const fetchDashboardData = async () => {
    try {
      console.log('🔄 Fetching dashboard data...');
      
      const [realtimeData, alertsData] = await Promise.all([
        adminApi.getRealtime(),
        adminApi.getAlerts(),
      ]);

      console.log('✅ Realtime data:', realtimeData);
      console.log('✅ Alerts data:', alertsData);

      setStations(realtimeData.stations || []);
      setBottlenecks(realtimeData.bottlenecks || []);
      setAlerts(alertsData.alerts || []);
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const handleApplyAction = async (alertId: string, actionIndex: number) => {
    console.log('🎯 Applying action:', alertId, actionIndex);
    // TODO: Implement action application
    dismissAlert(alertId);
  };

  const handleSimulateBottleneck = async (station: string) => {
    try {
      await adminApi.simulateBottleneck(station, 20);
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to simulate bottleneck:', error);
    }
  };

  const handleResolveBottleneck = async (station: string) => {
    try {
      await adminApi.resolveBottleneck(station, 15);
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to resolve bottleneck:', error);
    }
  };

  // Calculate summary metrics
  const totalPatients = stations.reduce((sum, s) => sum + s.queue_length, 0);
  const avgWaitTime = stations.length > 0
    ? Math.round(stations.reduce((sum, s) => sum + s.average_wait_minutes, 0) / stations.length)
    : 0;
  const criticalCount = stations.filter(s => s.status === 'critical').length;

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-2xl font-bold text-gray-800">MFU Flow Control</Text>
            <Text className="text-sm text-gray-500">Admin Dashboard</Text>
          </View>
          
          <View className="flex-row items-center">
            <View
              className={`w-3 h-3 rounded-full mr-2 ${
                isConnected ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <Text className={`text-sm font-semibold ${
              isConnected ? 'text-green-600' : 'text-gray-500'
            }`}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>

        {/* Summary Cards */}
        <View className="flex-row justify-between mt-3">
          <View className="flex-1 bg-blue-50 rounded-xl p-3 mr-2">
            <Text className="text-xs text-blue-600 mb-1">Total Patients</Text>
            <Text className="text-2xl font-bold text-blue-700">{totalPatients}</Text>
          </View>
          
          <View className="flex-1 bg-orange-50 rounded-xl p-3 mr-2">
            <Text className="text-xs text-orange-600 mb-1">Avg Wait</Text>
            <Text className="text-2xl font-bold text-orange-700">{avgWaitTime}m</Text>
          </View>
          
          <View className="flex-1 bg-red-50 rounded-xl p-3">
            <Text className="text-xs text-red-600 mb-1">Critical</Text>
            <Text className="text-2xl font-bold text-red-700">{criticalCount}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Station Cards */}
        <View className="mt-4">
          <View className="flex-row items-center justify-between px-4 mb-2">
            <Text className="text-lg font-bold text-gray-800">📊 Station Overview</Text>
            <TouchableOpacity onPress={onRefresh}>
              <Text className="text-blue-600 font-semibold">🔄</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
          >
            {stations.map((station, index) => (
              <StationCard key={index} {...station} language="th" />
            ))}
          </ScrollView>
        </View>

        {/* Bottlenecks */}
        {bottlenecks.length > 0 && (
          <View className="mx-4 mt-4">
            <View className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-2xl mr-2">🚨</Text>
                <Text className="font-bold text-red-800 text-lg">Active Bottlenecks</Text>
              </View>
              {bottlenecks.map((station, index) => (
                <View key={index} className="flex-row items-center justify-between mt-2">
                  <Text className="text-red-700">• {station}</Text>
                  <TouchableOpacity
                    className="bg-green-600 px-3 py-1 rounded"
                    onPress={() => handleResolveBottleneck(station)}
                  >
                    <Text className="text-white text-xs font-semibold">Resolve</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* AI Alerts */}
        {alerts.length > 0 && (
          <View className="mt-4">
            <AlertPanel
              alerts={alerts.filter(a => !a.dismissed)}
              onApplyAction={handleApplyAction}
              onDismiss={dismissAlert}
              language="th"
            />
          </View>
        )}

        {/* Demo Controls */}
        <View className="mx-4 my-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🎬 Demo Controls
          </Text>
          
          <TouchableOpacity
            className="bg-red-600 rounded-xl p-4 mb-2"
            onPress={() => handleSimulateBottleneck('pharmacy')}
          >
            <Text className="text-white font-bold text-center">
              🔴 Simulate Bottleneck (Pharmacy +20)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-600 rounded-xl p-4 mb-2"
            onPress={() => handleResolveBottleneck('pharmacy')}
          >
            <Text className="text-white font-bold text-center">
              🟢 Resolve Bottleneck (Pharmacy -15)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-600 rounded-xl p-4"
            onPress={() => setShowChat(true)}
          >
            <Text className="text-white font-bold text-center">
              💬 Open Supervisor Chat
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Supervisor Chat Modal */}
      <Modal
        visible={showChat}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="flex-1 bg-white">
          <View className="bg-blue-600 p-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-xl font-bold">💬 AI Supervisor</Text>
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Text className="text-white text-2xl">×</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View className="flex-1 items-center justify-center p-6">
            <Text className="text-6xl mb-4">🤖</Text>
            <Text className="text-2xl font-bold text-gray-800 mb-2">AI Supervisor Chat</Text>
            <Text className="text-gray-600 text-center mb-6">
              This will be integrated with your Supervisor Agent
            </Text>
            
            <View className="w-full bg-gray-100 rounded-xl p-4">
              <Text className="text-sm text-gray-600 mb-2">Integration Points:</Text>
              <Text className="text-sm text-gray-800">• Real-time station metrics</Text>
              <Text className="text-sm text-gray-800">• Current alerts and bottlenecks</Text>
              <Text className="text-sm text-gray-800">• Patient flow analytics</Text>
              <Text className="text-sm text-gray-800">• Action recommendations</Text>
            </View>

            <Text className="text-xs text-gray-400 mt-6 text-center">
              Connect this component to your supervisor agent
              to enable real-time AI assistance
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
