
# Phase 3: Core Student Pages Implementation Plan

## Overview
This phase implements fully functional student pages with real data from the database, including Today Classes, My Classes history, My Schedule calendar, and editable Profile/Settings pages.

---

## New Hooks Required

### 1. useStudentClasses Hook
Create a new hook specifically for student class queries (different from teacher's useClasses).

**File**: `src/hooks/useStudentClasses.ts`

**Features**:
- Fetch classes filtered by student_id (from AuthContext)
- Support for filters: tab (all/upcoming/completed/missed), date range
- Join teacher data via classes -> teachers -> profiles for teacher name
- Today's classes query helper
- Weekly classes for calendar view
- Class stats (total, completed, missed, upcoming)

**Key difference from teacher hook**: Query by `student_id` instead of `teacher_id`, and join teacher data instead of student data.

---

### 2. useStudentSettings Hook
Manage student preferences stored in `student_settings` table.

**File**: `src/hooks/useStudentSettings.ts`

**Features**:
- Fetch current settings for logged-in student
- Update settings mutation (timezone, notification_prefs, video_pref, low_bandwidth_mode, accessibility_mode)
- Auto-create settings record if none exists on first update

---

### 3. useStudentProfile Hook
Handle student profile updates.

**File**: `src/hooks/useStudentProfile.ts`

**Features**:
- Update student record (full_name, phone, country, timezone)
- Update profile record if needed
- Refresh AuthContext after update

---

## Component Updates

### 1. StudentClassCard Component
A student-focused version of ClassCard showing teacher info instead of student info.

**File**: `src/components/student/StudentClassCard.tsx`

**Features**:
- Display teacher avatar, name (from joined data)
- Date, time, duration
- Status badge (same styling as teacher version)
- **Join Class** button for scheduled/in_progress classes
- **View Lesson** link for completed classes
- **Request Reschedule** option for scheduled classes
- Recovery badge if applicable
- Compact variant for calendar view

---

## Page Implementations

### 1. Today Classes (`/student/today`)

**Data Flow**:
- Use `useStudentClasses` with filter for today's date only
- Show loading skeleton during fetch
- Empty state when no classes

**UI Components**:
- Header with date display (e.g., "Saturday, February 1, 2025")
- List of `StudentClassCard` components
- Each card shows: scheduled time, teacher name/avatar, duration, status
- Prominent "Join Class" button for active classes
- Class countdown timer for upcoming classes (e.g., "Starts in 2 hours")

**Empty State**:
- Calendar icon
- "No classes scheduled for today"
- Link to "View My Schedule"

---

### 2. My Classes (`/student/classes`)

**Data Flow**:
- Use `useStudentClasses` with tab-based filtering
- Pagination or infinite scroll for history

**UI Components**:
- Tab navigation: All | Upcoming | Completed | Missed
- Stats summary cards at top:
  - Total classes taken
  - Classes this month
  - Attendance rate
  - Missed classes count
- Filterable class list using `StudentClassCard`
- Date range picker for historical filtering
- Search by teacher name (if student has had multiple teachers)

**Tab Behaviors**:
- **All**: All classes ordered by date desc
- **Upcoming**: scheduled_date >= today, status = scheduled
- **Completed**: status = completed
- **Missed**: status in (missed, no_answer, cancelled)

---

### 3. My Schedule (`/student/schedule`)

**Data Flow**:
- Use `useStudentClasses` with weekly date range
- Week navigation (previous/next week buttons)

**UI Components**:
- Week navigator with arrows and current week display
- Two view modes:
  - **Week View** (desktop): 7-column grid showing classes per day
  - **Day View** (mobile): Single day with swipe navigation
- Use existing `WeekCalendar` component pattern but adapted for student context
- Calendar dots showing class days in month overview
- Click class to view details or join

**Calendar Component**:
```text
+-----+-----+-----+-----+-----+-----+-----+
| Mon | Tue | Wed | Thu | Fri | Sat | Sun |
| 3   | 4   | 5   | 6   | 7   | 8   | 9   |
+-----+-----+-----+-----+-----+-----+-----+
|     | 9:00|     | 9:00|     | 9:00|     |
|     |class|     |class|     |class|     |
+-----+-----+-----+-----+-----+-----+-----+
```

---

### 4. Profile (`/student/profile`)

**Data Flow**:
- Get current student from AuthContext
- Use `useStudentProfile` hook for updates
- Controlled form inputs

**Editable Fields**:
- Full Name (text input)
- Phone (text input with formatting)
- Country (select with common countries)
- Timezone (select with timezone list)
- Language preference (select: English, Arabic, Urdu)
- Avatar (upload button - placeholder for now)

**Non-editable Fields** (displayed but disabled):
- Email (from auth)
- Course Level (set by teacher)
- Connected Teacher (display only)
- Account Created date

**Form Behavior**:
- Track dirty state to enable/disable save button
- Validation for required fields
- Toast on success/error
- Refresh AuthContext after save

---

### 5. Settings (`/student/settings`)

**Data Flow**:
- Use `useStudentSettings` hook
- Load existing settings or defaults
- Auto-save on toggle changes (with debounce)

**Settings Sections**:

1. **Notifications**
   - Email notifications (toggle)
   - Push notifications (toggle)
   - Class reminders (toggle)
   - Reminder timing (select: 5min, 15min, 30min, 1hr before)

2. **Video Preferences**
   - Camera on by default (toggle)
   - Low bandwidth mode (toggle) - "Use audio-only to save data"

3. **Accessibility**
   - Accessibility mode (select: Standard, Senior-Friendly, High Contrast)
   - Senior-Friendly: larger fonts, bigger buttons
   - High Contrast: improved color contrast

4. **Regional**
   - Timezone (select - synced with profile)
   - Display language (select)

**Implementation**:
- Each toggle/select updates `student_settings` table
- Show "Saving..." indicator during updates
- Optimistic updates for toggles

---

## Database Queries

### Student Classes Query Pattern
```typescript
const { data } = await supabase
  .from('classes')
  .select(`
    *,
    teacher:teachers!inner(
      id,
      user_id,
      bio,
      profile:profiles!inner(
        full_name,
        avatar_url
      )
    )
  `)
  .eq('student_id', studentId)
  .order('scheduled_date', { ascending: false });
```

### Student Settings Query
```typescript
// Fetch
const { data } = await supabase
  .from('student_settings')
  .select('*')
  .eq('student_id', studentId)
  .maybeSingle();

// Upsert (insert or update)
const { error } = await supabase
  .from('student_settings')
  .upsert({
    student_id: studentId,
    timezone: 'America/New_York',
    notification_prefs: { email: true, push: true },
    // ... other fields
  });
```

---

## File Changes Summary

**New Files**:
- `src/hooks/useStudentClasses.ts` - Class queries for students
- `src/hooks/useStudentSettings.ts` - Settings management
- `src/hooks/useStudentProfile.ts` - Profile updates
- `src/components/student/StudentClassCard.tsx` - Class display for students

**Updated Files**:
- `src/pages/student/TodayClasses.tsx` - Full implementation with data
- `src/pages/student/MyClasses.tsx` - Full implementation with tabs/filters
- `src/pages/student/MySchedule.tsx` - Calendar view implementation
- `src/pages/student/Profile.tsx` - Editable form with save
- `src/pages/student/Settings.tsx` - Working toggles connected to DB

---

## Implementation Order

1. **Create hooks first** (useStudentClasses, useStudentSettings, useStudentProfile)
2. **Create StudentClassCard component**
3. **Update TodayClasses** - Simplest page, validates hook works
4. **Update MyClasses** - Add tabs and filtering
5. **Update MySchedule** - Calendar component
6. **Update Profile** - Form with validation
7. **Update Settings** - Connect toggles to database

---

## Technical Notes

- Reuse existing UI components (Card, Badge, Avatar, Tabs, Select)
- Follow existing hook patterns from teacher dashboard
- Use react-query for data fetching and caching
- Use sonner for toast notifications
- Timezone handling: store in UTC, display in user's timezone
- Mobile-first: all pages must work well on mobile devices

---

## Estimated Changes

| File | Type | Lines |
|------|------|-------|
| useStudentClasses.ts | New | ~120 |
| useStudentSettings.ts | New | ~80 |
| useStudentProfile.ts | New | ~60 |
| StudentClassCard.tsx | New | ~150 |
| TodayClasses.tsx | Update | ~100 |
| MyClasses.tsx | Update | ~180 |
| MySchedule.tsx | Update | ~200 |
| Profile.tsx | Update | ~150 |
| Settings.tsx | Update | ~120 |

**Total: ~1160 lines of code across 9 files**
