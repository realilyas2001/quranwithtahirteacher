

# Phase 9: Communication & Tasks

## Overview

Build a comprehensive communication and task management system that enables teachers to:
- View and manage assigned tasks (personal and admin-assigned)
- Submit and track complaints with attachments
- Share suggestions with the academy
- View feedback from students and admin
- Access announcements, rules, instructions, and improvement items

This phase replaces 11 placeholder pages with fully functional implementations.

---

## Architecture

```text
Teacher Dashboard Communication Hub
        |
        +-- Tasks (/tasks)
        |   - View assigned and personal tasks
        |   - Update task status
        |   - Submit completion proof
        |
        +-- Complaints (/complaints)
        |   - Submit new complaints
        |   - Track complaint status
        |   - View admin responses
        |
        +-- Suggestions (/suggestions)
        |   - Submit improvement ideas
        |   - Track suggestion status
        |
        +-- Feedback (/feedback)
        |   - View received feedback
        |   - Respond to feedback
        |
        +-- Announcements (/announcements)
        |   - View active announcements
        |   - Mark as read
        |
        +-- Improvement (/improvement)
        |   - View improvement items
        |   - Mark as completed with evidence
        |
        +-- Rules (/rules)
        |   - View academy policies
        |   - PDF document access
        |
        +-- Instructions (/instruction)
            - How-to guides
            - Video tutorials
```

---

## Database Tables Used

| Table | Purpose |
|-------|---------|
| tasks | Teacher tasks (assigned + personal) |
| complaints | Teacher complaints with attachments |
| suggestions | Teacher suggestions |
| feedback | Feedback from students/admin |
| announcements | System announcements |
| announcement_reads | Track read status |
| improvements | Improvement items from examiners |
| rules_documents | Academy policies |
| instructions | How-to guides |

---

## Files to Create

### Pages

| File | Purpose |
|------|---------|
| `src/pages/tasks/Tasks.tsx` | Tasks management page |
| `src/pages/complaints/Complaints.tsx` | Complaints submission & tracking |
| `src/pages/suggestions/Suggestions.tsx` | Suggestions page |
| `src/pages/feedback/Feedback.tsx` | Feedback viewing page |
| `src/pages/announcements/Announcements.tsx` | Announcements page |
| `src/pages/improvement/Improvement.tsx` | Improvement tracking page |
| `src/pages/rules/Rules.tsx` | Rules documents page |
| `src/pages/instructions/Instructions.tsx` | Instructions & guides page |

### Components

| File | Purpose |
|------|---------|
| `src/components/tasks/TaskCard.tsx` | Reusable task display card |
| `src/components/tasks/TaskDialog.tsx` | Create/edit task dialog |
| `src/components/communication/ComplaintDialog.tsx` | Submit complaint dialog |
| `src/components/communication/SuggestionDialog.tsx` | Submit suggestion dialog |
| `src/components/communication/FeedbackCard.tsx` | Feedback display card |
| `src/components/communication/AnnouncementCard.tsx` | Announcement display |
| `src/components/communication/ImprovementCard.tsx` | Improvement item card |
| `src/components/communication/DocumentCard.tsx` | Rules/instruction card |

### Hooks

