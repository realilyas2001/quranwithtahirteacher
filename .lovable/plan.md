

# Phase 7: Class Management

## Overview

Build a comprehensive class management system that allows teachers to view all their classes (past, present, future), manage scheduling, track recovery classes, and quickly access class details. This phase replaces the placeholder pages for `/classes` and `/schedule` with fully functional implementations.

---

## Architecture

```text
Teacher navigates to /classes
        |
        v
Classes Page loads:
  - Tabbed view: All / Upcoming / Past / Recovery
  - Filter by date range, student, status
  - Sortable list with pagination
  - Quick actions per class
        |
        v
Teacher navigates to /schedule
        |
        v
Schedule Page loads:
  - Weekly calendar grid view
  - Daily view option for mobile
  - Color-coded by status
  - Click to view/manage class
        |
        v
Teacher can schedule recovery class
        |
        v
RecoveryClassDialog opens:
  - Select student
  - Pick date/time
  - Link to original missed class
  - Creates new class record
```

---

## User Flow

### Classes List Page (`/classes`)
1. Teacher sees a comprehensive list of all their classes
2. Tabs allow filtering by category (All/Upcoming/Past/Recovery)
3. Additional filters for date range, student, status
4. Each row shows student, date/time, duration, status, lesson added status
5. Quick actions: Start call, add lesson, view student, schedule recovery
6. Pagination for large datasets

### Class Schedule Page (`/schedule`)
1. Teacher sees a weekly calendar grid (Mon-Sun)
2. Each cell shows classes scheduled for that day
3. Classes are color-coded by status
4. Click on a class to see details or take actions
5. Navigation arrows to move between weeks
6. "Today" button to jump to current week
7. Daily view available for mobile/detailed viewing

### Recovery Class Flow
1. From a missed/no-answer class, click "Schedule Recovery"
2. Dialog opens with student pre-selected
3. Teacher selects date and time
4. System creates new class with `is_recovery = true` and `recovery_for_class_id` set
5. Both original and recovery classes are linked for tracking

---

## Components to Create

### 1. Classes List Page

**File**: `src/pages/classes/Classes.tsx`

**Features**:
- Tabbed interface (All, Upcoming, Past, Recovery)
- Date range picker for filtering
- Student dropdown filter
- Status multi-select filter
- Paginated table/card list
- Responsive design

**Columns/Fields**:
- Student (avatar, name, country)
- Date & Time
- Duration
- Status badge
- Lesson Added indicator
- Recovery badge (if applicable)
- Actions dropdown

---

### 2. Class Schedule Page

**File**: `src/pages/classes/ClassSchedule.tsx`

**Features**:
- Weekly calendar grid layout
- Week navigation (previous/next arrows)
- "Today" quick navigation button
- Day headers with dates
- Time slots or all-day view
- Status color coding
- Click to expand class details

**Calendar Views**:
- Week View (default): 7-day grid
- Day View: Single day detailed view (mobile-friendly)

---

### 3. Recovery Class Dialog

**File**: `src/components/classes/RecoveryClassDialog.tsx`

**Features**:
- Modal/dialog for scheduling recovery
- Pre-filled with original class student
- Date picker for new date
- Time selector
- Duration (inherited from original or customizable)
- Confirmation and validation
- Creates linked recovery class

---

### 4. Class Card Component

**File**: `src/components/classes/ClassCard.tsx`

**Purpose**: Reusable card for class display

**Features**:
- Student avatar and name
- Date/time display
- Status badge with icon
- Recovery indicator
- Lesson added checkmark
- Quick action buttons

---

### 5. Week Calendar Component

**File**: `src/components/classes/WeekCalendar.tsx`

**Purpose**: Weekly calendar grid UI

**Features**:
- 7-day horizontal grid
- Day headers with full date
- Class items positioned in cells
- Overflow handling for busy days
- Click handlers for interactions

---

### 6. useClasses Hook

**File**: `src/hooks/useClasses.ts`

**Purpose**: Data fetching and mutations for classes

**Features**:
- Fetch classes with filters (date range, status, student)
- Create recovery class mutation
- Update class status mutation
- Statistics queries

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/classes/Classes.tsx` | Main classes list page |
| `src/pages/classes/ClassSchedule.tsx` | Weekly schedule view |
| `src/components/classes/RecoveryClassDialog.tsx` | Recovery scheduling modal |
| `src/components/classes/ClassCard.tsx` | Reusable class card |
| `src/components/classes/WeekCalendar.tsx` | Calendar grid component |
| `src/components/classes/ClassFilters.tsx` | Filter controls component |
| `src/hooks/useClasses.ts` | Data fetching hook |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/placeholders.tsx` | Remove Classes and ClassSchedule exports |
| `src/App.tsx` | Update routes to new components |

---

## Data Fetching

### Classes List Query
```text
SELECT * FROM classes
WHERE teacher_id = current_teacher_id
  AND scheduled_date BETWEEN start_date AND end_date
  AND (status = filter_status OR filter_status IS NULL)
ORDER BY scheduled_date DESC, start_time DESC
LIMIT page_size OFFSET page_offset
```

### Weekly Schedule Query
```text
SELECT * FROM classes
WHERE teacher_id = current_teacher_id
  AND scheduled_date BETWEEN week_start AND week_end
ORDER BY scheduled_date ASC, start_time ASC
```

