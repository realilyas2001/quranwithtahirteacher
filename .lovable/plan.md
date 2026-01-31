

# Teacher Dashboard - Online Quran Academy
## Full Implementation Plan

---

## Overview

A production-ready teacher dashboard for 1-to-1 Quran classes featuring real-time video calling, comprehensive class management, student tracking, and salary management. Built with React/TypeScript frontend and Supabase backend, with Daily.co for WebRTC video calls.(keep in mind i have now i have firebase free tier make all thing compitable after migration to firebase)

---

## Phase 1: Foundation & Core Infrastructure

### 1.1 Project Setup & Authentication
- Configure Supabase with Lovable Cloud
- JWT-based authentication for teachers
- Login/logout flow with session management
- Protected routes for all dashboard pages

### 1.2 Database Schema Design
**Core Tables:**
- `teachers` - profile, contact, salary base, status
- `students` - profile, country, language, schedule, duration preferences
- `classes` - scheduling, status tracking, room IDs
- `lessons` - Quran progress, ratings, comments, images
- `attendance` - present/absent/late/no-answer tracking
- `call_logs` - call events with timestamps and metadata
- `salary_records` - monthly calculations with breakdowns
- `deductions` - itemized deduction tracking
- `notifications` - in-app notification system
- `examiner_remarks` - OCA feedback and notes
- `tasks` - admin-assigned and personal tasks
- `user_roles` - secure role management (separate from profiles)

### 1.3 Firebase Migration Plan (i migrate this backend to firebase in future)
- Document current Firebase structure
- Create data export scripts
- Map Firebase collections to Supabase tables
- Plan incremental migration approach

---

## Phase 2: Navigation & Layout

### 2.1 Responsive Sidebar Navigation
All 18 menu items in exact order:
1. Dashboard
2. Today Classes
3. Classes
4. Class Schedule (Calendar)
5. My Students
6. Lessons (expandable: Add Lesson, Lesson History, Examiner Remarks)
7. Attendance
8. Reminder
9. Tasks
10. Complaints
11. Suggestions
12. Feedback
13. Salary
14. Deduction List
15. Improvement
16. Rules
17. Instruction
18. Announcements

### 2.2 Layout Features
- Collapsible sidebar for mobile
- Active route highlighting
- Teacher profile header with avatar
- Notification bell with badge count
- Connection status indicator

---

## Phase 3: Dashboard & Today Classes (Priority)

### 3.1 Main Dashboard
- **Summary Cards:** Today's class count, completed this week, avg rating, pending tasks
- **Next Class Card:** Large card with student photo, name, scheduled time, prominent "Start Class" button
- **Alerts Section:** Missed classes count (clickable to filtered view)
- **Quick Actions:** Common shortcuts
- Real-time updates via Supabase Realtime

### 3.2 Today Classes Page
**TodayClassRow Component:**
- Student avatar, name, level, country flag
- Scheduled time display
- Status pill (Scheduled/In Progress/Missed/No Answer) with color coding
- "Lesson Added" indicator
- **Action Buttons:**
  - Call button (initiates video call flow)
  - Start Class button
  - Notes icon (opens quick note drawer)
  - View Profile link

**Call Flow Integration:**
- Click Call → Show "Ringing..." state with 40s timer
- Student accepts → Both enter video room
- Student rejects/timeout → Mark "No Answer", show Retry option
- Rate-limited retry functionality

---

## Phase 4: Video Calling with Daily.co

### 4.1 Call Initiation & Signaling
- Edge function to create Daily.co room on call initiate
- Store call state in `call_logs` table
- Supabase Realtime for call status updates between teacher/student

### 4.2 Video Room Interface
**ClassRoom Component:**
- Full-screen video view with teacher/student feeds
- Controls: Mute/unmute, camera on/off, end call
- Class timer display
- Screen share option (optional)
- Connection quality indicator

### 4.3 Call Lifecycle
- Call initiated → Room created, student notified
- Call accepted → Both join room, class marked "in progress", attendance auto-recorded
- Call timeout (40s) → Mark "no answer", update attendance
- Call ended → Class marked complete, Quick Lesson modal auto-opens

---

## Phase 5: Quick Lesson Flow

### 5.1 Quick Lesson Modal
Auto-opens after class ends with minimal fields:
- Quran covered (Yes/No)
- Memorization summary
- Focus rating (1-5 stars)
- Quick note (optional)
- Auto-filled from previous lesson

