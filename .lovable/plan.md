

# Phase 8: Attendance Management

## Overview

Build a comprehensive attendance tracking system that allows teachers to record, view, and manage student attendance for their classes. This phase replaces the placeholder `/attendance` page with a fully functional implementation that integrates with existing class and student data.

---

## Architecture

```text
Teacher navigates to /attendance
        |
        v
Attendance Page loads:
  - Summary stats (Present, Absent, Late, No Answer)
  - Date range and student filters
  - Tabular/Card list of attendance records
  - Bulk marking actions for today's classes
        |
        v
Teacher records attendance:
  - Quick mark from Today's Classes
  - Edit existing records
  - Add notes for context
        |
        v
Attendance syncs with Classes:
  - Updates when class status changes
  - Reflected in student profiles
```

---

## User Flow

### Attendance Page (`/attendance`)
1. Teacher sees summary statistics for attendance (total present, absent, late, leave, no answer)
2. Date range filter allows viewing specific periods
3. Student filter narrows to specific student's attendance
4. Each row shows student, class date/time, attendance status, and notes
5. Quick edit allows changing status or adding notes
6. Bulk actions for marking today's unmarked classes

### Recording Attendance Flow
1. After a class ends or is marked as missed/no_answer, attendance is auto-suggested
2. Teacher can manually record or adjust attendance
3. Notes field captures any special circumstances (late reason, leave type, etc.)
4. Changes are instantly reflected across the system

---

## Components to Create

### 1. Attendance Page

**File**: `src/pages/attendance/Attendance.tsx`

**Features**:
- Summary stats cards (Present, Absent, Late, Leave, No Answer rates)
- Date range picker for filtering
- Student dropdown filter  
- Status filter (multi-select)
- Attendance records table/card list
- Empty state for no records
- Loading skeletons

**Columns/Fields**:
- Student (avatar, name, country)
- Class Date & Time
- Status badge (with color-coded pills using existing CSS)
- Note (if any)
- Actions (Edit, View Class)

---

### 2. Attendance Record Card

**File**: `src/components/attendance/AttendanceCard.tsx`

**Purpose**: Reusable card for attendance display in mobile/card views

**Features**:
- Student avatar and name
- Class date/time display
- Status pill (using existing attendance-present, attendance-absent, etc. CSS classes)
- Note display (collapsible if long)
- Quick action buttons

---

### 3. Attendance Stats Component

**File**: `src/components/attendance/AttendanceStats.tsx`

**Purpose**: Summary statistics header

**Features**:
- Total records count
- Present count with percentage
- Absent count with percentage
- Late count
- Leave count
- Average attendance rate

---

### 4. Attendance Edit Dialog

**File**: `src/components/attendance/AttendanceEditDialog.tsx`

**Purpose**: Modal for editing attendance records

**Features**:
- Status dropdown (Present, Absent, Late, Leave, No Answer)
- Note textarea
- Save/Cancel actions
- Validation

---

### 5. Quick Attendance Marker

**File**: `src/components/attendance/QuickAttendanceMarker.tsx`

**Purpose**: Bulk marking for today's classes without attendance records

**Features**:
- List of today's completed/ended classes without attendance
- Quick status buttons for each
- Batch mark all as present option
- Collapsible section

---

### 6. useAttendance Hook

**File**: `src/hooks/useAttendance.ts`

**Purpose**: Data fetching and mutations for attendance

**Features**:
- Fetch attendance with filters (date range, status, student)
- Create attendance record mutation
- Update attendance record mutation
- Statistics calculation queries
- Auto-create attendance when class ends

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/attendance/Attendance.tsx` | Main attendance page |
| `src/components/attendance/AttendanceCard.tsx` | Reusable attendance card |
| `src/components/attendance/AttendanceStats.tsx` | Summary statistics |
| `src/components/attendance/AttendanceEditDialog.tsx` | Edit modal |
| `src/components/attendance/QuickAttendanceMarker.tsx` | Bulk marking component |
| `src/hooks/useAttendance.ts` | Data fetching hook |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/placeholders.tsx` | Remove Attendance export |
| `src/App.tsx` | Update route to new component |
| `src/pages/TodayClasses.tsx` | Add attendance marking after class ends |

---

## Data Fetching

### Attendance List Query
```text
SELECT attendance.*, 
       student:students(id, full_name, avatar_url, country, country_code),
       class:classes(id, scheduled_date, start_time, duration_minutes)
FROM attendance
WHERE teacher_id = current_teacher_id
  AND recorded_at BETWEEN start_date AND end_date
  AND (student_id = filter_student OR filter_student IS NULL)
  AND (status = filter_status OR filter_status IS NULL)
ORDER BY recorded_at DESC
```

