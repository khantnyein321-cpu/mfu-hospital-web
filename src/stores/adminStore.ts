/**
 * Admin Store - Dashboard State Management
 * Manages real-time station metrics, alerts, and reports
 */

import { create } from 'zustand';
import { 
  StationMetrics, 
  DashboardAlert, 
  RealtimeDashboardResponse 
} from '../services/api';

interface AdminState {
  // Dashboard data
  stations: StationMetrics[];
  alerts: DashboardAlert[];
  totalPatients: number;
  avgJourneyTime: number;
  bottlenecks: string[];
  lastRefresh: string | null;
  
  // Summary metrics
  systemStatus: 'healthy' | 'warning' | 'critical';
  activeBottlenecks: number;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setDashboardData: (data: RealtimeDashboardResponse) => void;
  setStations: (stations: StationMetrics[]) => void;
  setAlerts: (alerts: DashboardAlert[]) => void;
  addAlert: (alert: DashboardAlert) => void;
  removeAlert: (alertId: string) => void;
  updateStation: (stationName: string, updates: Partial<StationMetrics>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  stations: [],
  alerts: [],
  totalPatients: 0,
  avgJourneyTime: 0,
  bottlenecks: [],
  lastRefresh: null,
  systemStatus: 'healthy',
  activeBottlenecks: 0,
  isLoading: false,
  error: null,

  // Set complete dashboard data
  setDashboardData: (data: RealtimeDashboardResponse) =>
    set({
      stations: data.stations,
      totalPatients: data.total_patients_in_system,
      avgJourneyTime: data.average_journey_time_minutes,
      bottlenecks: data.bottlenecks,
      lastRefresh: data.last_refresh,
      activeBottlenecks: data.bottlenecks.length,
      systemStatus: data.bottlenecks.length > 2 ? 'critical' : 
                    data.bottlenecks.length > 0 ? 'warning' : 'healthy',
      error: null,
    }),

  // Update stations
  setStations: (stations: StationMetrics[]) =>
    set({ stations }),

  // Update alerts
  setAlerts: (alerts: DashboardAlert[]) =>
    set({ alerts }),

  // Add new alert (from WebSocket)
  addAlert: (alert: DashboardAlert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts],
    })),

  // Remove/dismiss alert
  removeAlert: (alertId: string) =>
    set((state) => ({
      alerts: state.alerts.filter((a) => a.alert_id !== alertId),
    })),

  // Update individual station (from WebSocket)
  updateStation: (stationName: string, updates: Partial<StationMetrics>) =>
    set((state) => ({
      stations: state.stations.map((station) =>
        station.station === stationName
          ? { ...station, ...updates }
          : station
      ),
    })),

  // Loading state
  setLoading: (loading: boolean) =>
    set({ isLoading: loading }),

  // Error handling
  setError: (error: string | null) =>
    set({ error, isLoading: false }),

  // Clear all data
  clearData: () =>
    set({
      stations: [],
      alerts: [],
      totalPatients: 0,
      avgJourneyTime: 0,
      bottlenecks: [],
      lastRefresh: null,
      systemStatus: 'healthy',
      activeBottlenecks: 0,
      error: null,
    }),
}));

// Selectors for derived state
export const selectCriticalStations = (state: AdminState) =>
  state.stations.filter((s) => s.status === 'critical');

export const selectWarningStations = (state: AdminState) =>
  state.stations.filter((s) => s.status === 'warning');

export const selectOptimalStations = (state: AdminState) =>
  state.stations.filter((s) => s.status === 'optimal');

export const selectCriticalAlerts = (state: AdminState) =>
  state.alerts.filter((a) => a.severity === 'critical');

export const selectTotalQueueLength = (state: AdminState) =>
  state.stations.reduce((sum, s) => sum + s.queue_length, 0);

export const selectAvgWaitTime = (state: AdminState) => {
  if (state.stations.length === 0) return 0;
  const total = state.stations.reduce((sum, s) => sum + s.average_wait_minutes, 0);
  return Math.round(total / state.stations.length);
};
