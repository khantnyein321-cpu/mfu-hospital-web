/**
 * Supervisor Chat Component
 * AI Agent Interface for Hospital Flow Management
 * 
 * INTEGRATION POINTS:
 * - Connect to your Pydantic-AI Supervisor Agent
 * - Real-time context: station metrics, alerts, bottlenecks
 * - Action execution: apply recommendations, control flow
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAdminStore } from '@/src/stores/adminStore';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: any;
}

interface SupervisorChatProps {
  onClose?: () => void;
  // Hook for your supervisor agent
  onSendToSupervisor?: (message: string, context: any) => Promise<string>;
}

export const SupervisorChat: React.FC<SupervisorChatProps> = ({
  onClose,
  onSendToSupervisor,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'system',
      content: '🤖 Supervisor AI Agent ready. I can help you analyze hospital flow, identify bottlenecks, and recommend actions.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get current context from admin store
  const { stations, alerts, bottlenecks } = useAdminStore();

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Build context for supervisor
      const context = buildContext();

      let response: string;

      if (onSendToSupervisor) {
        // Use custom supervisor integration
        response = await onSendToSupervisor(userMessage.content, context);
      } else {
        // Default mock response (for testing without supervisor)
        response = await mockSupervisorResponse(userMessage.content, context);
      }

      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString(),
        metadata: { context_used: true },
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Supervisor error:', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now()}_error`,
        role: 'system',
        content: '❌ Failed to get response from supervisor. Please try again.',
        timestamp: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="bg-blue-600 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-xl font-bold">🤖 AI Supervisor</Text>
            <Text className="text-blue-100 text-sm">Hospital Flow Assistant</Text>
          </View>
          {onClose && (
            <TouchableOpacity onPress={onClose}>
              <Text className="text-white text-3xl font-light">×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Context Summary */}
      <View className="bg-gray-50 px-4 py-3 border-b border-gray-200">
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

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 py-4"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`mb-3 ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <View
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.role === 'user'
                  ? 'bg-blue-600'
                  : msg.role === 'assistant'
                  ? 'bg-gray-100'
                  : 'bg-yellow-50 border border-yellow-200'
              }`}
            >
              <Text
                className={`text-base leading-6 ${
                  msg.role === 'user' ? 'text-white' : 'text-gray-800'
                }`}
              >
                {msg.content}
              </Text>
              <Text
                className={`text-xs mt-1 ${
                  msg.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString('th-TH', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View className="items-start mb-3">
            <View className="bg-gray-100 rounded-2xl p-3">
              <ActivityIndicator color="#2563eb" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View className="px-4 py-2 border-t border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            className="bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mr-2"
            onPress={() => handleQuickAction('What are the current bottlenecks?')}
          >
            <Text className="text-blue-700 text-sm">🚨 Current bottlenecks?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-green-50 border border-green-200 rounded-full px-4 py-2 mr-2"
            onPress={() => handleQuickAction('Recommend actions to reduce wait time')}
          >
            <Text className="text-green-700 text-sm">💡 Reduce wait time?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-orange-50 border border-orange-200 rounded-full px-4 py-2 mr-2"
            onPress={() => handleQuickAction('Which station needs more staff?')}
          >
            <Text className="text-orange-700 text-sm">👥 Staff allocation?</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Input */}
      <View className="px-4 py-3 bg-white border-t border-gray-200">
        <View className="flex-row items-end">
          <TextInput
            className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 mr-2 text-base"
            placeholder="Ask supervisor..."
            value={input}
            onChangeText={setInput}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            className={`bg-blue-600 rounded-full w-12 h-12 items-center justify-center ${
              loading || !input.trim() ? 'opacity-50' : ''
            }`}
            onPress={handleSend}
            disabled={loading || !input.trim()}
          >
            <Text className="text-white text-xl">↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

// ============================================================================
// Mock Supervisor Response (for testing without agent)
// Replace this with your actual Pydantic-AI Supervisor integration
// ============================================================================

async function mockSupervisorResponse(
  userMessage: string,
  context: any
): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerMsg = userMessage.toLowerCase();

  // Bottleneck analysis
  if (lowerMsg.includes('bottleneck')) {
    if (context.bottlenecks.length === 0) {
      return '✅ Good news! No bottlenecks detected currently. All stations are operating smoothly.';
    }
    
    const critical = context.stations.filter((s: any) => s.status === 'critical');
    return `🚨 I've identified ${context.bottlenecks.length} bottleneck(s):\n\n${critical
      .map(
        (s: any) =>
          `• ${s.name}: ${s.queue_length} patients waiting, avg ${s.average_wait} min\n  💡 Recommendation: Add ${Math.ceil(s.queue_length / 15)} staff or open additional counter`
      )
      .join('\n\n')}`;
  }

  // Wait time reduction
  if (lowerMsg.includes('wait') || lowerMsg.includes('reduce')) {
    const topStation = context.stations.reduce((max: any, s: any) =>
      s.average_wait > (max?.average_wait || 0) ? s : max
    );
    
    return `🔍 Analysis of wait times:\n\nLongest wait: ${topStation.name} (${topStation.average_wait} min)\n\n💡 Top recommendations:\n1. Open 1-2 additional service points at ${topStation.name}\n2. Implement express lane for simple cases\n3. Redistribute staff from optimal stations\n\nExpected impact: Reduce wait by 15-20 minutes`;
  }

  // Staff allocation
  if (lowerMsg.includes('staff') || lowerMsg.includes('allocation')) {
    const needsStaff = context.stations.filter(
      (s: any) => s.status === 'critical' || s.status === 'warning'
    );
    
    if (needsStaff.length === 0) {
      return '✅ Current staffing levels are adequate. No immediate changes needed.';
    }
    
    return `👥 Staff allocation recommendations:\n\n${needsStaff
      .map(
        (s: any) =>
          `• ${s.name}: Add ${Math.ceil(s.queue_length / 20)} staff\n  Current: ${s.queue_length} patients, ${s.average_wait} min wait`
      )
      .join('\n\n')}`;
  }

  // General summary
  if (
    lowerMsg.includes('summary') ||
    lowerMsg.includes('status') ||
    lowerMsg.includes('overview')
  ) {
    return `📊 Hospital Flow Summary:\n\n• Total patients in system: ${context.summary.total_patients}\n• Critical stations: ${context.summary.critical_stations}\n• Average wait time: ${context.summary.average_wait} min\n• Active alerts: ${context.alerts.length}\n\nOverall status: ${context.summary.critical_stations > 0 ? '🟡 Needs attention' : '🟢 Normal'}`;
  }

  // Default response
  return `I understand you're asking about: "${userMessage}"\n\nI can help you with:\n• Identifying bottlenecks\n• Reducing wait times\n• Staff allocation\n• Flow optimization\n\nTry: "What are the current bottlenecks?" or "How can we reduce wait time?"`;
}

export default SupervisorChat;
