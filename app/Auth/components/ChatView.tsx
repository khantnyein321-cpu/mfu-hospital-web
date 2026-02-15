import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export default function ChatView() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Hello! I am your MFU Hospital AI Agent. How can I assist you today?' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: messages.length + 1,
      sender: 'user',
      text: input.trim(),
    };
    setMessages([...messages, userMsg]);
    setInput('');
    setTimeout(() => {
      const aiMsg: Message = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'Thank you for your message. I will get back to you shortly.',
      };
      setMessages((msgs) => [...msgs, aiMsg]);
    }, 1200);
    Keyboard.dismiss();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-1">AI Agent Chat</Text>
        <Text className="text-sm text-gray-500">Chat with MFU Hospital AI Agent for assistance</Text>
      </View>
      <View className="flex-1 bg-white rounded-lg shadow-sm p-4">
        <ScrollView ref={scrollRef} className="flex-1 mb-4">
          {messages.map((msg) => (
            <View key={msg.id} className={`mb-3 flex-row ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <View className={`max-w-[70%] px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                <Text className={`text-sm ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'}`}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
        <View className="flex-row items-center gap-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-gray-50"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={sendMessage} className="bg-blue-500 rounded-full p-3">
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
