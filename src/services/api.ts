/**
 * API Client for Phoenix AI Backend
 * Handles all HTTP requests to the FastAPI server
 */

import axios, { AxiosError } from 'axios';

// Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
const API_TIMEOUT = 10000; // 10 seconds

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for logging, auth tokens, etc.)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (for error handling)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('❌ Response Error:', error.response?.status, error.message);
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

export interface RealtimeDashboardResponse {
  stations: StationMetrics[];
  total_patients_in_system: number;
  average_journey_time_minutes: number;
  bottlenecks: string[];
  last_refresh: string;
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
   * Check in a patient and get queue ticket
   */
  checkIn: async (data: CheckInRequest): Promise<CheckInResponse> => {
    const response = await apiClient.post<CheckInResponse>('/api/queue/check-in', data);
    return response.data;
  },

  /**
   * Get current queue status for a patient
   */
  getStatus: async (patientId: string): Promise<QueueStatusResponse> => {
    const response = await apiClient.get<QueueStatusResponse>(
      `/api/queue/status/${patientId}`
    );
    return response.data;
  },

  /**
   * Get full patient journey across all stations
   */
  getJourney: async (patientId: string): Promise<PatientJourneyResponse> => {
    const response = await apiClient.get<PatientJourneyResponse>(
      `/api/queue/journey/${patientId}`
    );
    return response.data;
  },

  /**
   * Clear patient data (for testing)
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
   * Get real-time dashboard data
   */
  getRealtime: async (): Promise<RealtimeDashboardResponse> => {
    const response = await apiClient.get<RealtimeDashboardResponse>(
      '/api/dashboard/realtime'
    );
    return response.data;
  },

  /**
   * Get active alerts and recommendations
   */
  getAlerts: async (): Promise<AlertsResponse> => {
    const response = await apiClient.get<AlertsResponse>('/api/dashboard/alerts');
    return response.data;
  },

  /**
   * Get daily efficiency report
   */
  getDailyReport: async (): Promise<DailyReportResponse> => {
    const response = await apiClient.get<DailyReportResponse>(
      '/api/reports/daily'
    );
    return response.data;
  },

  /**
   * Get metrics summary
   */
  getMetricsSummary: async (): Promise<any> => {
    const response = await apiClient.get('/api/dashboard/metrics/summary');
    return response.data;
  },

  /**
   * Simulate bottleneck (for demo)
   */
  simulateBottleneck: async (station: string, queueIncrease: number = 20): Promise<any> => {
    const response = await apiClient.post(
      `/api/dashboard/simulate/bottleneck/${station}`,
      null,
      { params: { queue_increase: queueIncrease } }
    );
    return response.data;
  },

  /**
   * Resolve bottleneck (for demo)
   */
  resolveBottleneck: async (station: string, queueDecrease: number = 15): Promise<any> => {
    const response = await apiClient.post(
      `/api/dashboard/simulate/resolve/${station}`,
      null,
      { params: { queue_decrease: queueDecrease } }
    );
    return response.data;
  },
};

// ============================================================================
// Prediction API Endpoints
// ============================================================================

export const predictionApi = {
  /**
   * Predict wait time for a station
   */
  predictWaitTime: async (data: {
    station: string;
    complexity_score: string;
    time_of_day?: string;
    day_of_week?: number;
  }): Promise<any> => {
    const response = await apiClient.post('/api/predict/wait-time', data);
    return response.data;
  },

  /**
   * Forecast patient volume
   */
  forecastVolume: async (hoursAhead: number = 4): Promise<any> => {
    const response = await apiClient.get('/api/predict/volume', {
      params: { hours_ahead: hoursAhead },
    });
    return response.data;
  },

  /**
   * Get hourly volume forecast
   */
  getHourlyForecast: async (hours: number = 8): Promise<any> => {
    const response = await apiClient.get('/api/predict/volume/hourly', {
      params: { hours },
    });
    return response.data;
  },
};

// ============================================================================
// Health Check
// ============================================================================

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Export base URL for WebSocket connection
export const WS_BASE_URL = API_BASE_URL.replace('http', 'ws');
