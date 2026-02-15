/**
 * WebSocket Client for Real-Time Updates
 * Connects to Phoenix AI WebSocket endpoint for live queue updates
 */

import { useEffect, useRef, useCallback } from 'react';

// WebSocket URL - change to deployed URL in production
const WS_BASE_URL = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:8000';

// ============================================================================
// WebSocket Event Types
// ============================================================================

export interface QueueUpdateEvent {
  event_type: 'queue_updated';
  patient_id: string;
  queue_number: number;
  position: number;
  estimated_wait: number;
  station: string;
}

export interface BottleneckEvent {
  event_type: 'bottleneck_detected';
  station: string;
  severity: 'info' | 'warning' | 'critical';
  queue_length: number;
  average_wait: number;
  recommendations: string[];
}

export interface NotificationEvent {
  event_type: 'notification_trigger';
  patient_id: string;
  notification_type: 'position_alert' | 'ready_alert' | 'delay_alert';
  message_th: string;
  message_en: string;
  action_required: boolean;
}

export type WebSocketEvent = QueueUpdateEvent | BottleneckEvent | NotificationEvent;

// ============================================================================
// WebSocket Hook
// ============================================================================

export interface UseWebSocketOptions {
  clientId: string;
  onMessage?: (data: WebSocketEvent) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
}

export const useWebSocket = ({
  clientId,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
  reconnect = true,
  reconnectInterval = 3000,
}: UseWebSocketOptions) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(reconnect);

  const connect = useCallback(() => {
    try {
      console.log(`🔌 Connecting to WebSocket: ${WS_BASE_URL}/ws/${clientId}`);
      
      ws.current = new WebSocket(`${WS_BASE_URL}/ws/${clientId}`);

      ws.current.onopen = () => {
        console.log('✅ WebSocket connected');
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data: WebSocketEvent = JSON.parse(event.data);
          console.log('📨 WebSocket message:', data);
          onMessage?.(data);
        } catch (error) {
          console.error('❌ Failed to parse WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        onError?.(error);
      };

      ws.current.onclose = () => {
        console.log('🔌 WebSocket disconnected');
        onDisconnect?.();

        // Attempt reconnection if enabled
        if (shouldReconnect.current) {
          console.log(`🔄 Reconnecting in ${reconnectInterval}ms...`);
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket connection:', error);
    }
  }, [clientId, onConnect, onMessage, onDisconnect, onError, reconnectInterval]);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
      console.log('📤 WebSocket message sent:', message);
    } else {
      console.warn('⚠️ Cannot send message: WebSocket not connected');
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: ws.current?.readyState === WebSocket.OPEN,
  };
};

// ============================================================================
// Standalone WebSocket Manager (for non-React contexts)
// ============================================================================

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private clientId: string;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectInterval: number;
  private shouldReconnect: boolean = true;

  constructor(clientId: string, reconnectInterval: number = 3000) {
    this.clientId = clientId;
    this.reconnectInterval = reconnectInterval;
  }

  connect() {
    try {
      this.ws = new WebSocket(`${WS_BASE_URL}/ws/${this.clientId}`);

      this.ws.onopen = () => {
        console.log('✅ WebSocket connected (Manager)');
        this.emit('connect', null);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const eventType = data.event_type || 'message';
          this.emit(eventType, data);
        } catch (error) {
          console.error('❌ Failed to parse message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('❌ WebSocket error (Manager):', error);
        this.emit('error', error);
      };

      this.ws.onclose = () => {
        console.log('🔌 WebSocket disconnected (Manager)');
        this.emit('disconnect', null);

        if (this.shouldReconnect) {
          setTimeout(() => this.connect(), this.reconnectInterval);
        }
      };
    } catch (error) {
      console.error('❌ Failed to create WebSocket:', error);
    }
  }

  disconnect() {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: (data: any) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create patient WebSocket client ID
 */
export const createPatientClientId = (patientId: string): string => {
  return `patient_${patientId}`;
};

/**
 * Create admin WebSocket client ID
 */
export const createAdminClientId = (adminId: string): string => {
  return `admin_${adminId}`;
};

/**
 * Check if WebSocket is supported
 */
export const isWebSocketSupported = (): boolean => {
  return typeof WebSocket !== 'undefined';
};
