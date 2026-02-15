# 🤖 AI Supervisor Chat Integration Guide

## ✅ What's Done

Your existing chat page in `app/Auth/components/ChatView.tsx` is now **fully connected** to the AI supervisor agent!

### Backend (Phoenix AI) ✅
- **New endpoint:** `POST /api/supervisor/chat`
- Analyzes hospital context (stations, alerts, bottlenecks)
- Provides intelligent recommendations
- Supports Thai and English queries

### Frontend (Web Dashboard) ✅
- **ChatView** now calls real AI backend
- Auto-fetches context from `adminStore`
- Shows real-time hospital metrics
- Quick action buttons for common queries
- Beautiful UI with typing indicators

---

## 🚀 How to Use

### 1. Start Backend
```bash
cd ~/phoenix-ai
uvicorn phoenix_ai.api.main:app --reload
```

### 2. Start Frontend
```bash
cd ~/mfu-hospital-web
npm start
```

### 3. Open Chat in Dashboard
Navigate to the chat page in your web dashboard. The chat is already integrated!

---

## 💬 Chat Capabilities

### Bottleneck Analysis
**Ask:**
- "What are the current bottlenecks?"
- "คอขวดตรงไหนบ้าง?" (Where are the bottlenecks?)

**Gets:**
- List of congested stations
- Queue lengths and wait times
- Specific recommendations per station
- Estimated impact of actions

### Wait Time Optimization
**Ask:**
- "How can we reduce wait times?"
- "Which station has the longest wait?"
- "ลดเวลารอได้ยังไง?" (How to reduce wait time?)

**Gets:**
- Wait time analysis across stations
- Prioritized recommendations
- Quick wins vs. long-term improvements
- Expected time savings

### Staff Allocation
**Ask:**
- "Which stations need more staff?"
- "How many staff should I add?"
- "จัดพนักงานอย่างไร?" (How to allocate staff?)

**Gets:**
- Staffing needs per station
- Priority levels (critical/medium)
- Number of staff to add
- Expected impact

### Summary/Status
**Ask:**
- "Give me a summary"
- "What's the current status?"
- "สรุปสถานะตอนนี้" (Summarize current situation)

**Gets:**
- Total patients in system
- Average wait time
- Number of critical stations
- Active alerts and bottlenecks
- Overall status (Normal/Warning/Critical)

---

## 📊 Context Provided to AI

The chat automatically sends this context with every message:

```typescript
{
  timestamp: "2026-02-15T11:20:00Z",
  
  // Station metrics
  stations: [
    {
      name: "opd_gp",
      queue_length: 45,
      average_wait: 42,
      status: "critical",
      throughput: 2.5
    },
    // ... all 8 stations
  ],
  
  // Active alerts
  alerts: [
    {
      station: "opd_gp",
      severity: "critical",
      message: "ห้องตรวจ OPD GP: คิว 45 คน"
    }
  ],
  
  // Bottlenecks
  bottlenecks: ["opd_gp"],
  
  // Summary
  summary: {
    total_patients: 90,
    critical_stations: 1,
    average_wait: 28
  }
}
```

---

## 🔧 API Endpoint Details

### Endpoint
```
POST http://localhost:8000/api/supervisor/chat
```

### Request Body
```json
{
  "message": "What are the current bottlenecks?",
  "context": {
    // See context structure above
  },
  "conversation_history": [  // Optional
    {"role": "user", "content": "..."},
    {"role": "assistant", "content": "..."}
  ]
}
```

### Response
```json
{
  "response": "🚨 I've identified 1 bottleneck:\n\n• OPD_GP:\n  - Queue: 45 patients\n  - Avg wait: 42 minutes\n  💡 Recommendation: Add 3 staff member(s)\n     Expected impact: Reduce wait by ~20 minutes",
  "actions": [
    {
      "type": "add_staff",
      "station": "opd_gp",
      "count": 3,
      "expected_impact": "Reduce wait by 20 min"
    }
  ],
  "metadata": {
    "bottleneck_count": 1
  }
}
```

