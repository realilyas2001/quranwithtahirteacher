

# Phase 5: Quick Lesson Flow

## Overview

Build a streamlined lesson recording system that allows teachers to quickly document class sessions. The form will be pre-populated with class data and offer both a "Quick Mode" (minimal fields) and "Full Mode" (comprehensive).

---

## User Flow

```text
Video call ends
        |
        v
Redirect to /lessons/add?classId=xxx
        |
        v
AddLesson page loads with:
  - Student info pre-filled
  - Class details loaded
  - Quick mode by default
        |
        v
Teacher fills in:
  - Quran subject (Tilawah, Tajweed, Hifz)
  - Surah/Juzz/Ayah progress
  - Quick ratings (1-5 stars)
  - Optional comments
        |
        v
Save → Mark class as lesson_added = true
        |
        v
Redirect to Dashboard/Today Classes
```

---

## Components to Create

### 1. AddLesson Page (Replace Placeholder)

**File**: `src/pages/lessons/AddLesson.tsx`

**Features**:
- Reads `classId` from URL query params
- Pre-loads class and student data
- Two modes toggle: Quick Mode / Full Mode
- Form validation with react-hook-form + zod
- Auto-saves draft locally (optional)

**Quick Mode Fields** (minimal - for fast entry):
- Quran subject dropdown
- Surah selection
- Ayah range (from - to)
- Star ratings (3 categories)
- Comments textarea

**Full Mode Fields** (comprehensive):
- All Quick Mode fields plus:
- Juzz number
- Page range
- Memorization details (surah, ayah range)
- Fundamental Islam topic
- Ethics topic
- Teaching method
- Image attachments

---

### 2. Surah Selector Component

**File**: `src/components/lessons/SurahSelector.tsx`

**Features**:
- Combobox with search for all 114 surahs
- Shows surah number and name
- Arabic + English names
- Recently used surahs at top

---

### 3. Star Rating Component

**File**: `src/components/lessons/StarRating.tsx`

**Features**:
- Interactive 5-star rating
- Labels: Concentration, Revision, Progress
- Touch-friendly for mobile

---

### 4. Lesson Form Hook

**File**: `src/hooks/useLessonForm.ts`

**Purpose**: Manage form state and submission

**Features**:
- Form validation schema
- Submit mutation to lessons table
- Update class `lesson_added` flag
- Optimistic updates

---

## Data Structures

### Quran Subject Options
```text
- Tilawah (Reading)
- Tajweed (Pronunciation Rules)
- Hifz (Memorization)
- Revision
- Arabic Language
- Islamic Studies
```

### Surah List
- All 114 surahs with Arabic and English names
- Stored as constants file for offline access

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/pages/lessons/AddLesson.tsx` | Main lesson form page |
| `src/components/lessons/SurahSelector.tsx` | Searchable surah dropdown |
| `src/components/lessons/StarRating.tsx` | Rating input component |
| `src/hooks/useLessonForm.ts` | Form logic and submission |
| `src/lib/quran-data.ts` | Surah names and metadata |

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/pages/placeholders.tsx` | Remove AddLesson export |
| `src/App.tsx` | Update route to new component |

---

## Form Validation Schema

```text
Required fields (Quick Mode):
- quran_subject (dropdown)
- surah (from surah selector)
- ayah_from (number, 1-286)
- ayah_to (number, >= ayah_from)

Optional but encouraged:
- rating_concentration (1-5)
- rating_revision (1-5)
- rating_progress (1-5)
- comments (text)

Full Mode additions:
- juzz (1-30)
- page_from (1-604)
- page_to (>= page_from)
- memorization fields
- fundamental_islam
- ethics
- method
```

---

## UI Layout

### Quick Mode (Default)
```text
┌─────────────────────────────────────────────────┐
│  Add Lesson                          [Full Mode]│
├─────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────┐  │
│  │  Ahmed Hassan • Tajweed Intermediate      │  │
│  │  Class: Jan 31, 2026 • 10:00 AM           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Subject ─────────────────────────────────────  │
│  [Tajweed                              ▼]       │
│                                                 │
│  Surah ───────────────────────────────────────  │
│  [Al-Baqarah (2)                       ▼]       │
│                                                 │
│  Ayah Range ──────────────────────────────────  │
│  From: [142]     To: [150]                      │
│                                                 │
│  Ratings ─────────────────────────────────────  │
│  Concentration  ★★★★☆                           │
│  Revision       ★★★★★                           │
│  Progress       ★★★☆☆                           │
│                                                 │
│  Comments ────────────────────────────────────  │
│  [                                         ]    │
│  [                                         ]    │
│                                                 │
│         [Cancel]              [Save Lesson]     │
└─────────────────────────────────────────────────┘
```

### Full Mode (Expandable)
- Shows additional collapsible sections:
  - Page Range
  - Memorization Details
  - Islamic Studies
  - Teaching Method
  - Attachments

---

## Database Operations

### On Form Submit
```text
1. INSERT into lessons table with all form data
2. UPDATE classes SET lesson_added = true WHERE id = class_id
3. UPDATE students SET current_surah, current_juzz (optional)
4. INVALIDATE queries for today-classes and lessons
```

---

## Technical Details

### Pre-filled Data from Class
When navigating from a completed call:
- student_id from class
- class_id from URL
- teacher_id from auth context
- course_level from student record

### Surah Data Structure
```javascript
{
  number: 1,
  name: "Al-Fatihah",
  arabicName: "الفاتحة",
  ayahCount: 7,
  juzz: 1
}
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| No classId in URL | Show student selector instead |
| Invalid classId | Redirect to today-classes |
| Lesson already added | Show warning, allow edit |
| Network error | Save locally, retry |
| Form validation | Show inline errors |

---

## Outcome

After implementation:
- Teachers can record lessons in under 30 seconds (Quick Mode)
- All lesson data properly tracked in database
- Classes automatically marked as having lessons added
- Seamless flow from video call to lesson entry
- Full audit trail of student progress

