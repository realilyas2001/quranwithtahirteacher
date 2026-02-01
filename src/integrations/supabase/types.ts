export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcement_reads: {
        Row: {
          announcement_id: string
          id: string
          read_at: string
          user_id: string
        }
        Insert: {
          announcement_id: string
          id?: string
          read_at?: string
          user_id: string
        }
        Update: {
          announcement_id?: string
          id?: string
          read_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_reads_announcement_id_fkey"
            columns: ["announcement_id"]
            isOneToOne: false
            referencedRelation: "announcements"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          priority: string | null
          published_at: string | null
          target_role: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          published_at?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: string | null
          published_at?: string | null
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          class_id: string
          created_at: string
          id: string
          note: string | null
          recorded_at: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          teacher_id: string
          updated_by: string | null
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          note?: string | null
          recorded_at?: string
          status: Database["public"]["Enums"]["attendance_status"]
          student_id: string
          teacher_id: string
          updated_by?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          note?: string | null
          recorded_at?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          student_id?: string
          teacher_id?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      call_logs: {
        Row: {
          class_id: string
          event: Database["public"]["Enums"]["call_event"]
          id: string
          metadata: Json | null
          room_id: string | null
          room_url: string | null
          student_id: string
          teacher_id: string
          timestamp: string
        }
        Insert: {
          class_id: string
          event: Database["public"]["Enums"]["call_event"]
          id?: string
          metadata?: Json | null
          room_id?: string | null
          room_url?: string | null
          student_id: string
          teacher_id: string
          timestamp?: string
        }
        Update: {
          class_id?: string
          event?: Database["public"]["Enums"]["call_event"]
          id?: string
          metadata?: Json | null
          room_id?: string | null
          room_url?: string | null
          student_id?: string
          teacher_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          actual_end_time: string | null
          actual_start_time: string | null
          call_room_id: string | null
          call_room_url: string | null
          created_at: string
          duration_minutes: number | null
          end_time: string | null
          id: string
          is_recovery: boolean | null
          lesson_added: boolean | null
          notes: string | null
          recovery_for_class_id: string | null
          scheduled_date: string
          start_time: string
          status: Database["public"]["Enums"]["class_status"] | null
          student_id: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          call_room_id?: string | null
          call_room_url?: string | null
          created_at?: string
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          is_recovery?: boolean | null
          lesson_added?: boolean | null
          notes?: string | null
          recovery_for_class_id?: string | null
          scheduled_date: string
          start_time: string
          status?: Database["public"]["Enums"]["class_status"] | null
          student_id: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          actual_end_time?: string | null
          actual_start_time?: string | null
          call_room_id?: string | null
          call_room_url?: string | null
          created_at?: string
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          is_recovery?: boolean | null
          lesson_added?: boolean | null
          notes?: string | null
          recovery_for_class_id?: string | null
          scheduled_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["class_status"] | null
          student_id?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_recovery_for_class_id_fkey"
            columns: ["recovery_for_class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          admin_response: string | null
          attachments: string[] | null
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["complaint_status"] | null
          subject: string
          teacher_id: string
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          attachments?: string[] | null
          created_at?: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          subject: string
          teacher_id: string
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          attachments?: string[] | null
          created_at?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          subject?: string
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaints_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      connection_requests: {
        Row: {
          created_at: string
          id: string
          message: string | null
          responded_at: string | null
          status: Database["public"]["Enums"]["connection_status"]
          student_id: string
          teacher_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["connection_status"]
          student_id: string
          teacher_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          responded_at?: string | null
          status?: Database["public"]["Enums"]["connection_status"]
          student_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "connection_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "connection_requests_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      deductions: {
        Row: {
          amount: number
          created_at: string
          deduction_date: string
          id: string
          reason: string
          review_requested: boolean | null
          review_status: string | null
          salary_record_id: string | null
          teacher_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          deduction_date?: string
          id?: string
          reason: string
          review_requested?: boolean | null
          review_status?: string | null
          salary_record_id?: string | null
          teacher_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          deduction_date?: string
          id?: string
          reason?: string
          review_requested?: boolean | null
          review_status?: string | null
          salary_record_id?: string | null
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "deductions_salary_record_id_fkey"
            columns: ["salary_record_id"]
            isOneToOne: false
            referencedRelation: "salary_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deductions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deductions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      examiner_remarks: {
        Row: {
          created_at: string
          examiner_id: string | null
          id: string
          lesson_id: string | null
          remarks_text: string
          student_id: string
          tags: string[] | null
          teacher_id: string | null
          teacher_response: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          examiner_id?: string | null
          id?: string
          lesson_id?: string | null
          remarks_text: string
          student_id: string
          tags?: string[] | null
          teacher_id?: string | null
          teacher_response?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          examiner_id?: string | null
          id?: string
          lesson_id?: string | null
          remarks_text?: string
          student_id?: string
          tags?: string[] | null
          teacher_id?: string | null
          teacher_response?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "examiner_remarks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "examiner_remarks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "examiner_remarks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "examiner_remarks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          from_type: string | null
          from_user_id: string | null
          id: string
          message: string
          rating: number | null
          subject: string | null
          teacher_id: string
          teacher_response: string | null
        }
        Insert: {
          created_at?: string
          from_type?: string | null
          from_user_id?: string | null
          id?: string
          message: string
          rating?: number | null
          subject?: string | null
          teacher_id: string
          teacher_response?: string | null
        }
        Update: {
          created_at?: string
          from_type?: string | null
          from_user_id?: string | null
          id?: string
          message?: string
          rating?: number | null
          subject?: string | null
          teacher_id?: string
          teacher_response?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      improvements: {
        Row: {
          completed_at: string | null
          created_at: string
          description: string
          evidence_url: string | null
          examiner_id: string | null
          id: string
          is_completed: boolean | null
          required_action: string | null
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          description: string
          evidence_url?: string | null
          examiner_id?: string | null
          id?: string
          is_completed?: boolean | null
          required_action?: string | null
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          description?: string
          evidence_url?: string | null
          examiner_id?: string | null
          id?: string
          is_completed?: boolean | null
          required_action?: string | null
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "improvements_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "improvements_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      instructions: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_active: boolean | null
          order_index: number | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          order_index?: number | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      lessons: {
        Row: {
          ayah_from: number | null
          ayah_to: number | null
          class_id: string | null
          comments: string | null
          course_level: string | null
          created_at: string
          ethics: string | null
          fundamental_islam: string | null
          id: string
          images: string[] | null
          is_quick_lesson: boolean | null
          juzz: number | null
          memorization_ayah_from: number | null
          memorization_ayah_to: number | null
          memorization_surah: string | null
          method: string | null
          page_from: number | null
          page_to: number | null
          quran_completed: boolean | null
          quran_subject: string | null
          rating_concentration: number | null
          rating_progress: number | null
          rating_revision: number | null
          student_id: string
          surah: string | null
          teacher_id: string
          updated_at: string
        }
        Insert: {
          ayah_from?: number | null
          ayah_to?: number | null
          class_id?: string | null
          comments?: string | null
          course_level?: string | null
          created_at?: string
          ethics?: string | null
          fundamental_islam?: string | null
          id?: string
          images?: string[] | null
          is_quick_lesson?: boolean | null
          juzz?: number | null
          memorization_ayah_from?: number | null
          memorization_ayah_to?: number | null
          memorization_surah?: string | null
          method?: string | null
          page_from?: number | null
          page_to?: number | null
          quran_completed?: boolean | null
          quran_subject?: string | null
          rating_concentration?: number | null
          rating_progress?: number | null
          rating_revision?: number | null
          student_id: string
          surah?: string | null
          teacher_id: string
          updated_at?: string
        }
        Update: {
          ayah_from?: number | null
          ayah_to?: number | null
          class_id?: string | null
          comments?: string | null
          course_level?: string | null
          created_at?: string
          ethics?: string | null
          fundamental_islam?: string | null
          id?: string
          images?: string[] | null
          is_quick_lesson?: boolean | null
          juzz?: number | null
          memorization_ayah_from?: number | null
          memorization_ayah_to?: number | null
          memorization_surah?: string | null
          method?: string | null
          page_from?: number | null
          page_to?: number | null
          quran_completed?: boolean | null
          quran_subject?: string | null
          rating_concentration?: number | null
          rating_progress?: number | null
          rating_revision?: number | null
          student_id?: string
          surah?: string | null
          teacher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lessons_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          payload: Json | null
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          payload?: Json | null
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          payload?: Json | null
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          country: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          language_pref: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          language_pref?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          language_pref?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reminders: {
        Row: {
          class_id: string | null
          created_at: string
          description: string | null
          id: string
          is_completed: boolean | null
          remind_at: string
          repeat_type: string | null
          student_id: string | null
          teacher_id: string
          title: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          remind_at: string
          repeat_type?: string | null
          student_id?: string | null
          teacher_id: string
          title: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          remind_at?: string
          repeat_type?: string | null
          student_id?: string | null
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminders_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      reschedule_requests: {
        Row: {
          class_id: string
          created_at: string
          id: string
          preferred_times: Json
          reason: string | null
          responded_at: string | null
          status: string
          student_id: string
        }
        Insert: {
          class_id: string
          created_at?: string
          id?: string
          preferred_times: Json
          reason?: string | null
          responded_at?: string | null
          status?: string
          student_id: string
        }
        Update: {
          class_id?: string
          created_at?: string
          id?: string
          preferred_times?: Json
          reason?: string | null
          responded_at?: string | null
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reschedule_requests_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reschedule_requests_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      rules_documents: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          id: string
          is_active: boolean | null
          pdf_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          pdf_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          pdf_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      salary_records: {
        Row: {
          base_salary: number
          bonus: number | null
          classes_count: number | null
          created_at: string
          id: string
          month: string
          net_salary: number | null
          notes: string | null
          status: string | null
          teacher_id: string
          total_deductions: number | null
          updated_at: string
        }
        Insert: {
          base_salary?: number
          bonus?: number | null
          classes_count?: number | null
          created_at?: string
          id?: string
          month: string
          net_salary?: number | null
          notes?: string | null
          status?: string | null
          teacher_id: string
          total_deductions?: number | null
          updated_at?: string
        }
        Update: {
          base_salary?: number
          bonus?: number | null
          classes_count?: number | null
          created_at?: string
          id?: string
          month?: string
          net_salary?: number | null
          notes?: string | null
          status?: string | null
          teacher_id?: string
          total_deductions?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salary_records_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_records_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      student_feedback: {
        Row: {
          class_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number | null
          student_id: string
        }
        Insert: {
          class_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          student_id: string
        }
        Update: {
          class_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_feedback_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_feedback_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_settings: {
        Row: {
          accessibility_mode: string | null
          created_at: string
          id: string
          low_bandwidth_mode: boolean | null
          notification_prefs: Json | null
          student_id: string
          timezone: string | null
          updated_at: string
          video_pref: boolean | null
        }
        Insert: {
          accessibility_mode?: string | null
          created_at?: string
          id?: string
          low_bandwidth_mode?: boolean | null
          notification_prefs?: Json | null
          student_id: string
          timezone?: string | null
          updated_at?: string
          video_pref?: boolean | null
        }
        Update: {
          accessibility_mode?: string | null
          created_at?: string
          id?: string
          low_bandwidth_mode?: boolean | null
          notification_prefs?: Json | null
          student_id?: string
          timezone?: string | null
          updated_at?: string
          video_pref?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "student_settings_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          accessibility_mode: string | null
          avatar_url: string | null
          country: string | null
          country_code: string | null
          course_level: string | null
          created_at: string
          current_juzz: number | null
          current_surah: string | null
          duration_minutes: number | null
          email: string | null
          full_name: string
          id: string
          is_parent_account: boolean | null
          language_pref: string | null
          notes: string | null
          parent_id: string | null
          phone: string | null
          progress_percentage: number | null
          schedule_days: string[] | null
          schedule_time: string | null
          status: string | null
          teacher_id: string | null
          timezone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accessibility_mode?: string | null
          avatar_url?: string | null
          country?: string | null
          country_code?: string | null
          course_level?: string | null
          created_at?: string
          current_juzz?: number | null
          current_surah?: string | null
          duration_minutes?: number | null
          email?: string | null
          full_name: string
          id?: string
          is_parent_account?: boolean | null
          language_pref?: string | null
          notes?: string | null
          parent_id?: string | null
          phone?: string | null
          progress_percentage?: number | null
          schedule_days?: string[] | null
          schedule_time?: string | null
          status?: string | null
          teacher_id?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accessibility_mode?: string | null
          avatar_url?: string | null
          country?: string | null
          country_code?: string | null
          course_level?: string | null
          created_at?: string
          current_juzz?: number | null
          current_surah?: string | null
          duration_minutes?: number | null
          email?: string | null
          full_name?: string
          id?: string
          is_parent_account?: boolean | null
          language_pref?: string | null
          notes?: string | null
          parent_id?: string | null
          phone?: string | null
          progress_percentage?: number | null
          schedule_days?: string[] | null
          schedule_time?: string | null
          status?: string | null
          teacher_id?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          admin_response: string | null
          created_at: string
          description: string
          id: string
          status: Database["public"]["Enums"]["complaint_status"] | null
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          description: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          description?: string
          id?: string
          status?: Database["public"]["Enums"]["complaint_status"] | null
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_by: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          is_personal: boolean | null
          proof_url: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          teacher_id: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_personal?: boolean | null
          proof_url?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          teacher_id: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_by?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          is_personal?: boolean | null
          proof_url?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          teacher_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers_public"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          bio: string | null
          created_at: string
          employee_id: string | null
          hire_date: string | null
          id: string
          profile_id: string | null
          salary_base: number | null
          specializations: string[] | null
          status: string | null
          teaching_hours_per_week: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          profile_id?: string | null
          salary_base?: number | null
          specializations?: string[] | null
          status?: string | null
          teaching_hours_per_week?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          employee_id?: string | null
          hire_date?: string | null
          id?: string
          profile_id?: string | null
          salary_base?: number | null
          specializations?: string[] | null
          status?: string | null
          teaching_hours_per_week?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teachers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      teachers_public: {
        Row: {
          avatar_url: string | null
          bio: string | null
          full_name: string | null
          id: string | null
          specializations: string[] | null
          status: string | null
          teaching_hours_per_week: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_student_id: { Args: { _user_id: string }; Returns: string }
      get_teacher_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student"
      attendance_status: "present" | "absent" | "late" | "leave" | "no_answer"
      call_event:
        | "initiated"
        | "ringing"
        | "accepted"
        | "rejected"
        | "failed"
        | "connected"
        | "disconnected"
        | "timeout"
      class_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "missed"
        | "no_answer"
        | "cancelled"
      complaint_status: "open" | "under_review" | "resolved" | "closed"
      connection_status: "pending" | "accepted" | "rejected"
      notification_type:
        | "class_reminder"
        | "admin_message"
        | "task_assignment"
        | "announcement"
        | "feedback"
        | "system"
      task_status: "pending" | "in_progress" | "completed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "student"],
      attendance_status: ["present", "absent", "late", "leave", "no_answer"],
      call_event: [
        "initiated",
        "ringing",
        "accepted",
        "rejected",
        "failed",
        "connected",
        "disconnected",
        "timeout",
      ],
      class_status: [
        "scheduled",
        "in_progress",
        "completed",
        "missed",
        "no_answer",
        "cancelled",
      ],
      complaint_status: ["open", "under_review", "resolved", "closed"],
      connection_status: ["pending", "accepted", "rejected"],
      notification_type: [
        "class_reminder",
        "admin_message",
        "task_assignment",
        "announcement",
        "feedback",
        "system",
      ],
      task_status: ["pending", "in_progress", "completed"],
    },
  },
} as const