---

## 🎭 Demo Flow

### 1. Show Initial State
- Open chat
- Point out context summary (90 patients, 2 alerts, 1 bottleneck)

### 2. Ask About Bottlenecks
- Click quick action: "🚨 Current bottlenecks?"
- AI responds with:
  - OPD GP has 45 patients
  - 42-minute average wait
  - Recommends adding 3 staff
  - Expected 20-minute reduction

### 3. Ask About Wait Times
- Type: "How can we reduce wait times?"
- AI provides:
  - System-wide analysis
  - Top 3 priority stations
  - Specific actions for each

### 4. Ask for Summary
- Click quick action: "📊 Summary"
- Get complete hospital overview

---

## 🚀 Upgrade to Pydantic-AI Agent (Optional)

Currently using rule-based AI. To upgrade to your Pydantic-AI agent:

### 1. Update Backend Endpoint

In `src/phoenix_ai/api/routes/supervisor.py`, replace the `supervisor_chat` function:

```python
from pydantic_ai import Agent
from your_supervisor_agent import SupervisorAgent

# Initialize your agent
supervisor_agent = SupervisorAgent()

@router.post("/chat", response_model=ChatResponse)
async def supervisor_chat(request: ChatRequest) -> ChatResponse:
    """
    Call your Pydantic-AI Supervisor Agent
    """
    # Convert context to agent format
    agent_context = {
        "stations": request.context.stations,
        "alerts": request.context.alerts,
        "bottlenecks": request.context.bottlenecks,
        "summary": request.context.summary,
    }
    
    # Call your agent
    agent_response = await supervisor_agent.process(
        query=request.message,
        context=agent_context,
        history=request.conversation_history
    )
    
    return ChatResponse(
        response=agent_response.text,
        actions=agent_response.actions,
        metadata=agent_response.metadata
    )
```

### 2. No Frontend Changes Needed!
The frontend already works with any response format.

---

## ✅ Testing Checklist

- [ ] Backend running: `http://localhost:8000`
- [ ] Frontend running: Expo app open
- [ ] Navigate to chat page in dashboard
- [ ] Context summary shows real data
- [ ] Quick action buttons work
- [ ] Can type custom messages
- [ ] AI responds with relevant analysis
- [ ] Thai and English queries both work
- [ ] Actions shown in AI responses
- [ ] Loading indicator appears while waiting

---

## 🐞 Troubleshooting

### Chat shows "Connection Error"
```bash
# Check backend is running
curl http://localhost:8000/health

# Check supervisor endpoint
curl -X POST http://localhost:8000/api/supervisor/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "test", "context": {"stations": [], "alerts": [], "bottlenecks": [], "summary": {}}}'
```

### Context is empty
- Make sure you're on the admin dashboard first
- The `adminStore` needs to be populated with station data
- Try refreshing the dashboard before opening chat

### AI gives generic responses
- This is normal if context is empty
- Load the admin dashboard to populate context
- Then open chat - it will use real hospital data

---

## 📝 Example Conversation

**User:** What are the current bottlenecks?

**AI:** 🚨 I've identified 1 bottleneck:

• OPD_GP:
  - Queue: 45 patients
  - Avg wait: 42 minutes
  💡 Recommendation: Add 3 staff member(s)
     Expected impact: Reduce wait by ~20 minutes

---

**User:** Which stations need more staff?

**AI:** 👥 Staff Allocation Analysis:

• OPD_GP:
  Current: 45 patients, 42 min wait
  Recommendation: Add 3 staff member(s)
  Priority: 🔴 High

• PHARMACY:
  Current: 23 patients, 18 min wait
  Recommendation: Add 2 staff member(s)
  Priority: 🟡 Medium

---

## 🎉 Summary

✅ **Chat is fully integrated!**
✅ **Connects to AI supervisor endpoint**
✅ **Uses real hospital context**
✅ **Supports Thai and English**
✅ **Beautiful UI with quick actions**
✅ **Ready for demo!**

**Just start both servers and open the chat page!** 🚀
