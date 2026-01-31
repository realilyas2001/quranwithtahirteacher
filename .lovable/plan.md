

# Phase 6: Student Management

## Overview

Build a comprehensive student management system that allows teachers to view, search, and manage their assigned students. This includes a student list page with filtering capabilities and a detailed student profile page showing progress, lessons, and schedule.

---

## Architecture

```text
Teacher navigates to /students
        |
        v
Students List Page loads:
  - Grid/List view of all assigned students
  - Search by name/email
  - Filter by status, course level
  - Sort by name, progress, last class
        |
        v
Teacher clicks on a student
        |
        v
Student Profile Page loads:
  - Overview tab: Basic info, progress, schedule
  - Lessons tab: Recent lessons with ratings
  - Classes tab: Class history and attendance
  - Notes tab: Private teacher notes
```

---

## User Flow

### Students List Page (`/students`)
1. Teacher sees a grid/list of all their assigned students
2. Search bar filters students by name or email
3. Status filter shows Active/Inactive/On Hold students
4. Course level filter narrows by Beginner/Intermediate/Advanced
5. Quick stats show total students, active count, today's classes
6. Click on student card navigates to profile

### Student Profile Page (`/students/:id`)
1. Header shows student avatar, name, country, status badge
2. Tabs organize different data sections:
   - **Overview**: Schedule, current progress, contact info
   - **Lessons**: Recent lesson history with ratings
   - **Classes**: Upcoming and past classes
   - **Notes**: Private notes only visible to teacher
3. Quick actions: Start class, add lesson, schedule recovery

---

## Components to Create

### 1. Students List Page

**File**: `src/pages/students/Students.tsx`

**Features**:
- Responsive grid layout (cards on desktop, list on mobile)
- Search with debounce for performance
- Multi-filter dropdowns (status, course level)
- Sort options (name A-Z, progress, recent activity)
- Empty state for no students
- Loading skeletons

**Card displays**:
- Avatar with status indicator
- Student name and country flag
- Course level badge
- Progress bar (current_juzz / 30)
- Last class date
- Quick call button

---

### 2. Student Profile Page

**File**: `src/pages/students/StudentProfile.tsx`

**Features**:
- Profile header with large avatar
- Tab-based navigation for sections
- Real-time data fetching with react-query
- Responsive design for mobile

**Tabs**:
1. **Overview Tab**
   - Schedule display (days, time, timezone)
   - Current progress (surah, juzz, percentage)
   - Contact info (email, phone, country)
   - Quick stats (total classes, attendance rate)

2. **Lessons Tab**
   - Recent lessons table/cards
   - Filter by date range
   - Average ratings display
   - Link to full lesson details

3. **Classes Tab**
   - Upcoming scheduled classes
   - Past class history
   - Status badges (completed, missed, etc.)
   - Recovery class indicators

4. **Notes Tab**
   - Private teacher notes textarea
   - Save/edit functionality
   - Last updated timestamp

---

### 3. Student Card Component

**File**: `src/components/students/StudentCard.tsx`

**Purpose**: Reusable card for student list

**Features**:
- Avatar with online/offline indicator
- Name with country flag emoji
- Course level and status badges
- Progress visualization
- Quick action buttons

---

### 4. Student Stats Component

**File**: `src/components/students/StudentStats.tsx`

**Purpose**: Summary statistics header

**Features**:
- Total students count
- Active students count
- Students with class today
- Average progress across all students

---

### 5. Progress Indicator Component

**File**: `src/components/students/ProgressIndicator.tsx`

**Purpose**: Visual progress display

**Features**:
- Circular or bar progress
- Juzz completion (x/30)
- Surah name display
- Percentage label

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/students/Students.tsx` | Main students list page |
| `src/pages/students/StudentProfile.tsx` | Individual student profile |
| `src/components/students/StudentCard.tsx` | Reusable student card |
| `src/components/students/StudentStats.tsx` | Summary statistics |
| `src/components/students/ProgressIndicator.tsx` | Progress visualization |
| `src/hooks/useStudents.ts` | Data fetching hook |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/placeholders.tsx` | Remove Students and StudentProfile exports |
| `src/App.tsx` | Update routes to new components |

