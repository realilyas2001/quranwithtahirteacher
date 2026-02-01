import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Complaint = Tables<'complaints'>;
type Suggestion = Tables<'suggestions'>;
type Feedback = Tables<'feedback'>;
type Improvement = Tables<'improvements'>;

// ============ COMPLAINTS ============
export function useComplaints() {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const queryClient = useQueryClient();

  const complaintsQuery = useQuery({
    queryKey: ['complaints', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Complaint[];
    },
    enabled: !!teacherId,
  });

  const createComplaint = useMutation({
    mutationFn: async (complaint: Pick<TablesInsert<'complaints'>, 'subject' | 'description' | 'attachments'>) => {
      if (!teacherId) throw new Error('No teacher ID');
      
      const { data, error } = await supabase
        .from('complaints')
        .insert({ ...complaint, teacher_id: teacherId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      toast.success('Complaint submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit complaint: ' + error.message);
    },
  });

  return {
    complaints: complaintsQuery.data ?? [],
    isLoading: complaintsQuery.isLoading,
    error: complaintsQuery.error,
    createComplaint,
  };
}

// ============ SUGGESTIONS ============
export function useSuggestions() {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const queryClient = useQueryClient();

  const suggestionsQuery = useQuery({
    queryKey: ['suggestions', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      
      const { data, error } = await supabase
        .from('suggestions')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Suggestion[];
    },
    enabled: !!teacherId,
  });

  const createSuggestion = useMutation({
    mutationFn: async (suggestion: Pick<TablesInsert<'suggestions'>, 'title' | 'description'>) => {
      if (!teacherId) throw new Error('No teacher ID');
      
      const { data, error } = await supabase
        .from('suggestions')
        .insert({ ...suggestion, teacher_id: teacherId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] });
      toast.success('Suggestion submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit suggestion: ' + error.message);
    },
  });

  return {
    suggestions: suggestionsQuery.data ?? [],
    isLoading: suggestionsQuery.isLoading,
    error: suggestionsQuery.error,
    createSuggestion,
  };
}

// ============ FEEDBACK ============
export function useFeedback() {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const queryClient = useQueryClient();

  const feedbackQuery = useQuery({
    queryKey: ['feedback', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Feedback[];
    },
    enabled: !!teacherId,
  });

  const respondToFeedback = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      const { data, error } = await supabase
        .from('feedback')
        .update({ teacher_response: response })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      toast.success('Response submitted successfully');
    },
    onError: (error) => {
      toast.error('Failed to submit response: ' + error.message);
    },
  });

  return {
    feedback: feedbackQuery.data ?? [],
    isLoading: feedbackQuery.isLoading,
    error: feedbackQuery.error,
    respondToFeedback,
  };
}

// ============ IMPROVEMENTS ============
export function useImprovements() {
  const { teacher } = useAuth();
  const teacherId = teacher?.id;
  const queryClient = useQueryClient();

  const improvementsQuery = useQuery({
    queryKey: ['improvements', teacherId],
    queryFn: async () => {
      if (!teacherId) return [];
      
      const { data, error } = await supabase
        .from('improvements')
        .select('*')
        .eq('teacher_id', teacherId)
        .order('is_completed', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Improvement[];
    },
    enabled: !!teacherId,
  });

  const markComplete = useMutation({
    mutationFn: async ({ id, evidenceUrl }: { id: string; evidenceUrl?: string }) => {
      const { data, error } = await supabase
        .from('improvements')
        .update({ 
          is_completed: true, 
          completed_at: new Date().toISOString(),
          evidence_url: evidenceUrl || null,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['improvements'] });
      toast.success('Improvement marked as complete');
    },
    onError: (error) => {
      toast.error('Failed to update improvement: ' + error.message);
    },
  });

  const stats = {
    total: improvementsQuery.data?.length ?? 0,
    pending: improvementsQuery.data?.filter(i => !i.is_completed).length ?? 0,
    completed: improvementsQuery.data?.filter(i => i.is_completed).length ?? 0,
  };

  return {
    improvements: improvementsQuery.data ?? [],
    isLoading: improvementsQuery.isLoading,
    error: improvementsQuery.error,
    stats,
    markComplete,
  };
}
