
# Student Dashboard Integration Plan for QuranWithTahir

## Executive Summary
This plan integrates a full-featured Student Dashboard into the existing QuranWithTahir teacher platform, enabling students to find tutors, receive video calls, track progress, and manage their learning journey. Parents can also manage their children's accounts.

---
 keep in mind students can not see teachers contact number or email on there profile
## Current Architecture Analysis

### What Already Exists
- **Video Calling**: Daily.co WebRTC integration (fully functional)
- **Authentication**: Supabase Auth with role-based access (teacher, admin, student roles defined)
- **Database**: Comprehensive schema for classes, lessons, attendance, students
- **Teacher Dashboard**: Complete with 17+ pages and features

### What Needs to Be Added
- Student-specific routes and layouts
- Parent account support
- Call receiving flow (ringing UI for students)
also students have option for make to teachers both have option for make call to eachoher.
call is only allowd after invite and accpet from another user 
- Connection request system (Find Tutors)
- Student dashboard pages
- Role-based routing logic

---

## Database Changes

### 1. New Enum: `parent_role`
```sql
CREATE TYPE parent_role AS ENUM ('student', 'parent');
```

### 2. New Table: `connection_requests`
Manages teacher-student pairing requests.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| student_id | uuid | References students.id |
| teacher_id | uuid | References teachers.id |
| status | connection_status | pending/accepted/rejected |
| message | text | Optional intro message |
| created_at | timestamptz | Request timestamp |
| responded_at | timestamptz | Response timestamp |

### 3. New Table: `student_settings`
Student preferences and accessibility options.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| student_id | uuid | References students.id |
| timezone | text | Display timezone |
| notification_prefs | jsonb | Email/SMS/push settings |
| video_pref | boolean | Camera on by default |
| low_bandwidth_mode | boolean | Audio-only mode |
| accessibility_mode | text | senior-friendly/standard |

### 4. New Table: `reschedule_requests`
Student-initiated schedule change requests.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| class_id | uuid | References classes.id |
| student_id | uuid | References students.id |
| preferred_times | jsonb | Array of 3 time slots |
| reason | text | Optional reason |
| status | text | pending/approved/rejected |
| created_at | timestamptz | Request time |

### 5. New Table: `student_feedback`
Post-class feedback from students.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| class_id | uuid | References classes.id |
| student_id | uuid | References students.id |
| rating | integer | 1-5 stars |
| comment | text | Optional feedback |
| created_at | timestamptz | Submission time |

### 6. Updates to Existing Tables

**students table** - Add columns:
- `parent_id` (uuid, nullable) - Links to parent's student record
- `accessibility_mode` (text, default 'standard')
- `is_parent_account` (boolean, default false)

### 7. New View: `teachers_public`
Safe public view of teacher profiles for browsing.
```sql
CREATE VIEW teachers_public AS
SELECT 
  t.id,
  p.full_name,
  p.avatar_url,
  t.specializations,
  t.bio,
  t.teaching_hours_per_week,
  t.status
FROM teachers t
JOIN profiles p ON t.user_id = p.user_id
WHERE t.status = 'active';
```

### 8. RLS Policies
- Students can view `teachers_public`
- Students can CRUD their own connection_requests
- Students can view classes where they are student_id
- Students can view their own lessons (read-only)
- Students can submit feedback for completed classes
- Parents can access linked children's data

---

## Application Structure

### New File Structure
```text
src/
├── components/
│   ├── layout/
│   │   ├── StudentLayout.tsx          # Student dashboard wrapper
│   │   └── StudentSidebar.tsx         # Student navigation
│   ├── student/
│   │   ├── UpcomingClassCard.tsx      # Next class display
│   │   ├── ProgressChart.tsx          # Visual progress
│   │   ├── TeacherCard.tsx            # Teacher profile card
│   │   ├── ConnectionRequestDialog.tsx # Send request modal
│   │   ├── RescheduleDialog.tsx       # Request reschedule
│   │   └── FeedbackDialog.tsx         # Post-class feedback
│   ├── call/
│   │   ├── IncomingCallOverlay.tsx    # Ringing UI overlay
│   │   ├── CallActions.tsx            # Accept/Decline buttons
│   │   └── QuickMessages.tsx          # Pre-set reply messages
│   └── parent/
│       ├── ChildSelector.tsx          # Switch between children
│       └── ChildOverview.tsx          # Child summary card
├── hooks/
│   ├── useStudentAuth.ts              # Student-specific auth
│   ├── useIncomingCall.ts             # Realtime call detection
│   ├── useConnectionRequests.ts       # Manage requests
│   ├── useStudentProgress.ts          # Progress data
│   ├── usePublicTeachers.ts           # Browse teachers
│   └── useStudentFeedback.ts          # Submit feedback
├── pages/
│   └── student/
│       ├── StudentDashboard.tsx       # Main dashboard
│       ├── TodayClasses.tsx           # Today's schedule
│       ├── FindTutors.tsx             # Browse teachers
│       ├── MyTeacher.tsx              # Connected teacher
│       ├── MyClasses.tsx              # Class history
│       ├── MySchedule.tsx             # Calendar view
│       ├── LessonHistory.tsx          # Lesson records
│       ├── MyProgress.tsx             # Progress tracking
│       ├── Attendance.tsx             # Attendance records
│       ├── Messages.tsx               # Chat with teacher
│       ├── Requests.tsx               # Reschedule requests
│       ├── Profile.tsx                # Edit profile
│       ├── Settings.tsx               # Preferences
│       ├── Feedback.tsx               # Submit feedback
│       └── Help.tsx                   # Support/FAQ
└── contexts/
    └── CallContext.tsx                # Global call state
```

