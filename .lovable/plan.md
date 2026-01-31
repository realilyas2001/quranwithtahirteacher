

# Phase 2: Navigation & Layout - Enhancement Plan

## Current Status
Phase 2 foundation is already in place with a fully functional sidebar, header with notifications, and responsive layout. This plan focuses on polishing and enhancing the navigation experience.

---

## Enhancements to Implement

### 1. Desktop Sidebar Toggle Button
Add a visible toggle button in the header that works on desktop to collapse/expand the sidebar.

**Files to modify:**
- `src/components/layout/DashboardHeader.tsx` - Add SidebarTrigger for desktop

---

### 2. Dynamic Page Title in Header
Display the current page title in the header based on the active route.

**Changes:**
- Create a route-to-title mapping utility
- Show page title next to the sidebar trigger
- Add breadcrumb navigation for nested routes (e.g., Lessons > Add Lesson)

**Files to modify:**
- `src/components/layout/DashboardHeader.tsx`

---

### 3. Improved Sidebar Scroll Area
Wrap sidebar navigation in a proper scroll area for when there are many items.

**Files to modify:**
- `src/components/layout/DashboardSidebar.tsx` - Use ScrollArea component

---

### 4. Mobile Navigation Improvements
Enhance mobile experience with better hamburger menu styling and close-on-navigate behavior.

**Files to modify:**
- `src/components/layout/DashboardSidebar.tsx` - Auto-close on mobile after navigation
- `src/components/layout/DashboardHeader.tsx` - Better mobile trigger styling

---

### 5. Sidebar Footer Improvements
When sidebar is collapsed, allow clicking the avatar to sign out.

**Files to modify:**
- `src/components/layout/DashboardSidebar.tsx`

---

### 6. Keyboard Shortcuts Component
Add a keyboard shortcuts help modal accessible from the header.

**New file:**
- `src/components/layout/KeyboardShortcuts.tsx`

**Files to modify:**
- `src/components/layout/DashboardHeader.tsx`

---

## Technical Implementation Details

### Route Title Mapping
```text
/dashboard        -> Dashboard
/today-classes    -> Today's Classes
/classes          -> Classes
/schedule         -> Class Schedule
/students         -> My Students
/students/:id     -> Student Profile
/lessons/add      -> Add Lesson
/lessons/history  -> Lesson History
/lessons/examiner -> Examiner Remarks
/attendance       -> Attendance
/reminder         -> Reminders
/tasks            -> Tasks
/complaints       -> Complaints
/suggestions      -> Suggestions
/feedback         -> Feedback
/salary           -> Salary
/deductions       -> Deduction List
/improvement      -> Improvement
/rules            -> Rules
/instruction      -> Instructions
/announcements    -> Announcements
```

### Breadcrumb Structure
- Simple pages: Just show page title
- Nested pages: Show parent > child (e.g., "Lessons > Add Lesson")

---

## Summary of Changes

| Component | Change |
|-----------|--------|
| DashboardHeader | Add desktop sidebar trigger, page title, breadcrumbs |
| DashboardSidebar | Add ScrollArea, auto-close on mobile, collapsed avatar action |
| New: KeyboardShortcuts | Modal showing available shortcuts |

---

## Outcome
After implementation:
- Desktop users can easily toggle sidebar with a visible button
- Current page context is always visible in the header
- Sidebar scrolls smoothly with many items
- Mobile navigation closes after selecting a page
- Keyboard shortcuts discoverable via help modal (Ctrl+B for sidebar)

