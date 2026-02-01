
i dont ask you to create a new student dashboard i already have student dashboard .how can i merged both
# Student-Teacher Connection System - Implementation Plan

## Overview
Merge the student dashboard into QuranWithTahir, creating a unified platform where students can find teachers, send connection requests, and once accepted, both parties can interact through their respective dashboards.

---

## User Flow

```text
1. Student Signs Up → Gets 'student' role → Sees Student Dashboard
2. Student browses "Find Tutors" → Views teacher profiles
3. Student sends connection request to a teacher
4. Teacher sees pending request in their dashboard
5. Teacher accepts/rejects the request
6. If accepted:
   - Student appears in teacher's "My Students" list
   - Teacher appears in student's "My Teacher" section
   - Both can now schedule classes and make video calls
```

---

## Database Changes

### 1. New Table: `connection_requests`
Tracks pending/accepted/rejected connection requests between students and teachers.

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| student_id | uuid | References students.id |
| teacher_id | uuid | References teachers.id |
| status | enum | 'pending', 'accepted', 'rejected' |
| message | text | Optional message from student |
| created_at | timestamp | When request was sent |
| responded_at | timestamp | When teacher responded |

### 2. New Enum: `connection_status`
```sql
CREATE TYPE connection_status AS ENUM ('pending', 'accepted', 'rejected');
```

### 3. Update RLS Policies
- Students can view teacher profiles (public info only)
- Students can create connection requests
- Teachers can view and respond to requests for them
- Connected pairs can access each other's relevant data

---

## New Pages for Students

### Student Navigation Menu
| Order | Item | Route | Description |
|-------|------|-------|-------------|
| 1 | Dashboard | /student/dashboard | Student overview |
| 2 | Find Tutors | /student/find-tutors | Browse teachers |
| 3 | My Teacher | /student/my-teacher | Connected teacher profile |
| 4 | My Classes | /student/classes | Upcoming and past classes |
| 5 | Lesson History | /student/lessons | Lesson records |
| 6 | My Progress | /student/progress | Progress tracking |
| 7 | Announcements | /student/announcements | System announcements |

### Page Implementations

**1. Student Dashboard** (`/student/dashboard`)
- Welcome message with student name
- Upcoming class card (next scheduled class)
- Connection status (pending requests, connected teacher)
- Recent lesson summary
- Progress overview

**2. Find Tutors** (`/student/find-tutors`)
- List of available teachers with cards showing:
  - Teacher name and avatar
  - Specializations
  - Bio/description
  - Teaching hours available
- Filter by specialization
- "Connect" button to send request
- Modal to add optional message

**3. My Teacher** (`/student/my-teacher`)
- Connected teacher profile
- Schedule/contact information
- Upcoming classes with teacher
- "Disconnect" option (with confirmation)

**4. Student Classes** (`/student/classes`)
- List of scheduled classes
- Join video call button
- Class status (upcoming, completed, missed)
- Schedule new class request

---

## Teacher Dashboard Updates

### New Section: Connection Requests
Add to teacher dashboard:
- Pending connection requests card
- Quick accept/reject actions
- View student profile before accepting

### Updated Navigation
Add new item after "My Students":
| Item | Route | Description |
|------|-------|-------------|
| Requests | /requests | View pending student requests |

---

## Authentication & Role Handling

### Updated Auth Context
```typescript
// Add to AuthContext
isStudent: boolean;
student: Student | null;

// Routing logic
if (isTeacher) → redirect to /dashboard
if (isStudent) → redirect to /student/dashboard
```

### Registration Flow
- Add role selection during signup (Teacher/Student)
- Teacher registration: existing flow
- Student registration: 
  - Create profile
  - Create student record (no teacher_id initially)
  - Assign 'student' role

---

## File Structure

### New Files
```text
src/
├── contexts/
│   └── AuthContext.tsx (update)
├── components/
│   ├── student/
│   │   ├── StudentSidebar.tsx
│   │   ├── TeacherCard.tsx
│   │   ├── ConnectionRequestDialog.tsx
│   │   └── UpcomingClassCard.tsx
│   └── requests/
│       ├── RequestCard.tsx
│       └── RequestDialog.tsx
├── hooks/
│   ├── useConnectionRequests.ts
│   ├── useTeachers.ts (public profiles)
│   └── useStudentClasses.ts (update)
├── pages/
│   ├── student/
│   │   ├── StudentDashboard.tsx
│   │   ├── FindTutors.tsx
│   │   ├── MyTeacher.tsx
│   │   ├── StudentClasses.tsx
│   │   ├── StudentLessons.tsx
│   │   └── StudentProgress.tsx
│   └── requests/
│       └── Requests.tsx
└── App.tsx (add routes)
```

---

## Implementation Order

### Phase 1: Database & Auth (Day 1)
1. Create `connection_requests` table with RLS
2. Create `teachers_public` view for safe teacher browsing
3. Update AuthContext to handle student role
4. Update registration page with role selection

### Phase 2: Student Pages (Day 2)
1. Create StudentSidebar component
2. Create Student Dashboard layout
3. Implement Find Tutors page
4. Implement Connection Request flow

### Phase 3: Teacher Integration (Day 3)
1. Create Requests page for teachers
2. Add request card to teacher dashboard
3. Implement accept/reject logic
4. Update "My Students" to show connected students

### Phase 4: Connected Features (Day 4)
1. My Teacher page for students
2. Student Classes page
3. Video call integration for students
4. Class scheduling flow

### Phase 5: Polish (Day 5)
1. Progress tracking for students
2. Notifications for connection events
3. UI consistency check
4. Testing all flows

---

## Security Considerations

1. **Teacher Profiles**: Only expose non-sensitive fields (name, bio, specializations, avatar)
2. **Connection Requests**: Students can only request, teachers control acceptance
3. **RLS Policies**: 
   - Students see only their connected teacher's full data
   - Teachers see only their connected students
4. **Video Calls**: Only connected pairs can join same call rooms

---

## Technical Notes

- Reuse existing video call infrastructure
- Reuse existing class scheduling components
- Student dashboard uses similar layout patterns as teacher dashboard
- Connection system similar to follow/friend request patterns