---

## Student Navigation Menu

| Order | Item | Route | Icon | Description |
|-------|------|-------|------|-------------|
| 1 | Dashboard | /student/dashboard | LayoutDashboard | Overview & quick actions |
| 2 | Today Classes | /student/today | CalendarDays | Today's scheduled classes |
| 3 | Find Tutors | /student/find-tutors | Search | Browse available teachers |
| 4 | My Teacher | /student/my-teacher | UserCheck | Connected teacher profile |
| 5 | My Classes | /student/classes | GraduationCap | All class history |
| 6 | My Schedule | /student/schedule | Calendar | Calendar view |
| 7 | Lessons | /student/lessons | BookOpen | Lesson records |
| 8 | My Progress | /student/progress | TrendingUp | Progress tracking |
| 9 | Attendance | /student/attendance | ClipboardCheck | Attendance history |
| 10 | Messages | /student/messages | MessageCircle | Chat with teacher |
| 11 | Requests | /student/requests | FileQuestion | Reschedule requests |
| 12 | Announcements | /student/announcements | Megaphone | System announcements |
| 13 | Profile | /student/profile | User | Edit profile |
| 14 | Settings | /student/settings | Settings | Preferences |
| 15 | Help | /student/help | HelpCircle | FAQ & Support |

---

## Authentication & Routing Updates

### AuthContext Additions
```typescript
interface AuthContextType {
  // Existing...
  isStudent: boolean;
  student: Student | null;
  isParent: boolean;
  linkedChildren: Student[];
  activeChild: Student | null;
  setActiveChild: (child: Student) => void;
}
```

### Role-Based Routing Logic
```text
User logs in:
├── Has 'teacher' role → /dashboard (teacher)
├── Has 'student' role
│   ├── Is parent account → /student/dashboard (parent view)
│   └── Is student account → /student/dashboard (student view)
└── Has 'admin' role → /admin/dashboard
```

### Registration Updates
- Add role selector: "I am a Student" / "I am a Teacher" / "I am a Parent"
- Student registration creates:
  - Profile record
  - Student record (teacher_id = null)
  - user_roles entry with 'student' role
- Parent registration creates same + sets `is_parent_account = true`

---

## Video Call Flow for Students

### Incoming Call Detection (Realtime)
Using Supabase Realtime to detect when a teacher initiates a call:

```typescript
// useIncomingCall.ts
// Subscribe to classes table for status changes
supabase
  .channel('student-calls')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'classes',
    filter: `student_id=eq.${studentId}`
  }, (payload) => {
    if (payload.new.status === 'in_progress' && payload.new.call_room_url) {
      // Show ringing overlay
      setIncomingCall(payload.new);
    }
  })
  .subscribe();
```

### Ringing Overlay UI
When call detected, show full-screen overlay with:
- Teacher photo and name
- Class details (scheduled time, subject)
- **Accept** button (green, prominent)
- **Decline** button (red)
- Quick message buttons: "On my way!", "Give me 2 minutes", "Parent will join"
- 40-second countdown timer
- Auto-decline after timeout

### Accept Flow
1. Student clicks Accept
2. Update `call_logs` with event: 'accepted'
3. Navigate to `/classroom/:classId`
4. Join Daily.co room using existing `call_room_url`
5. WebRTC connection established

### Decline Flow
1. Student clicks Decline
2. Update `call_logs` with event: 'rejected'
3. Update class status to 'missed' or show reschedule option
4. Notify teacher via realtime

---

## Page Implementations

### 1. Student Dashboard (`/student/dashboard`)
**Components:**
- Welcome banner with student name
- Next Class card (prominent, with Join/Countdown)
- Connection status (pending requests, or connected teacher info)
- Today's classes mini-list (max 3)
- Recent lessons summary
- Progress snapshot (memorized surahs, current juzz)
- Unread notifications badge

**Data Queries:**
- Today's classes (filtered by student_id)
- Active connection request
- Last 5 lessons
- Progress stats

