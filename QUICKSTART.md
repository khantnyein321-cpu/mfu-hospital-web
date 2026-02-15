# 🚀 MediHack Quick Start Guide
## Running Connected Frontend + Backend in 5 Minutes

## ✅ What's Ready

### Backend (Phoenix AI) ✅
- FastAPI server with all endpoints
- Mock database with 50 patients
- Pre-configured bottleneck (OPD: 45 patients)
- 2 AI alerts with Thai recommendations
- WebSocket for real-time updates
- Demo controls to simulate/resolve bottlenecks

### Frontend (React Native) ✅
- **Patient Screens**:
  - Check-in with AI complexity scoring
  - Queue tracking with real-time updates
  - Journey visualization through stations
  - "Freedom to roam" suggestions
  
- **Admin Dashboard**:
  - Real-time station metrics with color codes
  - AI alert panel with recommendations
  - Bottleneck visualization
  - **Supervisor Chat** (ready for your agent integration)
  
- **Components**:
  - QueueTicket, JourneyTracker
  - StationCard, AlertPanel
  - SupervisorChat (AI agent interface)

---

## 🛠️ Local Setup (2 Terminals)

### Terminal 1: Start Backend

```bash
# Navigate to backend
cd ~/phoenix-ai

# Activate environment (if using venv)
source .venv/bin/activate

# Or sync with uv
uv sync

# Start FastAPI server
uvicorn phoenix_ai.api.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Verify backend:**
```bash
# In another terminal
curl http://localhost:8000/health
# Should return: {"status":"healthy","redis_connected":true}
```

### Terminal 2: Start Frontend

```bash
# Navigate to frontend
cd ~/mfu-hospital-web

# Pull latest code
git pull origin main

# Install dependencies (first time only)
npm install

# Create .env file (if not exists)
echo "EXPO_PUBLIC_API_URL=http://localhost:8000" > .env
echo "EXPO_PUBLIC_WS_URL=ws://localhost:8000" >> .env

# Start Expo
npm start
```

**Press:**
- `i` for iOS Simulator
- `a` for Android Emulator  
- `w` for Web (experimental)

---

## 🎭 Demo Flow for Judges

### Scene 1: Patient Experience (2 min)

1. **Open patient app** → Check-in screen
2. **Click "Quick Fill (Demo)"** → Auto-fills P042
3. **Submit Check-in**
   - Get queue #42
   - Position: 12th in line
   - Wait time: **85 minutes**
   - 💡 Suggestion: "You have 1 hour, grab food!"
4. **Show journey tracker** → See progress through stations
5. **Pull to refresh** → Real-time updates

### Scene 2: Admin Dashboard (3 min)

1. **Open admin dashboard**
2. **Point out summary:**
   - 90 patients in system
   - OPD: 🔴 45 people (critical!)
   - Pharmacy: 🟡 23 people (warning)
3. **Show AI Alert:**
   - "ห้องตรวจ OPD GP: คิว 45 คน"
   - 3 AI recommendations in Thai
4. **Click "Open Supervisor Chat"**
   - Ask: "What are the current bottlenecks?"
   - Get AI analysis with recommendations
5. **Demo Controls:**
   - Click "Simulate Bottleneck (Pharmacy +20)"
   - Watch real-time update: 23 → 43 🔴
   - New alert appears!
   - Click "Resolve Bottleneck (Pharmacy -15)"
   - Watch: 43 → 28 🟡

---

## 🤖 Supervisor Chat Integration

### Current State (Mock)
The chat works with mock responses for demo purposes.

### Connect Your Pydantic-AI Agent

**File:** `app/(admin)/dashboard.tsx`

**Replace this function:**
```typescript
const handleSupervisorMessage = async (message: string, context: any) => {
  // TODO: Replace with your actual Pydantic-AI Supervisor agent call
  console.log('🤖 Supervisor request:', message);
  console.log('📊 Context:', context);
  
  // YOUR SUPERVISOR AGENT HERE:
  const response = await fetch('http://localhost:8001/supervisor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message, 
      context: {
        stations: context.stations,
        alerts: context.alerts,
        bottlenecks: context.bottlenecks,
        timestamp: context.timestamp
      }
    }),
  });
  
  const data = await response.json();
  return data.response;
};
```

**Context Provided to Agent:**
```typescript
{
  timestamp: "2026-02-15T10:30:00Z",
  stations: [
    { name: "opd_gp", queue_length: 45, average_wait: 42, status: "critical" },
    { name: "pharmacy", queue_length: 23, average_wait: 18, status: "warning" },
    // ... more stations
  ],
  alerts: [
    { station: "opd_gp", severity: "critical", message: "..." }
  ],
  bottlenecks: ["opd_gp"],
  summary: {
    total_patients: 90,
    critical_stations: 1,
    average_wait: 28
  }
}
```

---

## 📡 API Endpoints

### Patient Endpoints
```bash
# Check-in
POST http://localhost:8000/api/queue/check-in
Body: { "patient_id": "P042", "chief_complaint": "ปวดหัว", "language": "th" }

