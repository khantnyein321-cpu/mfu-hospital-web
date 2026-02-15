# MFU Hospital Web - Frontend Integration Guide

## MediHack 2026 - Patient & Admin Dashboard

This React Native (Expo) app provides patient queue tracking and admin dashboard for the MFU Hospital Queue Management System.

## 🛠️ Prerequisites

- Node.js 18+ and npm
- Expo CLI
- iOS Simulator / Android Emulator / Physical device with Expo Go
- Phoenix AI Backend running (see [backend setup](https://github.com/Timmythaw/phoenix-ai/blob/main/SETUP.md))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/khantnyein321-cpu/mfu-hospital-web.git
cd mfu-hospital-web
```

### 2. Install Dependencies

```bash
npm install

# Install additional dependencies for API integration
npm install axios
```

### 3. Configure Environment

Create `.env` file in the root:

```env
# Backend API URL
EXPO_PUBLIC_API_URL=http://localhost:8000

# For testing on physical device (replace with your IP)
# EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
```

### 4. Start the App

```bash
# Start Expo development server
npm start

# Or specific platforms
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

## 📱 Project Structure

```
mfu-hospital-web/
├── src/
│   ├── services/
│   │   └── api.ts           # API client with all endpoints
│   ├── stores/
│   │   ├── queueStore.ts    # Patient state management
│   │   └── adminStore.ts    # Admin dashboard state
│   ├── themes/
│   └── (other source files)
├── app/
│   ├── (patient)/         # Patient screens
│   └── (admin)/           # Admin screens
├── components/
│   ├── patient/           # Patient UI components
│   └── admin/             # Admin UI components
├── package.json
└── README.md
```

## 🔌 API Integration

### Using the API Client

The API client is already configured in `src/services/api.ts`.

#### Patient Side Example

```typescript
import { patientApi, useQueueStore } from '@/src/services/api';
import { useQueueStore } from '@/src/stores/queueStore';

// Check-in a patient
const handleCheckIn = async () => {
  try {
    const response = await patientApi.checkIn({
      patient_id: 'P042',
      chief_complaint: 'ปวดหัว มีไข้',
      language: 'th',
    });
    
    // Update store
    useQueueStore.getState().setPatient(response);
    
    console.log('Queue number:', response.queue_number);
    console.log('Position:', response.position_in_queue);
    console.log('Estimated wait:', response.estimated_wait_minutes);
  } catch (error) {
    console.error('Check-in failed:', error);
  }
};

// Get queue status
const checkStatus = async (patientId: string) => {
  const status = await patientApi.getStatus(patientId);
  useQueueStore.getState().updateStatus(status);
};

// Get patient journey
const trackJourney = async (patientId: string) => {
  const journey = await patientApi.getJourney(patientId);
  useQueueStore.getState().updateJourney(journey);
};
```

#### Admin Dashboard Example

```typescript
import { adminApi, useAdminStore } from '@/src/services/api';
import { useAdminStore } from '@/src/stores/adminStore';

// Fetch real-time dashboard
const fetchDashboard = async () => {
  try {
    const data = await adminApi.getRealtime();
    useAdminStore.getState().setDashboardData(data);
    
    console.log('Total patients:', data.total_patients_in_system);
    console.log('Bottlenecks:', data.bottlenecks);
  } catch (error) {
    console.error('Failed to fetch dashboard:', error);
  }
};

// Get active alerts
const fetchAlerts = async () => {
  const alerts = await adminApi.getAlerts();
  useAdminStore.getState().setAlerts(alerts.alerts);
};

// Simulate bottleneck (for demo)
const simulateBottleneck = async () => {
  await adminApi.simulateBottleneck('pharmacy', 20);
  // Refresh dashboard
  await fetchDashboard();
};
```

### Using Zustand Stores

#### Patient Store

```typescript
import { useQueueStore } from '@/src/stores/queueStore';

function QueueScreen() {
  const { currentPatient, progressPercent, isLoading } = useQueueStore();
  
  if (!currentPatient) {
    return <Text>Please check in first</Text>;
  }
  
  return (
    <View>
      <Text>Queue #{currentPatient.queue_number}</Text>
      <Text>Position: {currentPatient.position}</Text>
      <Text>Wait: {currentPatient.estimated_wait} min</Text>
      <Text>Progress: {progressPercent}%</Text>
    </View>
  );
}
```

#### Admin Store

```typescript
import { useAdminStore } from '@/src/stores/adminStore';

function AdminDashboard() {
  const { stations, alerts, systemStatus } = useAdminStore();
  
  return (
    <View>
      <Text>System Status: {systemStatus}</Text>
      <Text>Active Alerts: {alerts.length}</Text>
      
      {stations.map((station) => (
        <StationCard key={station.station} {...station} />
      ))}
    </View>
  );
}
```

## 🔄 Real-Time Updates

### Auto-Refresh Pattern

```typescript
import { useEffect } from 'react';
import { adminApi, useAdminStore } from '@/src/services/api';

function DashboardScreen() {
  const setDashboardData = useAdminStore((state) => state.setDashboardData);
  
  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      const data = await adminApi.getRealtime();
      setDashboardData(data);
    };
    
    fetchData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <DashboardUI />;
}
```

## 🎭 Demo Flow

### Patient Side Demo

1. **Check-In Screen**
   - Enter patient ID (e.g., `P042`)
   - Enter complaint in Thai or English
   - Submit → Get queue number

2. **Queue Ticket Screen**
   - See queue number (e.g., #42)
   - Current position (e.g., 12th in line)
   - Estimated wait time (e.g., 85 minutes)
   - Freedom suggestion if wait > 60 min

3. **Journey Tracker**
   - Visual progress through stations
   - Status: ✅ Completed, 🔵 Waiting, ⚪ Pending
   - Time spent at each station

### Admin Dashboard Demo

1. **Real-Time Flow**
   - Station cards with color coding:
     - 🟢 Green: Optimal (<15 min wait)
     - 🟡 Yellow: Warning (15-30 min)
     - 🔴 Red: Critical (>30 min)
   - Queue lengths and throughput

2. **AI Alert Panel**
   - Critical alerts (e.g., Pharmacy: 45 people, 42 min wait)
   - AI recommendations:
     - Open counter 4
     - Reassign staff
     - Offer home delivery
   - Action buttons to apply/dismiss

3. **Metrics Summary**
   - Total patients in system
   - Average wait time vs target
   - Bottleneck identification
   - Patient satisfaction score

## 🐞 Troubleshooting

### Cannot Connect to Backend

**Error**: `Network request failed`

**Solutions**:

1. **Check backend is running**:
   ```bash
   curl http://localhost:8000/health
   ```

2. **For physical device testing**, use your computer's IP:
   ```env
   EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
   ```
   
   Find your IP:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

3. **Check CORS settings** in backend (already configured for `*` in dev)

### Store Not Updating

**Issue**: UI doesn't reflect state changes

**Solution**: Make sure you're using Zustand correctly:

```typescript
// ❌ Wrong
const store = useQueueStore();
store.currentPatient = newPatient; // Direct mutation doesn't work

// ✅ Correct
const setPatient = useQueueStore((state) => state.setPatient);
setPatient(newPatient);
```

### TypeScript Errors

**Error**: `Cannot find module '@/src/services/api'`

**Solution**: Check `tsconfig.json` has path mapping:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 🚀 Next Steps

1. **Create Screen Components**:
   - Patient check-in form
   - Queue ticket display
   - Journey tracker
   - Admin dashboard
   - Alert panel

2. **Add WebSocket Support** (optional for real-time):
   ```bash
   npm install socket.io-client
   ```

3. **Styling with NativeWind**:
   - Already configured in `tailwind.config.js`
   - Use Tailwind classes: `className="bg-blue-500 p-4 rounded-lg"`

4. **Test with Mock Data**:
   - Backend provides 50 mock patients
   - Bottleneck at OPD GP (45 patients)
   - Active alerts with recommendations

## 🔗 Useful Links

- **Backend API Docs**: http://localhost:8000/docs
- **Backend Repo**: [github.com/Timmythaw/phoenix-ai](https://github.com/Timmythaw/phoenix-ai)
- **Backend Setup**: [SETUP.md](https://github.com/Timmythaw/phoenix-ai/blob/main/SETUP.md)

## 👥 Team Phoenix

**MediHack 2026** - Mae Fah Luang University

For issues or questions, open an issue on GitHub.
