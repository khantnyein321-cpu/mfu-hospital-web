/**
 * Admin Store - Dashboard State Management
 * Manages real-time station metrics, alerts, and reports
 */

import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================

export interface StationMetrics {
  station: string;
  queue_length: number;
  average_wait_minutes: number;
  throughput_per_hour: number;
  status: 'optimal' | 'normal' | 'warning' | 'critical';
  active_staff: number;
  last_updated: string;
}

export interface AlertRecommendation {
  action: string;
  priority: number;
  estimated_impact: string;
}

export interface DashboardAlert {
  alert_id: string;
  station: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  detected_at: string;
  recommendations: AlertRecommendation[];
  dismissed: boolean;
}

export interface MetricsSummary {
  status: string;
  total_patients_in_queue: number;
  average_wait_time_minutes: number;
  active_bottlenecks: number;
  patient_satisfaction: number;
  throughput_today: number;
  system_health: 'healthy' | 'warning' | 'critical';
}

export interface DailyReport {
  report_date: string;
  total_patients: number;
  average_wait_time_minutes: number;
  average_journey_time_minutes: number;
  patient_satisfaction_score?: number;
  station_performance: Record<string, any>;
  peak_hours: number[];
  bottleneck_summary: Record<string, number>;
}

// ============================================================================
// Store State
// ============================================================================

interface AdminState {
  // Real-time data
  stations: StationMetrics[];
  alerts: DashboardAlert[];
  bottlenecks: string[];
  metricsSummary: MetricsSummary | null;
  dailyReport: DailyReport | null;
  
  // UI State
  isLoading: boolean;
  error: string | null;
  lastRefresh: string | null;
  autoRefresh: boolean;
  refreshInterval: number; // in milliseconds
  
  // WebSocket
  isConnected: boolean;
  
  // Filters
  selectedStation: string | null;
  showDismissedAlerts: boolean;
}

interface AdminActions {
  // Data actions
  setStations: (stations: StationMetrics[]) => void;
  updateStation: (station: string, updates: Partial<StationMetrics>) => void;
  
  setAlerts: (alerts: DashboardAlert[]) => void;
  addAlert: (alert: DashboardAlert) => void;
  dismissAlert: (alertId: string) => void;
  undismissAlert: (alertId: string) => void;
  clearDismissedAlerts: () => void;
  
  setBottlenecks: (bottlenecks: string[]) => void;
  
  setMetricsSummary: (summary: MetricsSummary) => void;
  
  setDailyReport: (report: DailyReport) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastRefresh: () => void;
  setAutoRefresh: (enabled: boolean) => void;
  setRefreshInterval: (interval: number) => void;
  
  setConnected: (connected: boolean) => void;
  
  // Filter actions
  setSelectedStation: (station: string | null) => void;
  setShowDismissedAlerts: (show: boolean) => void;
  
  // Utility actions
  refreshDashboard: () => void;
  reset: () => void;
}

type AdminStore = AdminState & AdminActions;

// ============================================================================
// Store Implementation
// ============================================================================

const initialState: AdminState = {
  stations: [],
  alerts: [],
  bottlenecks: [],
  metricsSummary: null,
  dailyReport: null,
  isLoading: false,
  error: null,
  lastRefresh: null,
  autoRefresh: true,
  refreshInterval: 5000, // 5 seconds
  isConnected: false,
  selectedStation: null,
  showDismissedAlerts: false,
};

