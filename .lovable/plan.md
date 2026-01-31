

# Phase 3: Dashboard & Today Classes - Enhancement Plan

## Current Status
Dashboard and Today Classes pages have basic functionality. This phase focuses on adding real-time updates, quick notes, and polished call flow.

---

## Enhancements to Implement

### 1. Real-time Updates for Dashboard
Add Supabase Realtime subscriptions to update dashboard stats and next class automatically.

**Changes:**
- Subscribe to classes table changes
- Auto-refresh stats when class status changes
- Show live "In Progress" indicator

---

### 2. Quick Notes Drawer
Add a slide-out drawer to quickly add notes to a class without leaving the page.

**New file:**
- `src/components/classes/QuickNotesDrawer.tsx`

---

### 3. Improved Call Flow
Enhance the calling experience with proper timeout and retry logic.

**Changes:**
- 40-second timeout with visual countdown
- Proper "No Answer" marking after timeout
- Retry button with rate limiting (max 3 retries per class)
- Call status logging to call_logs table

---

### 4. Today Classes Enhancements
- Add "Notes" button that opens quick notes drawer
- Better mobile responsiveness for action buttons
- Show time until next class
- Color-coded time indicators (upcoming, current, past)

---

## Technical Implementation

### Real-time Subscription Pattern
```typescript
const channel = supabase
  .channel('classes-changes')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'classes',
    filter: `teacher_id=eq.${teacherId}`
  }, () => refetch())
  .subscribe();
```

### Call Flow State Machine
```
IDLE → CALLING (40s timer) → [CONNECTED | NO_ANSWER | FAILED]
                           ↓
                    Can retry (max 3x)
```

---

## Files to Create/Modify

| File | Change |
|------|--------|
| `src/components/classes/QuickNotesDrawer.tsx` | New - Notes drawer component |
| `src/components/classes/CallButton.tsx` | New - Reusable call button with state |
| `src/pages/Dashboard.tsx` | Add realtime subscription |
| `src/pages/TodayClasses.tsx` | Add notes drawer, improve call flow |

---

## Outcome
- Dashboard updates in real-time when class status changes
- Teachers can quickly add notes to any class
- Professional call flow with timeout and retry
- Better mobile experience on Today Classes
