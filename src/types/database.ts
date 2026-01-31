// Type definitions for the Teacher Dashboard
// These mirror the database schema and are used throughout the app

export type ClassStatus = 'scheduled' | 'in_progress' | 'completed' | 'missed' | 'no_answer' | 'cancelled';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave' | 'no_answer';
export type CallEvent = 'initiated' | 'ringing' | 'accepted' | 'rejected' | 'failed' | 'connected' | 'disconnected' | 'timeout';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type ComplaintStatus = 'open' | 'under_review' | 'resolved' | 'closed';
export type AppRole = 'admin' | 'teacher' | 'student';
export type NotificationType = 'class_reminder' | 'admin_message' | 'task_assignment' | 'announcement' | 'feedback' | 'system';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  country: string | null;
  language_pref: string;
  created_at: string;
  updated_at: string;
}

export interface Teacher {
  id: string;
  user_id: string;
  profile_id: string | null;
  employee_id: string | null;
  salary_base: number;
  status: string;
  specializations: string[] | null;
  bio: string | null;
  teaching_hours_per_week: number;
  hire_date: string;
  created_at: string;
  updated_at: string;
  // Joined data
  profile?: Profile;
}

export interface Student {
  id: string;
  user_id: string | null;
  teacher_id: string | null;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  country: string | null;
  country_code: string | null;
  language_pref: string;
  course_level: string;
  duration_minutes: number;
  schedule_days: string[] | null;
  schedule_time: string | null;
  timezone: string;
  progress_percentage: number;
  current_surah: string | null;
  current_juzz: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  teacher_id: string;
  student_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number;
  status: ClassStatus;
  call_room_id: string | null;
  call_room_url: string | null;
  is_recovery: boolean;
  recovery_for_class_id: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  notes: string | null;
  lesson_added: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  student?: Student;
  teacher?: Teacher;
}

export interface Lesson {
  id: string;
  class_id: string | null;
  teacher_id: string;
  student_id: string;
  course_level: string | null;
  quran_subject: string | null;
  surah: string | null;
  juzz: number | null;
  page_from: number | null;
  page_to: number | null;
  ayah_from: number | null;
  ayah_to: number | null;
  memorization_surah: string | null;
  memorization_ayah_from: number | null;
  memorization_ayah_to: number | null;
  fundamental_islam: string | null;
  ethics: string | null;
  comments: string | null;
  method: string | null;
  quran_completed: boolean;
  rating_concentration: number | null;
  rating_revision: number | null;
  rating_progress: number | null;
  images: string[] | null;
  is_quick_lesson: boolean;
  created_at: string;
  updated_at: string;
  // Joined data
  student?: Student;
  class?: Class;
}

export interface Attendance {
  id: string;
  class_id: string;
  teacher_id: string;
  student_id: string;
  status: AttendanceStatus;
  note: string | null;
  recorded_at: string;
  updated_by: string | null;
  created_at: string;
  // Joined data
  student?: Student;
  class?: Class;
}

export interface CallLog {
  id: string;
  class_id: string;
  teacher_id: string;
  student_id: string;
  event: CallEvent;
  room_id: string | null;
  room_url: string | null;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface SalaryRecord {
  id: string;
  teacher_id: string;
  month: string;
  base_salary: number;
  classes_count: number;
  bonus: number;
  total_deductions: number;
  net_salary: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  deductions?: Deduction[];
}

export interface Deduction {
  id: string;
  salary_record_id: string | null;
  teacher_id: string;
  reason: string;
  amount: number;
  deduction_date: string;
  review_requested: boolean;
  review_status: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface ExaminerRemark {
  id: string;
  student_id: string;
  lesson_id: string | null;
  teacher_id: string | null;
  examiner_id: string | null;
  remarks_text: string;
  tags: string[] | null;
  teacher_response: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  student?: Student;
  lesson?: Lesson;
}

export interface Task {
  id: string;
  teacher_id: string;
  assigned_by: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  is_personal: boolean;
  proof_url: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  teacher_id: string;
  student_id: string | null;
  class_id: string | null;
  title: string;
  description: string | null;
  remind_at: string;
  repeat_type: string | null;
  is_completed: boolean;
  created_at: string;
  // Joined data
  student?: Student;
  class?: Class;
}

export interface Complaint {
  id: string;
  teacher_id: string;
  subject: string;
  description: string;
  attachments: string[] | null;
  status: ComplaintStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface Suggestion {
  id: string;
  teacher_id: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  admin_response: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  teacher_id: string;
  from_user_id: string | null;
  from_type: string | null;
  subject: string | null;
  message: string;
  rating: number | null;
  teacher_response: string | null;
  created_at: string;
}

export interface Improvement {
  id: string;
  teacher_id: string;
  examiner_id: string | null;
  title: string;
  description: string;
  required_action: string | null;
  is_completed: boolean;
  evidence_url: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  target_role: AppRole | null;
  is_active: boolean;
  published_at: string;
  expires_at: string | null;
  created_by: string | null;
  created_at: string;
  // Computed
  is_read?: boolean;
}

export interface RulesDocument {
  id: string;
  title: string;
  content: string | null;
  pdf_url: string | null;
  category: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Instruction {
  id: string;
  title: string;
  content: string | null;
  video_url: string | null;
  category: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Dashboard aggregated data types
export interface DashboardStats {
  todayClassesCount: number;
  completedThisWeek: number;
  averageRating: number;
  pendingTasks: number;
  missedClassesCount: number;
}

export interface TodayClass extends Class {
  student: Student;
}