export const useAdminStore = create<AdminStore>()((set, get) => ({
  // Initial State
  ...initialState,

  // Data Actions
  setStations: (stations) =>
    set({
      stations,
      lastRefresh: new Date().toISOString(),
      error: null,
    }),

  updateStation: (station, updates) =>
    set((state) => ({
      stations: state.stations.map((s) =>
        s.station === station ? { ...s, ...updates } : s
      ),
    })),

  setAlerts: (alerts) =>
    set({
      alerts: alerts.map((a) => ({ ...a, dismissed: false })),
      error: null,
    }),

  addAlert: (alert) =>
    set((state) => {
      // Check if alert already exists
      const exists = state.alerts.some((a) => a.alert_id === alert.alert_id);
      if (exists) return state;

      return {
        alerts: [alert, ...state.alerts],
      };
    }),

  dismissAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.alert_id === alertId ? { ...a, dismissed: true } : a
      ),
    })),

  undismissAlert: (alertId) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.alert_id === alertId ? { ...a, dismissed: false } : a
      ),
    })),

  clearDismissedAlerts: () =>
    set((state) => ({
      alerts: state.alerts.filter((a) => !a.dismissed),
    })),

  setBottlenecks: (bottlenecks) => set({ bottlenecks }),

  setMetricsSummary: (summary) => set({ metricsSummary: summary }),

  setDailyReport: (report) => set({ dailyReport: report }),

  // UI Actions
  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setLastRefresh: () => set({ lastRefresh: new Date().toISOString() }),

  setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

  setRefreshInterval: (interval) => set({ refreshInterval: interval }),

  setConnected: (connected) => set({ isConnected: connected }),

  // Filter Actions
  setSelectedStation: (station) => set({ selectedStation: station }),

  setShowDismissedAlerts: (show) => set({ showDismissedAlerts: show }),

  // Utility Actions
  refreshDashboard: () => {
    // This will be called to trigger a refresh
    // The actual API calls should be made in the component
    set({ lastRefresh: new Date().toISOString() });
  },

  reset: () => set(initialState),
}));

// ============================================================================
// Selectors
// ============================================================================

export const selectStations = (state: AdminStore) => state.stations;

export const selectStationByName = (stationName: string) => (state: AdminStore) =>
  state.stations.find((s) => s.station === stationName);

export const selectCriticalStations = (state: AdminStore) =>
  state.stations.filter((s) => s.status === 'critical');

export const selectAlerts = (state: AdminStore) =>
  state.showDismissedAlerts
    ? state.alerts
    : state.alerts.filter((a) => !a.dismissed);

export const selectActiveAlerts = (state: AdminStore) =>
  state.alerts.filter((a) => !a.dismissed);

export const selectCriticalAlerts = (state: AdminStore) =>
  state.alerts.filter((a) => a.severity === 'critical' && !a.dismissed);

export const selectAlertCount = (state: AdminStore) =>
  state.alerts.filter((a) => !a.dismissed).length;

export const selectBottlenecks = (state: AdminStore) => state.bottlenecks;

export const selectMetricsSummary = (state: AdminStore) => state.metricsSummary;

export const selectDailyReport = (state: AdminStore) => state.dailyReport;

export const selectIsLoading = (state: AdminStore) => state.isLoading;

export const selectError = (state: AdminStore) => state.error;

export const selectLastRefresh = (state: AdminStore) => state.lastRefresh;

export const selectAutoRefresh = (state: AdminStore) => state.autoRefresh;

export const selectIsConnected = (state: AdminStore) => state.isConnected;

// ============================================================================
// Computed Selectors
// ============================================================================

/**
 * Get total patients in system
 */
export const selectTotalPatients = (state: AdminStore) =>
  state.stations.reduce((sum, s) => sum + s.queue_length, 0);

/**
 * Get average wait time across all stations
 */
export const selectAverageWaitTime = (state: AdminStore) => {
  if (state.stations.length === 0) return 0;
  const total = state.stations.reduce((sum, s) => sum + s.average_wait_minutes, 0);
  return Math.round(total / state.stations.length);
};

/**
 * Get system health status
 */
export const selectSystemHealth = (state: AdminStore): 'healthy' | 'warning' | 'critical' => {
  const criticalCount = state.stations.filter((s) => s.status === 'critical').length;
  const warningCount = state.stations.filter((s) => s.status === 'warning').length;

  if (criticalCount > 0) return 'critical';
  if (warningCount > 1) return 'warning';
  return 'healthy';
};

/**
 * Check if station is bottleneck
 */
export const selectIsBottleneck = (stationName: string) => (state: AdminStore) =>
  state.bottlenecks.includes(stationName);
