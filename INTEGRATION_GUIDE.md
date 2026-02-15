# MediHack Integration Guide
## Connecting React Native Frontend to Phoenix AI Backend

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd mfu-hospital-web
npm install axios @react-native-async-storage/async-storage zustand
```

### 2. Environment Configuration

Create `.env` file in root:

```env
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_WS_URL=ws://localhost:8000
```

For production/demo:
```env
EXPO_PUBLIC_API_URL=https://your-backend-url.run.app
EXPO_PUBLIC_WS_URL=wss://your-backend-url.run.app
```

### 3. Start Backend (Phoenix AI)

```bash
cd phoenix-ai
uv sync
uvicorn phoenix_ai.api.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`

### 4. Start Frontend

```bash
cd mfu-hospital-web
npm start
```

Press:
- `i` for iOS simulator
- `a` for Android emulator
- `w` for web (experimental)

---

## 📚 File Structure Created

### Services
```
src/services/
├── api.ts          # HTTP client with all endpoints
└── websocket.ts    # WebSocket client for real-time updates
```

### State Management (Zustand)
```
src/stores/
├── queueStore.ts   # Patient queue state
└── adminStore.ts   # Admin dashboard state
```

### Patient Components
```
components/patient/
├── QueueTicket.tsx      # Queue number & wait time display
└── JourneyTracker.tsx   # Patient journey visualization
```

### Admin Components
```
components/admin/
├── StationCard.tsx      # Station metrics card
└── AlertPanel.tsx       # AI recommendations panel
```

---

## 🔧 Implementation Steps

### Step 1: Patient Check-In Screen

Create `app/(patient)/check-in.tsx`:

```tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { patientApi } from '@/src/services/api';
import { useQueueStore } from '@/src/stores/queueStore';
import { useRouter } from 'expo-router';