# Get status
GET http://localhost:8000/api/queue/status/P042

# Get journey
GET http://localhost:8000/api/queue/journey/P042
```

### Admin Endpoints
```bash
# Real-time dashboard
GET http://localhost:8000/api/dashboard/realtime

# Get alerts
GET http://localhost:8000/api/dashboard/alerts

# Simulate bottleneck (demo)
POST http://localhost:8000/api/dashboard/simulate/bottleneck/pharmacy

# Resolve bottleneck (demo)
POST http://localhost:8000/api/dashboard/simulate/resolve/pharmacy
```

### WebSocket
```javascript
// Patient updates
ws://localhost:8000/ws/patient_P042

// Admin updates
ws://localhost:8000/ws/admin_dashboard
```

---

## 🐞 Troubleshooting

### Backend won't start
```bash
# Check Redis
redis-cli ping  # Should return PONG

# If not running:
redis-server

# Or on Mac:
brew services start redis
```

### Frontend can't connect
```bash
# Check backend is running:
curl http://localhost:8000/health

# Check .env file exists:
cat .env

# Restart Expo with cache clear:
npm start -- --clear
```

### Components not rendering
```bash
# Clear Metro bundler cache
rm -rf node_modules
npm install
npm start -- --clear
```

### WebSocket not connecting
- Check firewall settings
- Ensure backend is running on `0.0.0.0:8000`
- For physical device: replace `localhost` with your computer's IP in `.env`

---

## 📊 File Structure

```
~/
├── phoenix-ai/                        # Backend
│   ├── src/phoenix_ai/
│   │   ├── api/
│   │   │   ├── main.py                 # FastAPI app
│   │   │   ├── routes/
│   │   │   │   ├── admin.py           # Admin endpoints ✅
│   │   │   │   └── patients.py         # Patient endpoints ✅
│   │   │   └── schemas.py             # Pydantic models
│   │   └── data/
│   │       └── mock_db.py             # Mock database ✅
│   └── pyproject.toml
│
└── mfu-hospital-web/                # Frontend
    ├── src/
    │   ├── services/
    │   │   ├── api.ts                 # HTTP client ✅
    │   │   └── websocket.ts           # WebSocket ✅
    │   └── stores/
    │       ├── queueStore.ts          # Patient state ✅
    │       └── adminStore.ts          # Admin state ✅
    ├── components/
    │   ├── patient/
    │   │   ├── QueueTicket.tsx        ✅
    │   │   └── JourneyTracker.tsx     ✅
    │   └── admin/
    │       ├── StationCard.tsx        ✅
    │       ├── AlertPanel.tsx         ✅
    │       └── SupervisorChat.tsx     ✅ 🤖
    ├── app/
    │   ├── (patient)/
    │   │   ├── check-in.tsx           ✅
    │   │   └── queue.tsx              ✅
    │   └── (admin)/
    │       └── dashboard.tsx          ✅
    ├── .env                           ⚠️ CREATE THIS
    ├── INTEGRATION_GUIDE.md           ✅
    └── QUICKSTART.md                  ✅ (this file)
```

---

## ✅ Pre-Demo Checklist

- [ ] Backend running on http://localhost:8000
- [ ] `curl http://localhost:8000/health` returns `{"status":"healthy"}`
- [ ] Frontend running (Expo QR code showing)
- [ ] `.env` file created with correct URLs
- [ ] Redis running (`redis-cli ping` returns `PONG`)
- [ ] Tested patient check-in flow
- [ ] Tested admin dashboard with demo controls
- [ ] Supervisor chat opens and responds
- [ ] WebSocket shows "🔗 Live" status

---

## 🎉 You're Ready!

**Two commands to start everything:**

```bash
# Terminal 1
cd ~/phoenix-ai && uvicorn phoenix_ai.api.main:app --reload

# Terminal 2  
cd ~/mfu-hospital-web && npm start
```

**Demo in 3 steps:**
1. Show patient check-in → Get queue #42, 85 min wait
2. Show admin dashboard → OPD bottleneck with AI alerts
3. Open supervisor chat → Ask about bottlenecks, get recommendations

---

## 🔗 Resources

- Backend API Docs: http://localhost:8000/docs
- Integration Guide: `INTEGRATION_GUIDE.md`
- Repository: https://github.com/khantnyein321-cpu/mfu-hospital-web

Good luck with your hackathon presentation! 🚀✨
