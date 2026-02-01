import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { ConnectionRequest, Teacher, Profile } from '@/types/database';

interface TeacherWithProfile extends Teacher {
  profile: Profile;
}

export function useStudentConnection() {
  const { student, isParent, activeChild, refreshProfile } = useAuth();
  const queryClient = useQueryClient();
  const displayStudent = isParent && activeChild ? activeChild : student;
  const studentId = displayStudent?.id;

  // Fetch connection requests for the student
  const { data: connectionRequests = [], isLoading: requestsLoading } = useQuery({
    queryKey: ['student-connection-requests', studentId],
    queryFn: async () => {
      if (!studentId) return [];

      const { data, error } = await supabase
        .from('connection_requests')
        .select(`
          *,
          teacher:teachers(
            id,
            bio,
            specializations,
            teaching_hours_per_week,
            profile:profiles(full_name, avatar_url, email)
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (ConnectionRequest & { teacher: TeacherWithProfile })[];
    },
    enabled: !!studentId,
  });

  // Fetch connected teacher details
  const { data: connectedTeacher, isLoading: teacherLoading } = useQuery({
    queryKey: ['connected-teacher', displayStudent?.teacher_id],
    queryFn: async () => {
      if (!displayStudent?.teacher_id) return null;

      const { data, error } = await supabase
        .from('teachers')
        .select(`
          id,
          bio,
          specializations,
          teaching_hours_per_week,
          profile:profiles(full_name, avatar_url, email)
        `)
        .eq('id', displayStudent.teacher_id)
        .single();

      if (error) throw error;
      return data as TeacherWithProfile;
    },
    enabled: !!displayStudent?.teacher_id,
  });

  // Fetch reschedule requests
  const { data: rescheduleRequests = [], isLoading: rescheduleLoading } = useQuery({
    queryKey: ['student-reschedule-requests', studentId],
    queryFn: async () => {
      if (!studentId) return [];

      const { data, error } = await supabase
        .from('reschedule_requests')
        .select(`
          *,
          class:classes(scheduled_date, start_time, duration_minutes)
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!studentId,
  });

  // Cancel pending connection request
  const cancelRequest = useMutation({
    mutationFn: async (requestId: string) => {
      const { error } = await supabase
        .from('connection_requests')
        .delete()
        .eq('id', requestId)
        .eq('student_id', studentId)
        .eq('status', 'pending');

      if (error) throw error;
      return requestId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-connection-requests'] });
      toast.success('Connection request cancelled');
    },
    onError: (error) => {
      console.error('Error cancelling request:', error);
      toast.error('Failed to cancel request');
    },
  });

  // Get current pending request
  const pendingRequest = connectionRequests.find(r => r.status === 'pending');
  const hasConnectedTeacher = !!displayStudent?.teacher_id;

  return {
    connectionRequests,
    rescheduleRequests,
    connectedTeacher,
    pendingRequest,
    hasConnectedTeacher,
    isLoading: requestsLoading || teacherLoading || rescheduleLoading,
    cancelRequest,
    refreshProfile,
  };
}