export default function CheckInScreen() {
  const [patientId, setPatientId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const setPatient = useQueueStore((state) => state.setPatient);
  const router = useRouter();

  const handleCheckIn = async () => {
    if (!patientId || !complaint) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await patientApi.checkIn({
        patient_id: patientId,
        chief_complaint: complaint,
        language: 'th',
      });

      setPatient({
        patient_id: response.patient_id,
        queue_number: response.queue_number,
        current_station: response.current_station,
        position_in_queue: response.position_in_queue,
        estimated_wait_minutes: response.estimated_wait_minutes,
        complexity_score: response.complexity_score,
        status: 'waiting',
        last_updated: new Date().toISOString(),
      });

      router.push('/(patient)/queue');
    } catch (error) {
      Alert.alert('Error', 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-6">ลงทะเบียน / Check-In</Text>
      
      <TextInput
        className="bg-white p-4 rounded-lg mb-4"
        placeholder="Patient ID (e.g., P042)"
        value={patientId}
        onChangeText={setPatientId}
      />
      
      <TextInput
        className="bg-white p-4 rounded-lg mb-4 h-32"
        placeholder="อาการของคุณวันนี้?"
        multiline
        value={complaint}
        onChangeText={setComplaint}
      />
      
      <TouchableOpacity
        className={`bg-blue-600 p-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
        onPress={handleCheckIn}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold">
          {loading ? 'Processing...' : 'Check In'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Step 2: Patient Queue Screen

Create `app/(patient)/queue.tsx`:

```tsx
import React, { useEffect } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useQueueStore } from '@/src/stores/queueStore';
import { patientApi } from '@/src/services/api';
import { useWebSocket } from '@/src/services/websocket';
import QueueTicket from '@/components/patient/QueueTicket';
import JourneyTracker from '@/components/patient/JourneyTracker';

export default function QueueScreen() {
  const { currentPatient, updatePosition, updateJourney } = useQueueStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // WebSocket for real-time updates
  useWebSocket({
    clientId: `patient_${currentPatient?.patient_id}`,
    onMessage: (data) => {
      if (data.event_type === 'queue_updated') {
        updatePosition(data.position, data.estimated_wait);
      }
    },
  });

  const onRefresh = async () => {
    if (!currentPatient) return;
    setRefreshing(true);
    try {
      const [status, journey] = await Promise.all([
        patientApi.getStatus(currentPatient.patient_id),
        patientApi.getJourney(currentPatient.patient_id),
      ]);
      updatePosition(status.position_in_queue, status.estimated_wait_minutes);
      updateJourney(journey.journey, journey.overall_progress_percent);
    } catch (error) {
      console.error('Refresh failed', error);
    }
    setRefreshing(false);
  };

  if (!currentPatient) return null;

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <QueueTicket
        queueNumber={currentPatient.queue_number}
        position={currentPatient.position_in_queue}
        estimatedWait={currentPatient.estimated_wait_minutes}
        currentStation={currentPatient.current_station}
      />

      {currentPatient.journey && (
        <JourneyTracker
          steps={currentPatient.journey}
          overallProgress={currentPatient.overall_progress_percent}
        />
      )}
    </ScrollView>
  );
}
```

### Step 3: Admin Dashboard Screen

Create `app/(admin)/dashboard.tsx`:

```tsx
import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useAdminStore } from '@/src/stores/adminStore';
import { adminApi } from '@/src/services/api';
import { useWebSocket } from '@/src/services/websocket';
import StationCard from '@/components/admin/StationCard';
import AlertPanel from '@/components/admin/AlertPanel';

export default function AdminDashboard() {
  const { stations, alerts, setStations, setAlerts, addAlert } = useAdminStore();
  const [refreshing, setRefreshing] = React.useState(false);

  // WebSocket for real-time admin updates
  useWebSocket({
    clientId: 'admin_001',
    onMessage: (data) => {
      if (data.event_type === 'bottleneck_detected') {
        addAlert({
          alert_id: `alert_${Date.now()}`,
          station: data.station,
          severity: data.severity,
          message: data.message || `Bottleneck detected at ${data.station}`,
          detected_at: new Date().toISOString(),
          recommendations: data.recommendations || [],
        });
      }
    },
  });

  const fetchData = async () => {
    try {
      const [realtimeRes, alertsRes] = await Promise.all([
        adminApi.getRealtime(),
        adminApi.getAlerts(),
      ]);
      setStations(realtimeRes.stations);
      setAlerts(alertsRes.alerts);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View className="p-4 bg-white">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">MFU Flow Control</Text>
          <View className="flex-row items-center">
            <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
            <Text className="text-green-600 font-semibold">Online</Text>
          </View>
        </View>
      </View>

      {/* Station Cards */}
      <Text className="text-lg font-semibold px-4 pt-4 pb-2">ข้อมูลเรียลไทม์</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        {stations.map((station, index) => (
          <StationCard key={index} {...station} />
        ))}
      </ScrollView>

      {/* Alerts */}
      {alerts.length > 0 && (
        <View className="mt-4">
          <AlertPanel
            alerts={alerts}
            onDismiss={(id) => console.log('Dismiss', id)}
          />
        </View>
      )}
    </ScrollView>
  );
}
```

---

## 🚀 API Endpoints Reference

### Patient Endpoints
- `POST /api/queue/check-in` - Patient check-in
- `GET /api/queue/status/{patient_id}` - Get current status
- `GET /api/queue/journey/{patient_id}` - Get full journey

### Admin Endpoints
- `GET /api/dashboard/realtime` - Real-time dashboard data
- `GET /api/dashboard/alerts` - Active alerts
- `GET /api/reports/daily` - Daily report
- `POST /api/dashboard/simulate/bottleneck/{station}` - Demo bottleneck

### WebSocket
- `ws://localhost:8000/ws/{client_id}` - Real-time updates

---

## 🎭 Demo Flow for Judges

### 1. Patient Journey
1. Open patient app
2. Enter Patient ID: `P042`
3. Enter complaint: "ปวดหัว มีไข้"
4. Submit → Get queue number #42
5. See estimated wait: 85 minutes
6. See suggestion to grab food

### 2. Admin Dashboard
1. Open admin dashboard
2. See all stations with color codes
3. Pharmacy shows 🔴 (45 people in queue)
4. Alert appears with AI recommendations
5. Click "Apply Action 1" to demonstrate

### 3. Real-Time Updates (Demo)
1. Simulate bottleneck: `POST /api/dashboard/simulate/bottleneck/pharmacy`
2. Watch patient app update in real-time
3. Watch admin dashboard show new alert
4. Resolve: `POST /api/dashboard/simulate/resolve/pharmacy`

---

## 🐞 Troubleshooting

### Backend not connecting
```bash
# Check backend is running
curl http://localhost:8000/health

# Expected response:
# {"status":"healthy","redis_connected":true}
```

### WebSocket not working
- Check firewall settings
- Use `ws://` for localhost, `wss://` for HTTPS
- Verify client_id format: `patient_{id}` or `admin_{id}`

### Components not rendering
```bash
# Clear cache
npm start -- --clear

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📝 Next Steps

1. **Implement screens** using code above
2. **Test API connection** with Postman/curl
3. **Test WebSocket** with browser console
4. **Style components** with NativeWind
5. **Deploy backend** to Google Cloud Run
6. **Update .env** with production URL

---

## 📦 Deployment Checklist

### Backend (Google Cloud Run)
```bash
cd phoenix-ai
gcloud run deploy phoenix-ai \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Frontend (Expo)
```bash
cd mfu-hospital-web
eas build --platform android
eas build --platform ios
```

---

## ✅ Verification

Test each endpoint:

```bash
# Health check
curl http://localhost:8000/health

# Check-in
curl -X POST http://localhost:8000/api/queue/check-in \
  -H "Content-Type: application/json" \
  -d '{
    "patient_id": "P042",
    "chief_complaint": "ปวดหัว",
    "language": "th"
  }'

# Dashboard
curl http://localhost:8000/api/dashboard/realtime
```

All done! 🎉
