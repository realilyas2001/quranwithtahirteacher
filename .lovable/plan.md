
# Phase 4: Teacher Connection System Implementation Plan

## Overview
This phase implements the complete connection workflow between students and teachers, allowing students to send requests, teachers to accept/reject them, and establishing the student-teacher relationship for class scheduling and video calls.

---

## Current State Analysis

**Existing Implementation:**
- `connection_requests` table with status enum: `pending`, `accepted`, `rejected`
- `FindTutors.tsx` allows students to browse teachers and send connection requests
- `teachers_public` view exposes teacher profiles for browsing
- Students table has `teacher_id` field to store the connected teacher

**Gaps to Fill:**
- Teachers cannot view or respond to incoming connection requests
- `MyTeacher.tsx` is a placeholder (doesn't fetch/display teacher details)
- `Requests.tsx` is a placeholder (no connection or reschedule request tracking)
- No automatic update of `student.teacher_id` when connection is accepted
- No notification system for connection status changes

---

## Implementation Components

### 1. New Type Definitions

**File**: `src/types/database.ts`

Add TypeScript interfaces for connection-related data:

```text
ConnectionRequest {
  id, student_id, teacher_id, status, message, created_at, responded_at
  student?: Student (joined)
  teacher?: Teacher (joined)
}

ConnectionStatus = 'pending' | 'accepted' | 'rejected'
```

---

### 2. New Custom Hooks

#### useConnectionRequests Hook
**File**: `src/hooks/useConnectionRequests.ts`

For teachers to manage incoming requests:
- Fetch pending requests with student details (name, email, message)
- Accept request mutation (updates status, sets student.teacher_id)
- Reject request mutation (updates status only)
- Query invalidation for real-time updates

#### useStudentConnection Hook
**File**: `src/hooks/useStudentConnection.ts`

For students to track their connection status:
- Fetch current connection request status
- Fetch connected teacher details (when teacher_id exists)
- Cancel pending request mutation
- Query for connection history

---

### 3. Teacher Dashboard: Connection Requests Page

**File**: `src/pages/ConnectionRequests.tsx`

New page for teachers to manage incoming requests:

**UI Components:**
- Page header with pending request count badge
- Tabbed view: Pending | Accepted | Rejected
- Request cards showing:
  - Student avatar, name, email
  - Connection message (if provided)
  - Request date
  - Accept/Reject buttons (for pending)
  - Responded date and status (for history)

**Data Flow:**
```typescript
const { data } = await supabase
  .from('connection_requests')
  .select(`
    *,
    student:students(id, full_name, email, avatar_url, course_level)
  `)
  .eq('teacher_id', teacherId)
  .order('created_at', { ascending: false });
```

**Accept Request Logic:**
1. Update `connection_requests.status` to 'accepted'
2. Update `connection_requests.responded_at` to now
3. Update `students.teacher_id` to the teacher's ID
4. Create notification for student
5. Invalidate related queries

---

### 4. Teacher Dashboard: Navigation Update

**File**: `src/components/layout/DashboardSidebar.tsx`

Add new navigation item with badge for pending requests:
- Icon: UserPlus or UserCheck
- Label: "Connection Requests"
- Badge showing pending count (dynamic)
- Route: `/connection-requests`

---

### 5. Student Pages Enhancement

#### MyTeacher Page (Full Implementation)
**File**: `src/pages/student/MyTeacher.tsx`

When student has a connected teacher (`teacher_id` exists):
- Fetch teacher profile via joined query
- Display:
  - Large teacher avatar
  - Full name and bio
  - Specializations as badges
  - Teaching hours per week
  - Connection date
  - Contact/message button (placeholder)
  - Quick action: Schedule a class

When no teacher connected:
- Keep existing "Find a Tutor" prompt (already implemented)

**Query Pattern:**
```typescript
const { data } = await supabase
  .from('teachers')
  .select(`
    id, bio, specializations, teaching_hours_per_week,
    profile:profiles(full_name, avatar_url, email)
  `)
  .eq('id', student.teacher_id)
  .single();
```

#### Requests Page (Full Implementation)
**File**: `src/pages/student/Requests.tsx`

Two sections:

**Section 1: Connection Requests**
- Show pending connection request with:
  - Teacher name and avatar
  - Sent date
  - Message sent
  - Status badge
  - Cancel button (for pending only)

**Section 2: Reschedule Requests**
- List from `reschedule_requests` table
- Show class date, requested times, status
- Teacher response (if any)

---

### 6. Database Operations

#### Accept Connection (Transaction-like)
When teacher accepts:
```sql
-- Update request status
UPDATE connection_requests 
SET status = 'accepted', responded_at = now()
WHERE id = request_id;

-- Link student to teacher
UPDATE students 
SET teacher_id = teacher_id
WHERE id = student_id;
```

#### Reject Connection
```sql
UPDATE connection_requests 
SET status = 'rejected', responded_at = now()
WHERE id = request_id;
```

#### Cancel Request (Student)
```sql
DELETE FROM connection_requests
WHERE id = request_id 
  AND student_id = current_student_id 
  AND status = 'pending';
```

---

### 7. Notifications Integration

When connection status changes, create notifications:
- **Student receives**: "Your connection request to [Teacher] was accepted/rejected"
- **Teacher receives**: "New connection request from [Student]" (on new request)

Use existing `notifications` table with type: `'system'`

---

### 8. Real-time Updates (Optional Enhancement)

Enable Supabase Realtime for `connection_requests` table so:
- Teachers see new requests instantly
- Students see status changes instantly

---

## File Changes Summary

**New Files:**
- `src/hooks/useConnectionRequests.ts` - Teacher connection management
- `src/hooks/useStudentConnection.ts` - Student connection tracking  
- `src/pages/ConnectionRequests.tsx` - Teacher requests management page
- `src/components/connection/ConnectionRequestCard.tsx` - Reusable request card

**Updated Files:**
- `src/types/database.ts` - Add ConnectionRequest type
- `src/components/layout/DashboardSidebar.tsx` - Add nav item with badge
- `src/App.tsx` - Add /connection-requests route
- `src/pages/student/MyTeacher.tsx` - Full teacher profile display
- `src/pages/student/Requests.tsx` - Connection and reschedule tracking
- `src/contexts/AuthContext.tsx` - Ensure student.teacher_id is current

---

## Implementation Order

1. **Add type definitions** for ConnectionRequest
2. **Create useConnectionRequests hook** for teachers
3. **Create ConnectionRequestCard component**
4. **Create ConnectionRequests page** for teachers
5. **Update DashboardSidebar** with new nav item
6. **Update App.tsx** with new route
7. **Create useStudentConnection hook** for students
8. **Update MyTeacher page** with teacher details
9. **Update Requests page** with connection tracking

---

## UI/UX Considerations

- Pending request badge should use accent color (amber/yellow)
- Accept button: primary/green styling
- Reject button: secondary/ghost with confirmation dialog
- Connection request cards should show student's course level to help teachers decide
- Empty states with helpful guidance
- Toast notifications for all actions
- Mobile-responsive card layouts

---

## Security Notes

- RLS policies already exist for connection_requests (verified in context)
- Students can only see/modify their own requests
- Teachers can only see requests addressed to them
- Only pending requests can be updated/deleted

---

## Estimated Scope

| File | Type | Lines |
|------|------|-------|
| useConnectionRequests.ts | New | ~100 |
| useStudentConnection.ts | New | ~80 |
| ConnectionRequests.tsx | New | ~200 |
| ConnectionRequestCard.tsx | New | ~100 |
| types/database.ts | Update | +15 |
| DashboardSidebar.tsx | Update | +20 |
| App.tsx | Update | +5 |
| MyTeacher.tsx | Update | ~100 |
| Requests.tsx | Update | ~150 |

**Total: ~770 lines across 9 files**
