/**
 * AI Supervisor Chat View
 * Connected to Phoenix AI Supervisor Agent
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdminStore } from '@/src/stores/adminStore';
import axios from 'axios';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actions?: any[];
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'ai', 
      text: '🤖 Hello! I am your MFU Hospital AI Supervisor. I can help you analyze patient flow, identify bottlenecks, and recommend actions.\n\nTry asking:\n• "What are the current bottlenecks?"\n• "How can we reduce wait times?"\n• "Which stations need more staff?"',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<any>(null);

  // Get context from admin store
  const { stations, alerts, bottlenecks } = useAdminStore();

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const buildContext = () => {
    return {
      timestamp: new Date().toISOString(),
      stations: stations.map(s => ({
        name: s.station,
        queue_length: s.queue_length,
        average_wait: s.average_wait_minutes,
        status: s.status,
        throughput: s.throughput_per_hour,
      })),
      alerts: alerts.map(a => ({
        station: a.station,
        severity: a.severity,
        message: a.message,
      })),
      bottlenecks,
      summary: {
        total_patients: stations.reduce((sum, s) => sum + s.queue_length, 0),
        critical_stations: stations.filter(s => s.status === 'critical').length,
        average_wait: stations.length > 0
          ? Math.round(stations.reduce((sum, s) => sum + s.average_wait_minutes, 0) / stations.length)
          : 0,
      },
    };
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMsg]);
    const userInput = input.trim();
    setInput('');
    setLoading(true);
    Keyboard.dismiss();

    try {
      console.log('🤖 Sending to supervisor:', userInput);
      
      // Build context with current hospital state
      const context = buildContext();
      console.log('📊 Context:', context);

      // Call supervisor API
      const response = await axios.post(`${API_URL}/api/supervisor/chat`, {
        message: userInput,
        context,
      });

      console.log('✅ Supervisor response:', response.data);

      const aiMsg: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: response.data.response,
        timestamp: new Date().toISOString(),
        actions: response.data.actions,
      };

      setMessages((msgs) => [...msgs, aiMsg]);
    } catch (error: any) {
      console.error('❌ Supervisor error:', error);
      
      const errorMsg: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: `❌ Sorry, I encountered an error: ${error.response?.data?.detail || error.message || 'Please try again.'}\n\nMake sure the backend is running at ${API_URL}`,
        timestamp: new Date().toISOString(),
      };
      
      setMessages((msgs) => [...msgs, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <View className="flex-row items-center justify-between mb-1">
          <View className="flex-row items-center">
            <Text className="text-2xl mr-2">🤖</Text>
            <Text className="text-lg font-semibold text-gray-800">AI Supervisor Agent</Text>
          </View>
          
          {/* Status Indicator */}
          <View className="flex-row items-center">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <Text className="text-xs text-green-600 font-semibold">Connected</Text>
          </View>
        </View>
        <Text className="text-sm text-gray-500">Intelligent hospital flow management assistant</Text>
      </View>

      {/* Context Summary */}
      <View className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-xs text-gray-500">Patients</Text>
            <Text className="text-lg font-bold text-blue-600">
              {stations.reduce((sum, s) => sum + s.queue_length, 0)}
            </Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Alerts</Text>
            <Text className="text-lg font-bold text-orange-600">{alerts.length}</Text>
          </View>
          <View className="items-center">
            <Text className="text-xs text-gray-500">Bottlenecks</Text>
            <Text className="text-lg font-bold text-red-600">{bottlenecks.length}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="mb-3"
      >
        <TouchableOpacity
          className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mr-2"
          onPress={() => handleQuickAction('What are the current bottlenecks?')}
        >
          <Text className="text-blue-700 text-sm">🚨 Current bottlenecks?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-green-50 border border-green-200 rounded-full px-4 py-2 mr-2"
          onPress={() => handleQuickAction('How can we reduce wait times?')}
        >
          <Text className="text-green-700 text-sm">⏱️ Reduce wait time?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          className="bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mr-2"
          onPress={() => handleQuickAction('Which stations need more staff?')}
        >
          <Text className="text-orange-700 text-sm">👥 Staff allocation?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-purple-50 border border-purple-200 rounded-full px-4 py-2"
          onPress={() => handleQuickAction('Give me a summary')}
        >
          <Text className="text-purple-700 text-sm">📊 Summary</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Messages */}
      <View className="flex-1 bg-white rounded-lg shadow-sm p-4">
        <ScrollView ref={scrollRef} className="flex-1 mb-4">
          {messages.map((msg) => (
            <View key={msg.id} className={`mb-3 flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <View className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <Text className={`text-sm leading-6 ${
                  msg.sender === 'user' ? 'text-white' : 'text-gray-800'
                }`}>
                  {msg.text}
                </Text>
                
                {/* Show timestamp */}
                <Text className={`text-xs mt-1 ${
                  msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>

                {/* Show actions if available */}
                {msg.actions && msg.actions.length > 0 && (
                  <View className="mt-2 pt-2 border-t border-gray-300">
                    <Text className="text-xs text-gray-600 mb-1">🎯 Recommended Actions:</Text>
                    {msg.actions.slice(0, 2).map((action, idx) => (
                      <Text key={idx} className="text-xs text-gray-700">
                        • {action.type.replace(/_/g, ' ')}: {action.station || 'system'}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            </View>
          ))}

          {/* Loading indicator */}
          {loading && (
            <View className="flex-row justify-start mb-3">
              <View className="bg-gray-100 px-4 py-3 rounded-2xl">
                <ActivityIndicator size="small" color="#3b82f6" />
                <Text className="text-xs text-gray-500 mt-1">AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View className="flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about hospital flow..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm bg-gray-50"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            editable={!loading}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            onPress={sendMessage} 
            className={`bg-blue-500 rounded-full p-3 ${
              loading || !input.trim() ? 'opacity-50' : ''
            }`}
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={20} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
