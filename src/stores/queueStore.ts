/**
 * Queue Store - Patient State Management
 * Manages patient check-in, queue status, and journey tracking
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// Types
// ============================================================================

export interface ComplexityScore {
  complexity: string;
  estimated_duration_minutes: number;
  reasoning: string;
  priority_score: number;
}

export interface JourneyStep {
  station: string;
  status: 'pending' | 'waiting' | 'in_progress' | 'completed' | 'skipped';
  position?: number;
  estimated_wait?: number;
  entry_time?: string;
  exit_time?: string;
  duration_minutes?: number;
}

export interface Patient {
  patient_id: string;
  queue_number: number;
  current_station: string;
  position_in_queue: number;
  estimated_wait_minutes: number;
  complexity_score?: ComplexityScore;
  check_in_time?: string;
  journey?: JourneyStep[];
  overall_progress_percent?: number;
  status: 'waiting' | 'in_progress' | 'completed';
  last_updated: string;
}

export interface Notification {
  id: string;
  type: 'position_alert' | 'ready_alert' | 'delay_alert' | 'info';
  message_th: string;
  message_en: string;
  timestamp: string;
  read: boolean;
  action_required: boolean;
}

// ============================================================================
// Store State
// ============================================================================

interface QueueState {
  // Current patient data
  currentPatient: Patient | null;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  
  // WebSocket connection status
  isConnected: boolean;
  
  // Language preference
  language: 'th' | 'en';
}

interface QueueActions {
  // Patient actions
  setPatient: (patient: Patient) => void;
  updatePosition: (position: number, estimatedWait: number) => void;
  updateJourney: (journey: JourneyStep[], progressPercent: number) => void;
  updateStation: (station: string) => void;
  clearPatient: () => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  setLanguage: (language: 'th' | 'en') => void;
}

type QueueStore = QueueState & QueueActions;

// ============================================================================
// Store Implementation
// ============================================================================

export const useQueueStore = create<QueueStore>()()
  persist(
    (set, get) => ({
      // Initial State
      currentPatient: null,
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
      isConnected: false,
      language: 'th',

      // Patient Actions
      setPatient: (patient) =>
        set({
          currentPatient: {
            ...patient,
            last_updated: new Date().toISOString(),
          },
          error: null,
        }),

      updatePosition: (position, estimatedWait) =>
        set((state) => {
          if (!state.currentPatient) return state;
          
          return {
            currentPatient: {
              ...state.currentPatient,
              position_in_queue: position,
              estimated_wait_minutes: estimatedWait,
              last_updated: new Date().toISOString(),
            },
          };
        }),

      updateJourney: (journey, progressPercent) =>
        set((state) => {
          if (!state.currentPatient) return state;
          
          return {
            currentPatient: {
              ...state.currentPatient,
              journey,
              overall_progress_percent: progressPercent,
              last_updated: new Date().toISOString(),
            },
          };
        }),

      updateStation: (station) =>
        set((state) => {
          if (!state.currentPatient) return state;
          
          return {
            currentPatient: {
              ...state.currentPatient,
              current_station: station,
              last_updated: new Date().toISOString(),
            },
          };
        }),

      clearPatient: () =>
        set({
          currentPatient: null,
          error: null,
        }),

      // Notification Actions
      addNotification: (notification) =>
        set((state) => {
          const newNotification: Notification = {
            ...notification,
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            read: false,
          };

          return {
            notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
            unreadCount: state.unreadCount + 1,
          };
        }),

      markNotificationAsRead: (id) =>
        set((state) => {
          const notifications = state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          );
          
          const unreadCount = notifications.filter((n) => !n.read).length;

          return { notifications, unreadCount };
        }),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      clearNotifications: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),

      // UI Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setConnected: (connected) => set({ isConnected: connected }),
      
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'queue-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        currentPatient: state.currentPatient,
        notifications: state.notifications,
        language: state.language,
      }),
    }
  );

// ============================================================================
// Selectors (for performance optimization)
// ============================================================================

export const selectCurrentPatient = (state: QueueStore) => state.currentPatient;
export const selectQueueNumber = (state: QueueStore) => state.currentPatient?.queue_number;
export const selectPosition = (state: QueueStore) => state.currentPatient?.position_in_queue;
export const selectEstimatedWait = (state: QueueStore) => state.currentPatient?.estimated_wait_minutes;
export const selectJourney = (state: QueueStore) => state.currentPatient?.journey;
export const selectProgress = (state: QueueStore) => state.currentPatient?.overall_progress_percent;
export const selectNotifications = (state: QueueStore) => state.notifications;
export const selectUnreadCount = (state: QueueStore) => state.unreadCount;
export const selectIsLoading = (state: QueueStore) => state.isLoading;
export const selectError = (state: QueueStore) => state.error;
export const selectIsConnected = (state: QueueStore) => state.isConnected;
export const selectLanguage = (state: QueueStore) => state.language;

// ============================================================================
// Helper Hooks
// ============================================================================

/**
 * Hook to check if patient is checked in
 */
export const useIsCheckedIn = (): boolean => {
  return useQueueStore((state) => state.currentPatient !== null);
};

/**
 * Hook to get translated message based on language
 */
export const useTranslatedMessage = (messageTh: string, messageEn: string): string => {
  const language = useQueueStore((state) => state.language);
  return language === 'th' ? messageTh : messageEn;
};