### Recovery Classes Query
```text
SELECT * FROM classes
WHERE teacher_id = current_teacher_id
  AND is_recovery = true
ORDER BY scheduled_date DESC
```

### Create Recovery Class
```text
INSERT INTO classes (
  teacher_id, student_id, scheduled_date, start_time,
  duration_minutes, status, is_recovery, recovery_for_class_id
) VALUES (...)
```

---

## UI Layouts

### Classes List Page
```text
+----------------------------------------------------------+
|  All Classes                                              |
+----------------------------------------------------------+
|  [All] [Upcoming] [Past] [Recovery]                       |
|                                                           |
|  [Date Range ▼] [Student ▼] [Status ▼]  [Clear Filters]  |
+----------------------------------------------------------+
|  +------------------------------------------------------+ |
|  | Avatar | Ahmed Hassan     | Jan 31 | 10:00 AM | 30m  | |
|  |        | Saudi Arabia     | Scheduled | No Lesson    | |
|  |        |                  | [Call] [Add Lesson] [▼]  | |
|  +------------------------------------------------------+ |
|  | Avatar | Fatima Ali       | Jan 31 | 11:00 AM | 45m  | |
|  |        | UAE              | Completed | Lesson Added | |
|  |        |                  | [View Lesson] [▼]        | |
|  +------------------------------------------------------+ |
|  | Avatar | Omar Khan        | Jan 30 | 09:00 AM | 30m  | |
|  |        | Pakistan         | Missed | [Recovery]      | |
|  |        |                  | [Schedule Recovery] [▼]  | |
|  +------------------------------------------------------+ |
|                                                           |
|  [< Previous] Page 1 of 5 [Next >]                       |
+----------------------------------------------------------+
```

### Week Schedule Page
```text
+----------------------------------------------------------+
|  Class Schedule                          [< ] Feb 2026 [>]|
|                                                    [Today]|
+----------------------------------------------------------+
|  Mon 27   | Tue 28   | Wed 29  | Thu 30  | Fri 31 | Sat 1 |
+----------+-----------+---------+---------+--------+--------+
|          |          |         |         |        |        |
| 10:00 AM | 10:00 AM |         | 10:00AM |10:00AM |        |
| Ahmed H. | Fatima A.|         | Omar K. |Ahmed H.|        |
| [Sched.] | [Sched.] |         |[Complt.]|[Sched.]|        |
|          |          |         |         |        |        |
| 11:00 AM |          |         |         |11:30AM |        |
| Sara M.  |          |         |         |Sara M. |        |
| [Sched.] |          |         |         |[Sched.]|        |
|          |          |         |         |        |        |
+----------+-----------+---------+---------+--------+--------+
```

### Recovery Class Dialog
```text
+------------------------------------------+
|  Schedule Recovery Class            [X]   |
+------------------------------------------+
|                                          |
|  Original Class                          |
|  Ahmed Hassan • Jan 25, 10:00 AM         |
|  Status: Missed                          |
|                                          |
|  New Date ─────────────────────────────  |
|  [February 5, 2026                  ▼]   |
|                                          |
|  Time ─────────────────────────────────  |
|  [10:00 AM                          ▼]   |
|                                          |
|  Duration ─────────────────────────────  |
|  [30 minutes                        ▼]   |
|                                          |
|  Notes ────────────────────────────────  |
|  [Recovery for missed class on Jan 25]   |
|                                          |
|       [Cancel]        [Schedule Recovery]|
+------------------------------------------+
```

---

## Technical Details

### Status Color Coding
```text
- scheduled: Blue (info)
- in_progress: Yellow (warning) with pulse animation
- completed: Green (success)
- missed: Red (destructive)
- no_answer: Orange (warning)
- cancelled: Gray (muted)
```

### Pagination
- Default page size: 10 classes
- Options: 10, 25, 50 per page
- Total count displayed
- Keyboard navigation support

### Date Range Presets
- Today
- This Week
- Last 7 Days
- This Month
- Last 30 Days
- Custom Range

### Filter Combinations
Filters work together:
- Tab (category) + Date Range + Student + Status

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No classes found | Show "No classes" empty state with context message |
| Failed to load | Show error state with retry button |
| Recovery creation fails | Show error toast, keep dialog open |
| Invalid date selection | Inline validation error |
| Past date for recovery | Prevent selection, show warning |

---

## Mobile Responsiveness

### Classes List Page
- **Desktop**: Full table with all columns
- **Tablet**: Reduced columns, key info only
- **Mobile**: Card-based list view

### Schedule Page
- **Desktop**: Full 7-day grid
- **Tablet**: 5-day grid (Mon-Fri) with weekend toggle
- **Mobile**: Day view with swipe navigation between days

---

## Performance Considerations

1. **Pagination**: Limit initial load to 10 classes
2. **Date-based queries**: Index on `scheduled_date` column
3. **Cached filters**: Remember user filter preferences
4. **Optimistic updates**: Immediate UI feedback for status changes
5. **Prefetching**: Load adjacent weeks when navigating calendar

---

## Outcome

After implementation:
- Teachers can view and manage all their classes in one place
- Weekly calendar provides at-a-glance schedule visibility
- Easy recovery class scheduling for missed sessions
- Filter and search capabilities for finding specific classes
- Consistent status tracking and color coding
- Mobile-friendly design for on-the-go access
- Foundation for future features (bulk actions, export, etc.)