### 2. Find Tutors (`/student/find-tutors`)
**Components:**
- Search/filter bar (by specialization, availability)
- Teacher cards grid:
  - Avatar, name
  - Specializations badges
  - Bio excerpt
  - "Connect" button
- Connection request modal:
  - Optional introduction message
  - Submit sends to `connection_requests`

**Access Control:** Only visible if student has no active teacher connection.

### 3. My Teacher (`/student/my-teacher`)
**Components:**
- Teacher profile hero (photo, name, bio)
- Specializations list
- Contact info (if allowed)
- Upcoming classes with this teacher
- Disconnect button (with confirmation)

**Data:** From `teachers` joined with `profiles`, filtered by connection.

### 4. My Classes (`/student/classes`)
**Components:**
- Filter tabs: All / Upcoming / Completed / Missed
- Class list with:
  - Date, time
  - Teacher name
  - Status badge
  - Join button (if upcoming/in_progress)
  - View Lesson link (if completed)

### 5. Student ClassRoom (`/classroom/:classId` - updated)
**Updates needed:**
- Detect if user is student or teacher
- Show appropriate controls
- Student view: simpler controls, raise hand button
- Post-call: show "View Lesson" and "Leave Feedback" prompts

---

## Parent Account Features

### Parent Dashboard Additions
- Child selector dropdown (if multiple children)
- Overview cards for each child
- Ability to join calls on behalf of child
- View-only access to child's progress, lessons, attendance
- Receive notifications for child's classes
- Make reschedule requests for child

### Parent-Specific Permissions
- Can accept calls for linked children
- Cannot modify child's profile (except contact info)
- Receives copies of all notifications
- Can message teacher on behalf of child

---

## Implementation Phases

### Phase 1: Database & Auth Foundation (Priority: Critical)
1. Run migrations for new tables and columns
2. Create RLS policies
3. Update AuthContext with student/parent detection
4. Update Registration page with role selection
5. Add role-based redirect logic

### Phase 2: Student Layout & Navigation
1. Create StudentLayout component
2. Create StudentSidebar with all nav items
3. Set up /student/* routes in App.tsx
4. Create placeholder pages

### Phase 3: Core Student Pages
1. Student Dashboard with stats
2. Today Classes page
3. My Classes (history)
4. My Schedule (calendar)
5. Profile & Settings pages

### Phase 4: Teacher Connection System
1. Find Tutors page
2. Connection request flow
3. My Teacher page
4. Teacher dashboard: Requests section
5. Accept/reject logic

### Phase 5: Video Call Integration
1. IncomingCallOverlay component
2. CallContext for global call state
3. useIncomingCall hook with Realtime
4. Update ClassRoom for student view
5. Quick messages feature

### Phase 6: Progress & Lessons
1. Lesson History (read-only)
2. My Progress page with charts
3. Attendance view
4. Post-class feedback system

### Phase 7: Parent Features
1. Parent dashboard variant
2. Child selector component
3. Parent notification routing
4. Accept-on-behalf flow

### Phase 8: Communication & Polish
1. Messages/chat with teacher
2. Reschedule request system
3. Help/FAQ page
4. Accessibility mode toggle
5. Low-bandwidth mode

---

## Security Checklist

- [ ] RLS policies enforce student-only access to own data
- [ ] Students cannot view other students' information
- [ ] Connection required before accessing teacher's full profile
- [ ] Video room tokens validated server-side
- [ ] Parent accounts properly scoped to linked children
- [ ] Rate limiting on connection requests
- [ ] Input validation on all forms

---

## Technical Notes

### Reusing Existing Infrastructure
- **Video Calls**: Daily.co already integrated, reuse for students
- **Realtime**: Supabase Realtime for call notifications
- **UI Components**: shadcn/ui components already available
- **Auth**: Supabase Auth with existing role system

### NOT Required (per existing stack)
- Node.js/Express backend (using Supabase)
- Socket.io (using Supabase Realtime)
- Docker (Lovable Cloud handles deployment)
- Separate frontend apps (single React app with role routing)

### Accessibility Considerations
- Large touch targets for mobile
- Senior-friendly mode with bigger fonts
- Keyboard navigation support
- Screen reader labels
- Low-bandwidth audio-only option

---

## Estimated Effort

| Phase | Effort | Priority |
|-------|--------|----------|
| Phase 1: Database & Auth | 4-6 hours | Critical |
| Phase 2: Layout & Navigation | 2-3 hours | High |
| Phase 3: Core Pages | 6-8 hours | High |
| Phase 4: Connection System | 4-5 hours | High |
| Phase 5: Video Call | 4-6 hours | Critical |
| Phase 6: Progress & Lessons | 3-4 hours | Medium |
| Phase 7: Parent Features | 4-5 hours | Medium |
| Phase 8: Communication | 3-4 hours | Low |

**Total Estimated: 30-41 hours of development**

