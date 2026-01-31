import React, { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Phone, PhoneOff, Loader2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import type { TodayClass, ClassStatus } from '@/types/database';
import { cn } from '@/lib/utils';

interface CallButtonProps {
  classData: TodayClass;
  onCallConnected?: () => void;
  onCallEnded?: () => void;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

type CallState = 'idle' | 'calling' | 'connected' | 'no_answer' | 'failed';

const CALL_TIMEOUT = 40; // seconds
const MAX_RETRIES = 3;

export function CallButton({
  classData,
  onCallConnected,
  onCallEnded,
  variant = 'outline',
  size = 'sm',
}: CallButtonProps) {
  const { teacher } = useAuth();
  const queryClient = useQueryClient();
  const [callState, setCallState] = useState<CallState>('idle');
  const [countdown, setCountdown] = useState(CALL_TIMEOUT);
  const [retryCount, setRetryCount] = useState(0);
  const [showNoAnswerDialog, setShowNoAnswerDialog] = useState(false);

  // Log call event
  const logCallEvent = useMutation({
    mutationFn: async (event: string) => {
      if (!teacher?.id) return;
      
      await supabase.from('call_logs').insert({
        class_id: classData.id,
        teacher_id: teacher.id,
        student_id: classData.student_id,
        event: event as 'initiated' | 'ringing' | 'accepted' | 'rejected' | 'failed' | 'connected' | 'disconnected' | 'timeout',
        metadata: { retry_count: retryCount },
      });
    },
  });

  // Update class status
  const updateClassStatus = useMutation({
    mutationFn: async (status: ClassStatus) => {
      const updates: Record<string, unknown> = { status };
      
      if (status === 'in_progress') {
        updates.actual_start_time = new Date().toISOString();
      } else if (status === 'completed') {
        updates.actual_end_time = new Date().toISOString();
      }

      const { error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', classData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-classes'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  // Handle countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (callState === 'calling' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (callState === 'calling' && countdown === 0) {
      // Timeout reached
      handleTimeout();
    }

    return () => clearTimeout(timer);
  }, [callState, countdown]);

  const handleTimeout = useCallback(() => {
    setCallState('no_answer');
    logCallEvent.mutate('timeout');
    setShowNoAnswerDialog(true);
  }, []);

  const initiateCall = async () => {
    if (retryCount >= MAX_RETRIES) {
      toast.error('Maximum retry attempts reached');
      return;
    }

    setCallState('calling');
    setCountdown(CALL_TIMEOUT);
    logCallEvent.mutate('initiated');

    toast.info(`Calling ${classData.student?.full_name}...`, {
      description: 'Waiting for student to answer...',
    });

    // In production, this would integrate with Daily.co
    // For demo, simulate a response after random time
    const simulatedDelay = Math.random() * 15000 + 5000; // 5-20 seconds
    
    setTimeout(() => {
      if (callState === 'calling') {
        // Simulate 70% success rate for demo
        if (Math.random() > 0.3) {
          handleCallConnected();
        }
        // Otherwise let the timeout handle it
      }
    }, simulatedDelay);
  };

  const handleCallConnected = async () => {
    setCallState('connected');
    logCallEvent.mutate('connected');
    
    try {
      await updateClassStatus.mutateAsync('in_progress');
      toast.success('Call connected!');
      onCallConnected?.();
    } catch {
      toast.error('Failed to update class status');
    }
  };

  const handleMarkNoAnswer = async () => {
    try {
      await updateClassStatus.mutateAsync('no_answer');
      setCallState('no_answer');
      setShowNoAnswerDialog(false);
      toast.warning('Marked as No Answer');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setShowNoAnswerDialog(false);
    setCallState('idle');
    // Small delay before retrying
    setTimeout(() => initiateCall(), 500);
  };

  const handleCancel = () => {
    setCallState('idle');
    setCountdown(CALL_TIMEOUT);
    logCallEvent.mutate('disconnected');
  };

  const handleEndCall = async () => {
    try {
      await updateClassStatus.mutateAsync('completed');
      setCallState('idle');
      logCallEvent.mutate('disconnected');
      toast.success('Class ended');
      onCallEnded?.();
    } catch {
      toast.error('Failed to end class');
    }
  };

  // Render different states
  if (callState === 'calling') {
    return (
      <Button
        size={size}
        variant="destructive"
        onClick={handleCancel}
        className="min-w-[100px]"
      >
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {countdown}s
      </Button>
    );
  }

  if (callState === 'connected') {
    return (
      <Button
        size={size}
        variant="destructive"
        onClick={handleEndCall}
        className="min-w-[100px]"
      >
        <PhoneOff className="mr-2 h-4 w-4" />
        End Call
      </Button>
    );
  }

  if (callState === 'no_answer' && retryCount < MAX_RETRIES) {
    return (
      <>
        <Button
          size={size}
          variant="outline"
          onClick={handleRetry}
          className="min-w-[100px]"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Retry ({MAX_RETRIES - retryCount} left)
        </Button>

        <AlertDialog open={showNoAnswerDialog} onOpenChange={setShowNoAnswerDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>No Answer</AlertDialogTitle>
              <AlertDialogDescription>
                {classData.student?.full_name} didn't answer the call. 
                Would you like to try again or mark this class as "No Answer"?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleMarkNoAnswer}>
                Mark No Answer
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleRetry}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry ({MAX_RETRIES - retryCount} left)
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={initiateCall}
      disabled={retryCount >= MAX_RETRIES}
      className={cn('min-w-[80px]', retryCount >= MAX_RETRIES && 'opacity-50')}
    >
      <Phone className="mr-2 h-4 w-4" />
      Call
    </Button>
  );
}
