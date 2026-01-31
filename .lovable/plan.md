

# Phase 4: Video Calling with Daily.co

## Overview

Integrate Daily.co for real-time 1-to-1 video calls between teachers and students. This replaces the current simulated call flow with actual WebRTC video calling.
use system that are free.
---

## Architecture

```text
Teacher clicks "Call"
        |
        v
Edge Function: create-daily-room
        |
        v
Daily.co API creates room → Returns room URL
        |
        v
Store room_id & room_url in classes table
        |
        v
Supabase Realtime notifies student
        |
        v
Student joins → Both in video room
        |
        v
Teacher ends call → Class marked completed
```

---

## Implementation Steps

### 1. Daily.co API Key Setup

**Action Required**: User must provide their Daily.co API key

- Daily.co offers a free tier with 10,000 minutes/month
- API key stored securely as a backend secret
- Used only in edge function (never exposed to frontend)

---

### 2. Edge Function: create-daily-room

**New file**: `supabase/functions/create-daily-room/index.ts`

**Purpose**: Securely create Daily.co rooms server-side

**Functionality**:
- Accepts class_id, teacher_id, student_id
- Creates a Daily.co room with:
  - Privacy: private
  - Expiry: class duration + 30 min buffer
  - Max participants: 2
- Stores room_id and room_url in classes table
- Creates notification for student
- Returns room URL to teacher

**Request**:
```json
{
  "class_id": "uuid",
  "teacher_id": "uuid", 
  "student_id": "uuid"
}
```

**Response**:
```json
{
  "room_url": "https://your-domain.daily.co/abc123",
  "room_id": "abc123"
}
```

---

### 3. Video Room Component

**New file**: `src/components/video/VideoRoom.tsx`

**Features**:
- Full-screen video interface using @daily-co/daily-js
- Teacher and student video tiles
- Controls: Mute/unmute microphone, camera on/off, end call
- Class timer display (counts up from start)
- Connection quality indicator
- Minimized mode for quick reference

**Component Structure**:
```text
VideoRoom
├── VideoTile (local - teacher)
├── VideoTile (remote - student)
├── CallControls
│   ├── MicToggle
│   ├── CameraToggle
│   └── EndCallButton
├── ClassTimer
└── ConnectionIndicator
```

---

### 4. Video Room Page/Modal

**New file**: `src/pages/ClassRoom.tsx`

**Purpose**: Dedicated page for active video calls

**Features**:
- Route: `/classroom/:classId`
- Shows video room component
- Quick actions overlay (add note, view student info)
- Graceful disconnect handling
- Auto-redirect to lesson form on call end

---

### 5. Update CallButton Component

**File**: `src/components/classes/CallButton.tsx`

**Changes**:
- Replace simulated call with edge function call
- Open video room on successful connection
- Handle real Daily.co room lifecycle
- Improve error handling for network issues

**Updated Flow**:
```text
1. Teacher clicks "Call"
2. Call edge function to create room
3. Show "Creating room..." state
4. Store room URL in class record
5. Student receives notification via Realtime
6. Show "Ringing..." with 40s countdown
7. Student joins → Both enter video room
8. Student doesn't join → Show retry/no-answer options
```

---

### 6. Student Notification System

**Mechanism**: Supabase Realtime + notifications table

**Flow**:
1. Edge function inserts notification for student
2. Student's app receives real-time notification
3. Student sees "Incoming call from [Teacher]" UI
4. Student clicks "Join" → Opens video room

**Note**: For MVP, students will need a separate app or dashboard to receive calls. This phase focuses on the teacher experience.

---

### 7. Call State Management

**New file**: `src/hooks/useVideoCall.ts`

**Purpose**: Centralized hook for video call state

**States**:
- `idle` - No active call
- `creating` - Creating Daily.co room
- `ringing` - Waiting for student
- `connected` - Both in video room
- `ended` - Call finished
- `failed` - Error occurred

**Features**:
- Manages Daily.co call object lifecycle
- Handles participant events
- Auto-records attendance on connect
- Logs all events to call_logs table

---

## Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/create-daily-room/index.ts` | Edge function to create rooms |
| `src/components/video/VideoRoom.tsx` | Main video interface |
| `src/components/video/VideoTile.tsx` | Individual video tile |
| `src/components/video/CallControls.tsx` | Mute/camera/end buttons |
| `src/components/video/ClassTimer.tsx` | Duration timer |
| `src/pages/ClassRoom.tsx` | Video call page |
| `src/hooks/useVideoCall.ts` | Call state management |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/classes/CallButton.tsx` | Real Daily.co integration |
| `src/pages/TodayClasses.tsx` | Navigate to video room |
| `src/App.tsx` | Add /classroom/:classId route |
| `package.json` | Add @daily-co/daily-js dependency |

---

## Dependencies to Add

```json
{
  "@daily-co/daily-js": "^0.67.0"
}
```

---

## Secret Required

**DAILY_API_KEY**: Daily.co REST API key

- Obtain from: https://dashboard.daily.co/developers
- Will prompt user to enter via secrets modal

---

## Technical Details

### Daily.co Room Configuration
```javascript
{
  privacy: "private",
  properties: {
    exp: Math.floor(Date.now() / 1000) + (duration + 30) * 60,
    max_participants: 2,
    enable_chat: true,
    enable_prejoin_ui: false,
    start_video_off: false,
    start_audio_off: false
  }
}
```

### Video Room Initialization
```javascript
const daily = DailyIframe.createCallObject({
  url: roomUrl,
  userName: teacher.profile.full_name,
});

await daily.join();
```

---

## UI Mockup

### Video Room Layout
```text
┌─────────────────────────────────────────────┐
│  ┌─────────────────┐  ┌──────────────────┐  │
│  │                 │  │                  │  │
│  │   STUDENT       │  │    TEACHER       │  │
│  │   VIDEO         │  │    VIDEO         │  │
│  │                 │  │    (small)       │  │
│  │                 │  │                  │  │
│  └─────────────────┘  └──────────────────┘  │
│                                             │
│  Ahmed Hassan • Tajweed Intermediate        │
│  ────────────────────────────────────────   │
│                                             │
│     🎤    📷    ⏱️ 12:34    📝    🔴       │
│    Mute  Camera  Timer    Notes  End Call   │
└─────────────────────────────────────────────┘
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Room creation fails | Show error, retry option |
| Student doesn't join in 40s | Show no-answer dialog |
| Network disconnection | Auto-reconnect attempt, then fallback |
| Browser permission denied | Show instructions modal |
| Daily.co quota exceeded | Show upgrade message |

---

## Outcome

After implementation:
- Teachers can initiate real video calls with one click
- Video room with professional controls and timer
- All call events logged for analytics
- Automatic attendance recording on call connect
- Graceful handling of no-answer scenarios
- Clean transition to lesson form after call ends