---

## Data Fetching

### Students List Query
```text
SELECT * FROM students
WHERE teacher_id = current_teacher_id
ORDER BY full_name ASC
```

### Student Profile Query
```text
SELECT * FROM students WHERE id = student_id

-- With related data:
- Recent lessons (last 10)
- Upcoming classes (next 7 days)
- Past classes (last 30 days)
- Attendance statistics
```

### Statistics Query
```text
- COUNT(*) total students
- COUNT(*) WHERE status = 'active'
- COUNT(*) students with class today
- AVG(progress_percentage)
```

---

## UI Layout

### Students List Page
```text
+--------------------------------------------------+
|  My Students                    [Grid] [List]    |
|                                                  |
|  [Search students...     ]  [Status v] [Level v] |
|                                                  |
|  +--------+  +--------+  +--------+  +--------+  |
|  | Avatar |  | Avatar |  | Avatar |  | Avatar |  |
|  | Name   |  | Name   |  | Name   |  | Name   |  |
|  | Level  |  | Level  |  | Level  |  | Level  |  |
|  | ====== |  | ====== |  | ====== |  | ====== |  |
|  | 45%    |  | 72%    |  | 23%    |  | 89%    |  |
|  +--------+  +--------+  +--------+  +--------+  |
|                                                  |
|  +--------+  +--------+  +--------+  +--------+  |
|  | ...    |  | ...    |  | ...    |  | ...    |  |
|  +--------+  +--------+  +--------+  +--------+  |
+--------------------------------------------------+
```

### Student Profile Page
```text
+--------------------------------------------------+
|  <- Back to Students                              |
|                                                  |
|  +--------+                                       |
|  | AVATAR |  Ahmed Hassan                        |
|  |        |  Saudi Arabia | Active               |
|  +--------+  Tajweed Intermediate                |
|                                                  |
|  [Overview] [Lessons] [Classes] [Notes]          |
|  ------------------------------------------------|
|                                                  |
|  Schedule                    Progress            |
|  Mon, Wed, Fri @ 10:00 AM    Surah: Al-Baqarah   |
|  30 minutes • Asia/Riyadh    Juzz: 3/30 (10%)    |
|                                                  |
|  Contact                     Stats               |
|  ahmed@email.com             156 total classes   |
|  +966 xxx xxx                94% attendance      |
+--------------------------------------------------+
```

---

## Technical Details

### Search Implementation
- Debounced input (300ms delay)
- Client-side filtering for small datasets
- Server-side search for larger lists (future)

### Filter Options

**Status Filter**:
- All
- Active
- Inactive
- On Hold

**Course Level Filter**:
- All
- Beginner
- Intermediate
- Advanced

**Sort Options**:
- Name (A-Z)
- Name (Z-A)
- Progress (High to Low)
- Progress (Low to High)
- Recent Activity

### Progress Calculation
```text
Progress = (current_juzz / 30) * 100
Visual: Circular progress or horizontal bar
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No students assigned | Show "No students" empty state with helpful message |
| Student not found | Redirect to /students with error toast |
| Failed to load data | Show error state with retry button |
| Network error | Display offline indicator, cached data if available |

---

## Mobile Responsiveness

- **Desktop**: 4-column grid for student cards
- **Tablet**: 2-column grid
- **Mobile**: Single column list view
- **Profile**: Stack tabs vertically, swipeable sections

---

## Outcome

After implementation:
- Teachers can quickly find and view all their students
- Student progress is clearly visualized
- Easy navigation between student profile sections
- Mobile-friendly design for on-the-go access
- Foundation for adding student management features (edit notes, schedule changes)