### 5.2 Full Add Lesson Form
Complete form with all fields:
- Course Level, Quran Subject, Surah, Juzz
- Page From/To, Ayah From/To
- Memorization details, Fundamental Islam, Ethics
- Comments, Method, Quran Completed checkbox
- Ratings: Concentration, Revision, Progress (1-5 stars)
- Image uploads for lesson materials

### 5.3 Lesson History
- Filterable table by student, date, level
- View/Edit functionality
- Export capability

---

## Phase 6: Student Management

### 6.1 My Students List
- Student cards with avatar, name, level, schedule
- Progress bar visualization
- Quick search and filters
- Click to open full profile

### 6.2 Student Profile Page
**Tabbed Interface:**
- **Overview:** Last 3 lessons, next class, quick contact (call/WhatsApp)
- **Lesson History:** Complete lesson records with view/edit
- **Attendance:** Status history with date filter
- **Examiner Remarks:** OCA notes, teacher internal notes
- **Payments:** (read-only view)

---

## Phase 7: Class Management

### 7.1 Classes Page
- Tabbed view: All, Scheduled, Recovery, Completed
- Search by student name
- Date range filter
- Reschedule request functionality
- Manual class addition

### 7.2 Class Schedule (Calendar)
- Week view with class blocks
- Color-coded by status
- Click block → Class details modal
- Reschedule request option

---

## Phase 8: Attendance Management

### 8.1 Attendance Page
- Daily/weekly list view
- Status pills: Present (green), Absent (red), Late (amber), Leave (blue), No Answer (gray)
- Quick-edit with reason modal for Late/Leave
- Bulk operations for day/week
- Automated recording from call acceptance

---

## Phase 9: Communication & Tasks

### 9.1 Reminders
- Create reminder with title, date/time, repeat options
- Attach to specific class or student
- Push notification integration (optional)

### 9.2 Tasks
- Admin-assigned vs personal tasks
- Status: Pending/Completed
- Mark complete with proof upload
- Filter by status

### 9.3 Notifications
- Real-time notification bell
- Types: class reminders, admin messages, task assignments
- Mark as read functionality

---

## Phase 10: Teacher Portal Pages

### 10.1 Complaints & Suggestions
- Submit form with attachments
- Status tracking (Open/Under Review/Resolved)
- History view

### 10.2 Feedback
- Read-only view of student/admin feedback
- Respond with private notes

### 10.3 Salary
- Monthly breakdown: base, class count, bonuses, deductions, net
- Click month for detailed view
- "Raise Issue" button for discrepancies

### 10.4 Deduction List
- Itemized deductions with reasons and dates
- Request review functionality

### 10.5 Improvement
- Examiner suggestions and required actions
- Mark as done with evidence upload

### 10.6 Rules & Instructions
- Static policy pages (read-only)
- Downloadable PDF
- How-to guides and best practices

### 10.7 Announcements
- Admin announcements list
- Click to expand full message
- New badge for unread

---

## Phase 11: Polish & Optimization

### 11.1 UI/UX Refinements
- Data-rich professional styling
- Clear color semantics (green=good, red=missed, amber=late)
- Confirmation modals for destructive actions
- Autosave for long text inputs
- Keyboard shortcuts (S=Start Class, Q=Quick Lesson)

### 11.2 Mobile Responsiveness
- Collapsible sidebar to hamburger menu
- Today Classes as card list on mobile
- Touch-optimized controls in video room
- Swipe gestures where appropriate

### 11.3 Performance
- Optimistic UI updates
- Efficient data fetching with proper caching
- Lazy loading for lesson images
- Connection state management for offline handling

---

## Technical Architecture Summary

| Component | Technology |
|-----------|------------|
| Frontend | React + TypeScript |
| UI Framework | Tailwind CSS + shadcn/ui |
| Backend | Supabase (Database + Auth + Edge Functions) |
| Real-time | Supabase Realtime |
| Video Calls | Daily.co |
| File Storage | Supabase Storage |
| State Management | React Query + Zustand |

---

## Deliverables

1. **Complete Teacher Dashboard** - All 18 pages fully functional
2. **Video Calling System** - Daily.co integrated call flow
3. **Quick Lesson Flow** - Auto-opening modal after class end
4. **Real-time Updates** - Live status changes and notifications
5. **Responsive Design** - Works on desktop and mobile
6. **Firebase Migration Guide** - Documentation for data migration
7. **API Documentation** - All edge functions documented