### Statistics Query
```text
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'present') as present,
  COUNT(*) FILTER (WHERE status = 'absent') as absent,
  COUNT(*) FILTER (WHERE status = 'late') as late,
  COUNT(*) FILTER (WHERE status = 'leave') as leave,
  COUNT(*) FILTER (WHERE status = 'no_answer') as no_answer
FROM attendance
WHERE teacher_id = current_teacher_id
  AND recorded_at >= date_range_start
```

### Create/Update Attendance
```text
-- Create
INSERT INTO attendance (class_id, teacher_id, student_id, status, note)
VALUES (class_id, teacher_id, student_id, status, note)

-- Update
UPDATE attendance SET status = new_status, note = new_note
WHERE id = attendance_id AND teacher_id = current_teacher_id
```

---

## UI Layouts

### Attendance Page - Desktop
```text
+----------------------------------------------------------+
|  Attendance                                               |
|  Track and manage student attendance                      |
+----------------------------------------------------------+
|  +-----------+ +-----------+ +-----------+ +-----------+  |
|  | Present   | | Absent    | | Late      | | Leave     |  |
|  | 145 (82%) | | 18 (10%)  | | 10 (6%)   | | 4 (2%)    |  |
|  +-----------+ +-----------+ +-----------+ +-----------+  |
+----------------------------------------------------------+
|  [Date Range ▼] [Student ▼] [Status ▼] [Clear Filters]   |
+----------------------------------------------------------+
|                                                           |
|  Quick Mark: 3 classes today need attendance              |
|  [Mark All Present] or mark individually below            |
|                                                           |
+----------------------------------------------------------+
|  +------------------------------------------------------+ |
|  | Avatar | Ahmed Hassan     | Jan 31 | 10:00 AM        | |
|  |        | Saudi Arabia     | [Present]          [Edit]| |
|  +------------------------------------------------------+ |
|  | Avatar | Fatima Ali       | Jan 31 | 11:00 AM        | |
|  |        | UAE              | [Late] Late 5 min  [Edit]| |
|  +------------------------------------------------------+ |
|  | Avatar | Omar Khan        | Jan 30 | 09:00 AM        | |
|  |        | Pakistan         | [Absent]           [Edit]| |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### Attendance Edit Dialog
```text
+------------------------------------------+
|  Edit Attendance                    [X]   |
+------------------------------------------+
|                                          |
|  Student: Ahmed Hassan                   |
|  Class: January 31, 2026 @ 10:00 AM      |
|                                          |
|  Status ────────────────────────────────  |
|  [Present ▼]                             |
|                                          |
|  Note ──────────────────────────────────  |
|  [Student joined on time today      ]    |
|  [                                  ]    |
|                                          |
|       [Cancel]            [Save Changes] |
+------------------------------------------+
```

### Quick Attendance Marker (Collapsed Section)
```text
+----------------------------------------------------------+
|  ▼ Classes Needing Attendance (3)         [Mark All ✓]   |
+----------------------------------------------------------+
|  Ahmed Hassan • 10:00 AM • Completed                      |
|  [Present] [Absent] [Late] [Leave] [No Answer]           |
|  -------------------------------------------------------- |
|  Fatima Ali • 11:00 AM • Completed                        |
|  [Present] [Absent] [Late] [Leave] [No Answer]           |
+----------------------------------------------------------+
```

---

## Technical Details

### Status Color Coding (Using Existing CSS)
```text
- present: attendance-present (green)
- absent: attendance-absent (red)
- late: attendance-late (orange/yellow)
- leave: attendance-leave (blue)
- no_answer: attendance-no-answer (gray)
```

### Date Range Presets
- Today
- This Week  
- Last 7 Days
- This Month
- Last 30 Days
- Custom Range

### Auto-Attendance Logic
When a class status changes to:
- `completed` → Suggest marking as "present"
- `missed` → Suggest marking as "absent"
- `no_answer` → Suggest marking as "no_answer"

---

## Integration Points

### Today's Classes Page
- After marking class as "completed", prompt to record attendance
- Add attendance status indicator to class cards

### Student Profile Page
- Show attendance summary in Overview tab
- Link to filtered attendance records

### Class Card Component
- Display attendance status if recorded
- Quick attendance action for completed classes

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No attendance records | Show "No records" empty state with context message |
| Failed to load | Show error state with retry button |
| Update fails | Show error toast, keep dialog open |
| Duplicate attendance for same class | Prevent creation, offer to update existing |

---

## Mobile Responsiveness

### Attendance Page
- **Desktop**: Full table with all columns
- **Tablet**: Reduced columns, key info only
- **Mobile**: Card-based list view using AttendanceCard component

### Quick Marker
- **Desktop**: Horizontal button row for statuses
- **Mobile**: Dropdown selector instead of buttons

---

## Outcome

After implementation:
- Teachers can easily track and manage student attendance
- Quick marking from Today's Classes streamlines workflow
- Statistics provide at-a-glance attendance health
- Filtering enables finding specific records quickly
- Integration with class status ensures data consistency
- Mobile-friendly design for on-the-go access
- Foundation for attendance reports and analytics

