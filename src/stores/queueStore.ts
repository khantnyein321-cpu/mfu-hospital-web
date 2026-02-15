/**
 * Queue Store - Patient Side State Management
 * Manages patient queue data, status, and journey
 */

import { create } from 'zustand';
import { 
  CheckInResponse, 
  QueueStatusResponse, 
  PatientJourneyResponse,
  JourneyStep 
} from '../services/api';

interface Patient {
  patient_id: string;
  queue_number: number;
  position: number;
  estimated_wait: number;
  current_station: string;
  status: string;
  complexity?: {
    complexity: string;
    estimated_duration_minutes: number;
    reasoning: string;
    priority_score: number;
  };
  check_in_time?: string;
}

interface QueueState {
  // Current patient data
  currentPatient: Patient | null;
  journey: JourneyStep[];
  progressPercent: number;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPatient: (response: CheckInResponse) => void;
  updateStatus: (status: QueueStatusResponse) => void;
  updateJourney: (journey: PatientJourneyResponse) => void;
  updatePosition: (position: number, estimated_wait: number) => void;
  clearPatient: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useQueueStore = create<QueueState>((set) => ({
  // Initial state
  currentPatient: null,
  journey: [],
  progressPercent: 0,
  isLoading: false,
  error: null,

  // Set patient after check-in
  setPatient: (response: CheckInResponse) =>
    set({
      currentPatient: {
        patient_id: response.patient_id,
        queue_number: response.queue_number,
        position: response.position_in_queue,
        estimated_wait: response.estimated_wait_minutes,
        current_station: response.current_station,
        status: 'waiting',
        complexity: response.complexity_score,
        check_in_time: response.timestamp,
      },
      error: null,
    }),

  // Update status from polling/WebSocket
  updateStatus: (status: QueueStatusResponse) =>
    set((state) => ({
      currentPatient: state.currentPatient
        ? {
            ...state.currentPatient,
            position: status.position_in_queue,
            estimated_wait: status.estimated_wait_minutes,
            current_station: status.current_station,
            status: status.status,
          }
        : null,
    })),

  // Update full journey data
  updateJourney: (journeyData: PatientJourneyResponse) =>
    set({
      journey: journeyData.journey,
      progressPercent: journeyData.overall_progress_percent,
      currentPatient: (state: QueueState) =>
        state.currentPatient
          ? {
              ...state.currentPatient,
              current_station: journeyData.current_station,
            }
          : null,
    }),

  // Quick position update (from WebSocket)
  updatePosition: (position: number, estimated_wait: number) =>
    set((state) => ({
      currentPatient: state.currentPatient
        ? {
            ...state.currentPatient,
            position,
            estimated_wait,
          }
        : null,
    })),

  // Clear patient data (logout/exit)
  clearPatient: () =>
    set({
      currentPatient: null,
      journey: [],
      progressPercent: 0,
      error: null,
    }),

  // Loading state
  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  // Error handling
  setError: (error: string | null) =>
    set({ error, isLoading: false }),
}));

// Selectors for derived state
export const selectIsCheckedIn = (state: QueueState) => state.currentPatient !== null;
export const selectQueueNumber = (state: QueueState) => state.currentPatient?.queue_number;
export const selectPosition = (state: QueueState) => state.currentPatient?.position;
export const selectEstimatedWait = (state: QueueState) => state.currentPatient?.estimated_wait;
export const selectCurrentStation = (state: QueueState) => state.currentPatient?.current_station;
