/**
 * API Client for Phoenix AI Backend
 * Handles all HTTP requests to FastAPI endpoints
 */

import axios, { AxiosInstance } from 'axios';

// API Base URL - change to deployed URL in production
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🔵 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================================
// Type Definitions
// ============================================================================

export interface CheckInRequest {
  patient_id: string;
  chief_complaint: string;
  appointment_time?: string;
  language: 'th' | 'en';
}

export interface CheckInResponse {
  success: boolean;
  patient_id: string;
  queue_number: number;
  current_station: string;
  position_in_queue: number;
  estimated_wait_minutes: number;
  complexity_score: {
    complexity: string;
    estimated_duration_minutes: number;
    reasoning: string;
    priority_score: number;
  };
  message: string;
  timestamp: string;
}

export interface QueueStatusResponse {
  patient_id: string;
  queue_number: number;
  current_station: string;
  position_in_queue: number;
  estimated_wait_minutes: number;
  status: string;
  last_updated: string;
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

export interface PatientJourneyResponse {
  patient_id: string;
  queue_number: number;
  check_in_time: string;
  current_station: string;
  overall_progress_percent: number;
  journey: JourneyStep[];
  total_elapsed_minutes: number;
  estimated_remaining_minutes: number;
}

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
}

export interface RealtimeDashboardResponse {
  stations: StationMetrics[];
  total_patients_in_system: number;
  average_journey_time_minutes: number;
  bottlenecks: string[];
  last_refresh: string;
}

export interface AlertsResponse {
  alerts: DashboardAlert[];
  total_count: number;
}

export interface DailyReportResponse {
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
// Patient API Endpoints
// ============================================================================

export const patientApi = {
  /**
   * Patient check-in with chief complaint
   */
  checkIn: async (data: CheckInRequest): Promise<CheckInResponse> => {
    const response = await apiClient.post<CheckInResponse>('/api/queue/check-in', data);
    return response.data;
  },

  /**
   * Get current queue status for patient
   */
  getStatus: async (patientId: string): Promise<QueueStatusResponse> => {
    const response = await apiClient.get<QueueStatusResponse>(`/api/queue/status/${patientId}`);
    return response.data;
  },

  /**
   * Get full patient journey across all stations
   */
  getJourney: async (patientId: string): Promise<PatientJourneyResponse> => {
    const response = await apiClient.get<PatientJourneyResponse>(`/api/queue/journey/${patientId}`);
    return response.data;
  },

  /**
   * Clear patient data (testing/admin only)
   */
  clearData: async (patientId: string): Promise<void> => {
    await apiClient.delete(`/api/queue/clear/${patientId}`);
  },
};

// ============================================================================
// Admin API Endpoints
// ============================================================================

export const adminApi = {
  /**
   * Get real-time dashboard data for all stations
   */
  getRealtime: async (): Promise<RealtimeDashboardResponse> => {
    const response = await apiClient.get<RealtimeDashboardResponse>('/api/dashboard/realtime');
    return response.data;
  },

  /**
   * Get active alerts and AI recommendations
   */
  getAlerts: async (): Promise<AlertsResponse> => {
    const response = await apiClient.get<AlertsResponse>('/api/dashboard/alerts');
    return response.data;
  },

  /**
   * Get daily efficiency report
   */
  getDailyReport: async (): Promise<DailyReportResponse> => {
    const response = await apiClient.get<DailyReportResponse>('/api/dashboard/reports/daily');
    return response.data;
  },

  /**
   * Get high-level metrics summary
   */
  getMetricsSummary: async (): Promise<any> => {
    const response = await apiClient.get('/api/dashboard/metrics/summary');
    return response.data;
  },

  /**
   * Simulate bottleneck (demo/testing only)
   */
  simulateBottleneck: async (station: string, queueIncrease: number = 20): Promise<any> => {
    const response = await apiClient.post(`/api/dashboard/simulate/bottleneck/${station}`, null, {
      params: { queue_increase: queueIncrease },
    });
    return response.data;
  },

  /**
   * Resolve bottleneck (demo/testing only)
   */
  resolveBottleneck: async (station: string, queueDecrease: number = 15): Promise<any> => {
    const response = await apiClient.post(`/api/dashboard/simulate/resolve/${station}`, null, {
      params: { queue_decrease: queueDecrease },
    });
    return response.data;
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthApi = {
  /**
   * Check API health status
   */
  checkHealth: async (): Promise<any> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  /**
   * Get API root info
   */
  getRoot: async (): Promise<any> => {
    const response = await apiClient.get('/');
    return response.data;
  },
};

export default apiClient;
