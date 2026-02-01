
# Phase 10: Teacher Portal Pages - Implementation Plan

## Overview
Replace the 5 remaining placeholder pages with fully functional implementations using existing hooks and database schema.

---

## Pages to Implement

### 1. Lesson History (`/lessons/history`)
A searchable list of all recorded lessons with filtering and details view.

**Features**:
- List all lessons with student name, surah, date, and ratings
- Filters: student, date range, surah, course level
- Click to view full lesson details in a dialog
- Show ratings (concentration, revision, progress) as stars
- Sort by date (newest first)

**Components**:
- `src/pages/lessons/LessonHistory.tsx` - main page
- `src/components/lessons/LessonCard.tsx` - lesson display card
- `src/components/lessons/LessonDetailsDialog.tsx` - detailed view

---

### 2. Examiner Remarks (`/lessons/examiner`)
View examiner feedback and respond to remarks.

**Features**:
- List remarks grouped by student or chronologically
- Show linked lesson info (surah, date)
- Display tags as badges
- Teacher can write responses via dialog
- Filter: by student, response status (responded/pending)

**Components**:
- `src/pages/lessons/ExaminerRemarks.tsx` - main page
- `src/components/lessons/RemarkCard.tsx` - remark display
- Uses existing `useExaminerRemarks` hook

---

### 3. Reminders (`/reminder`)
Create and manage personal reminders with date/time.

**Features**:
- List reminders (upcoming first, then overdue, then completed)
- Create new reminder: title, description, remind_at datetime
- Optional: link to student or class
- Mark as completed
- Delete reminder
- Filters: upcoming, completed, overdue

**Components**:
- `src/pages/reminders/Reminders.tsx` - main page
- `src/components/reminders/ReminderCard.tsx` - reminder display
- `src/components/reminders/ReminderDialog.tsx` - create/edit
- `src/hooks/useReminders.ts` - CRUD operations

---

### 4. Salary (`/salary`)
View monthly salary records with breakdown.

**Features**:
- List salary records by month (most recent first)
- Show: base salary, classes count, bonus, deductions, net salary
- Status indicator (pending, paid)
- Month selector or scroll through history
- Summary card for current month at top

**Components**:
- `src/pages/salary/Salary.tsx` - main page
- `src/components/salary/SalaryCard.tsx` - monthly record display
- `src/components/salary/SalarySummary.tsx` - current month summary
- Uses existing `useSalary` hook

---

### 5. Deductions (`/deductions`)
View deduction history and request reviews.

**Features**:
- List all deductions with date, reason, amount
- Request review button (if not already requested)
- Show review status (pending, approved, rejected)
- Filter by month or status
- Total deductions summary

**Components**:
- `src/pages/salary/Deductions.tsx` - main page
- `src/components/salary/DeductionCard.tsx` - deduction display
- Uses existing `useSalary` hook (has deductions + requestReview)

---

## File Structure

```text
src/
├── hooks/
│   └── useReminders.ts          (new)
├── pages/
│   ├── lessons/
│   │   ├── LessonHistory.tsx    (new)
│   │   └── ExaminerRemarks.tsx  (new)
│   ├── reminders/
│   │   └── Reminders.tsx        (new)
│   └── salary/
│       ├── Salary.tsx           (new)
│       └── Deductions.tsx       (new)
├── components/
│   ├── lessons/
│   │   ├── LessonCard.tsx       (new)
│   │   ├── LessonDetailsDialog.tsx (new)
│   │   └── RemarkCard.tsx       (new)
│   ├── reminders/
│   │   ├── ReminderCard.tsx     (new)
│   │   └── ReminderDialog.tsx   (new)
│   └── salary/
│       ├── SalaryCard.tsx       (new)
│       ├── SalarySummary.tsx    (new)
│       └── DeductionCard.tsx    (new)
└── App.tsx                      (update imports)
```

---

## Route Updates

Update `src/App.tsx` to import the new pages and remove placeholder imports:

| Route | Component |
|-------|-----------|
| `/lessons/history` | `LessonHistory` |
| `/lessons/examiner` | `ExaminerRemarks` |
| `/reminder` | `Reminders` |
| `/salary` | `Salary` |
| `/deductions` | `Deductions` |

---

## Technical Details

### useReminders Hook
```typescript
// Operations needed:
- fetchReminders (with filters: upcoming, completed, overdue)
- createReminder (title, description, remind_at, student_id?, class_id?)
- updateReminder (mark complete, edit)
- deleteReminder
```

### Key UI Patterns (matching existing pages)
- Header with title + description + action button
- Filter tabs or dropdowns
- Empty state with icon and message
- Card-based list layout
- Loading skeleton states
- Toast notifications for actions

---

## No Database Changes Required
All tables and RLS policies already exist:
- `lessons` - teachers can view/manage their lessons
- `examiner_remarks` - teachers can view and respond
- `reminders` - teachers can manage their reminders (full CRUD)
- `salary_records` - teachers can view their records
- `deductions` - teachers can view and request reviews

---

## Implementation Order
1. `useReminders` hook (required for Reminders page)
2. Salary + Deductions pages (simpler, uses existing hook)
3. Lesson History page (uses existing `useLessons` hook)
4. Examiner Remarks page (uses existing `useExaminerRemarks` hook)
5. Reminders page (uses new hook)
6. Update App.tsx routes
7. Clean up placeholders.tsx