| File | Purpose |
|------|---------|
| `src/hooks/useTasks.ts` | Task data fetching & mutations |
| `src/hooks/useCommunication.ts` | Complaints, suggestions, feedback hooks |
| `src/hooks/useAnnouncements.ts` | Announcements fetching & read marking |
| `src/hooks/useDocuments.ts` | Rules & instructions fetching |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/placeholders.tsx` | Remove replaced exports |
| `src/App.tsx` | Update routes to new components |

---

## Feature Details

### 1. Tasks Page (`/tasks`)

**Features**:
- Tabbed view: All, Pending, In Progress, Completed
- Filter by due date, personal vs assigned
- Create personal task button
- Task card with status, due date, description
- Update status with proof upload for completion
- Overdue indicator for past due tasks

**Task Card Display**:
- Title and description
- Status pill (pending/in_progress/completed)
- Due date with overdue highlighting
- Assigned by indicator (if admin-assigned)
- Personal task badge
- Quick status update buttons

### 2. Complaints Page (`/complaints`)

**Features**:
- Submit new complaint button
- List of submitted complaints
- Status tracking (open/under_review/resolved/closed)
- View admin responses
- Attachment support

**Complaint Dialog**:
- Subject field
- Description textarea
- File attachment (optional)
- Submit button

### 3. Suggestions Page (`/suggestions`)

**Features**:
- Submit new suggestion button
- List of submitted suggestions
- Status tracking
- View admin responses

**Suggestion Dialog**:
- Title field
- Description textarea
- Submit button

### 4. Feedback Page (`/feedback`)

**Features**:
- View feedback received from students/admin
- Rating display (if provided)
- Add teacher response
- Filter by from_type (student/admin)

### 5. Announcements Page (`/announcements`)

**Features**:
- List of active announcements
- Priority indicator (normal/high/urgent)
- Auto-mark as read on view
- Expandable content for long announcements
- Expiry indicator

### 6. Improvement Page (`/improvement`)

**Features**:
- View improvement items assigned
- Mark as completed with evidence URL
- Filter: Pending vs Completed
- Required action display
- Examiner attribution

### 7. Rules Page (`/rules`)

**Features**:
- Categorized list of rule documents
- PDF viewer/download
- Search functionality
- Expandable content sections

### 8. Instructions Page (`/instruction`)

**Features**:
- Categorized how-to guides
- Video tutorials (embed support)
- Search functionality
- Ordered display

---

## UI Layouts

### Tasks Page
```text
+----------------------------------------------------------+
|  Tasks                                    [+ New Task]    |
|  Manage your personal and assigned tasks                  |
+----------------------------------------------------------+
|  [All] [Pending (3)] [In Progress (1)] [Completed]       |
+----------------------------------------------------------+
|  Filter: [Personal ▼] [Due Date ▼]        [Clear]        |
+----------------------------------------------------------+
|                                                           |
|  +------------------------------------------------------+ |
|  | [ ] Complete student progress reports                 | |
|  |     Due: Feb 3, 2026 (2 days)           [Pending]    | |
|  |     Assigned by: Admin                               | |
|  |     [Start] [Complete]                               | |
|  +------------------------------------------------------+ |
|  | [✓] Review lesson plans                 [Completed]   | |
|  |     Completed: Jan 30, 2026                          | |
|  |     Personal Task                                    | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### Complaints Page
```text
+----------------------------------------------------------+
|  Complaints                          [+ Submit Complaint] |
|  Submit and track your complaints                         |
+----------------------------------------------------------+
|                                                           |
|  +------------------------------------------------------+ |
|  | Technical Issue with Video Platform        [Open]    | |
|  | Submitted: Jan 28, 2026                              | |
|  | Video quality dropping during classes...             | |
|  |                                                      | |
|  | No response yet                                      | |
|  +------------------------------------------------------+ |
|  | Scheduling Conflict                     [Resolved]   | |
|  | Submitted: Jan 20, 2026                              | |
|  |                                                      | |
|  | Admin Response:                                      | |
|  | Schedule has been adjusted as requested...           | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

### Announcements Page
```text
+----------------------------------------------------------+
|  Announcements                                            |
|  Important updates from administration                    |
+----------------------------------------------------------+
|                                                           |
|  +------------------------------------------------------+ |
|  | [HIGH] New Curriculum Update             [New]       | |
|  | Feb 1, 2026                                          | |
|  |                                                      | |
|  | Important changes to the Tajweed curriculum will     | |
|  | take effect starting next month...        [Read More]| |
|  +------------------------------------------------------+ |
|  | [NORMAL] Holiday Schedule Reminder                   | |
|  | Jan 28, 2026                              [Read]     | |
|  |                                                      | |
|  | Classes will be suspended from Feb 10-12...          | |
|  +------------------------------------------------------+ |
+----------------------------------------------------------+
```

---

## Technical Details

### Status Color Coding

**Task Status**:
- pending: Yellow/Warning
- in_progress: Blue/Info
- completed: Green/Success

**Complaint/Suggestion Status**:
- open: Blue (info)
- under_review: Yellow (warning)
- resolved: Green (success)
- closed: Gray (muted)

**Announcement Priority**:
- normal: Default styling
- high: Orange/warning background
- urgent: Red/destructive background

### Data Queries

**Tasks Query**:
```text
SELECT * FROM tasks
WHERE teacher_id = current_teacher_id
ORDER BY 
  CASE WHEN status = 'pending' THEN 0
       WHEN status = 'in_progress' THEN 1
       ELSE 2 END,
  due_date ASC NULLS LAST
```

**Announcements Query**:
```text
SELECT announcements.*, 
       EXISTS(SELECT 1 FROM announcement_reads 
              WHERE announcement_id = announcements.id 
              AND user_id = current_user_id) as is_read
FROM announcements
WHERE is_active = true
  AND (target_role IS NULL OR target_role = 'teacher')
  AND (expires_at IS NULL OR expires_at > now())
ORDER BY priority DESC, published_at DESC
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No tasks found | Show "No tasks" empty state |
| Failed to submit complaint | Show error toast, keep dialog open |
| No announcements | Show "No announcements" message |
| File upload fails | Show error with retry option |
| Network error | Show retry button |

---

## Mobile Responsiveness

- **Desktop**: Full layouts with sidebars
- **Tablet**: Condensed cards, collapsible filters
- **Mobile**: Stack layout, drawer for filters/forms

---

## Implementation Order

1. **useTasks hook** - Task data fetching and mutations
2. **Tasks page** - Main task management (highest priority)
3. **useAnnouncements hook** - Announcement fetching
4. **Announcements page** - View announcements
5. **useCommunication hook** - Complaints, suggestions, feedback
6. **Complaints page** - Submit and track complaints
7. **Suggestions page** - Submit suggestions
8. **Feedback page** - View feedback
9. **Improvement page** - Improvement tracking
10. **useDocuments hook** - Rules and instructions
11. **Rules page** - Academy policies
12. **Instructions page** - How-to guides
13. **Update App.tsx** - New routes
14. **Clean up placeholders.tsx** - Remove replaced exports

---

## Outcome

After implementation:
- Teachers can manage all their tasks in one place
- Easy complaint submission with attachment support
- Suggestion sharing for academy improvement
- View and respond to feedback
- Stay updated with announcements
- Track improvement items with evidence
- Access academy rules and guides
- Mobile-friendly design for all pages
- Consistent UI patterns across all communication features

