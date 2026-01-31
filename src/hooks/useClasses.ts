import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type ClassStatus = Database['public']['Enums']['class_status'];

export interface ClassFilters {
  tab: 'all' | 'upcoming' | 'past' | 'recovery';
  studentId?: string;
  status?: ClassStatus[];
  startDate?: Date;
  endDate?: Date;
}

export interface ClassWithStudent {
  id: string;
  teacher_id: string;
  student_id: string;
  scheduled_date: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  status: ClassStatus | null;
  call_room_id: string | null;
  call_room_url: string | null;
  is_recovery: boolean | null;
  recovery_for_class_id: string | null;
  actual_start_time: string | null;
  actual_end_time: string | null;
  notes: string | null;
  lesson_added: boolean | null;
  created_at: string;
  updated_at: string;
  student: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    country: string | null;
    country_code: string | null;
    course_level: string | null;
  } | null;
}

export function useClasses(filters: ClassFilters) {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const today = format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['classes', teacherId, filters],
    queryFn: async () => {
      if (!teacherId) return [];

      let query = supabase
        .from('classes')
        .select(`
          *,
          student:students(id, full_name, avatar_url, country, country_code, course_level)
        `)
        .eq('teacher_id', teacherId)
        .order('scheduled_date', { ascending: false })
        .order('start_time', { ascending: false });

      // Apply tab filters
      if (filters.tab === 'upcoming') {
        query = query.gte('scheduled_date', today);
      } else if (filters.tab === 'past') {
        query = query.lt('scheduled_date', today);
      } else if (filters.tab === 'recovery') {
        query = query.eq('is_recovery', true);
      }

      // Apply date range filter
      if (filters.startDate) {
        query = query.gte('scheduled_date', format(filters.startDate, 'yyyy-MM-dd'));
      }
      if (filters.endDate) {
        query = query.lte('scheduled_date', format(filters.endDate, 'yyyy-MM-dd'));
      }

      // Apply student filter
      if (filters.studentId) {
        query = query.eq('student_id', filters.studentId);
      }

      // Apply status filter
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as ClassWithStudent[];
    },
    enabled: !!teacherId,
  });
}

export function useWeeklyClasses(weekStart: Date) {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const start = format(startOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  const end = format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['weekly-classes', teacherId, start, end],
    queryFn: async () => {
      if (!teacherId) return [];

      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          student:students(id, full_name, avatar_url, country, country_code, course_level)
        `)
        .eq('teacher_id', teacherId)
        .gte('scheduled_date', start)
        .lte('scheduled_date', end)
        .order('scheduled_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;
      return data as ClassWithStudent[];
    },
    enabled: !!teacherId,
  });
}

export function useClassById(classId: string | undefined) {
  return useQuery({
    queryKey: ['class', classId],
    queryFn: async () => {
      if (!classId) return null;

      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          student:students(id, full_name, avatar_url, country, country_code, course_level)
        `)
        .eq('id', classId)
        .maybeSingle();

      if (error) throw error;
      return data as ClassWithStudent | null;
    },
    enabled: !!classId,
  });
}

export function useCreateRecoveryClass() {
  const queryClient = useQueryClient();
  const { teacher } = useAuth();
  const teacherId = teacher?.id;

  return useMutation({
    mutationFn: async ({
      originalClassId,
      studentId,
      scheduledDate,
      startTime,
      durationMinutes,
      notes,
    }: {
      originalClassId: string;
      studentId: string;
      scheduledDate: string;
      startTime: string;
      durationMinutes: number;
      notes?: string;
    }) => {
      if (!teacherId) throw new Error('No teacher ID');

      const { data, error } = await supabase
        .from('classes')
        .insert({
          teacher_id: teacherId,
          student_id: studentId,
          scheduled_date: scheduledDate,
          start_time: startTime,
          duration_minutes: durationMinutes,
          status: 'scheduled' as ClassStatus,
          is_recovery: true,
          recovery_for_class_id: originalClassId,
          notes: notes || `Recovery class for missed session`,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-classes'] });
      toast.success('Recovery class scheduled successfully');
    },
    onError: (error) => {
      toast.error('Failed to schedule recovery class');
      console.error('Recovery class error:', error);
    },
  });
}

export function useUpdateClassStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      classId,
      status,
    }: {
      classId: string;
      status: ClassStatus;
    }) => {
      const { data, error } = await supabase
        .from('classes')
        .update({ status })
        .eq('id', classId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-classes'] });
      toast.success('Class status updated');
    },
    onError: (error) => {
      toast.error('Failed to update class status');
      console.error('Update status error:', error);
    },
  });
}

export function useClassStats() {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const today = format(new Date(), 'yyyy-MM-dd');

  return useQuery({
    queryKey: ['class-stats', teacherId],
    queryFn: async () => {
      if (!teacherId) return { total: 0, upcoming: 0, completed: 0, missed: 0 };

      const { data, error } = await supabase
        .from('classes')
        .select('status, scheduled_date')
        .eq('teacher_id', teacherId);

      if (error) throw error;

      const stats = {
        total: data.length,
        upcoming: data.filter(c => c.scheduled_date >= today && c.status === 'scheduled').length,
        completed: data.filter(c => c.status === 'completed').length,
        missed: data.filter(c => c.status === 'missed' || c.status === 'no_answer').length,
      };

      return stats;
    },
    enabled: !!teacherId,
  });
}
