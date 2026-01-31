import React, { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VideoRoom } from '@/components/video/VideoRoom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import type { TodayClass } from '@/types/database';

export default function ClassRoom() {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const autoStart = searchParams.get('autoStart') === 'true';
  const { teacher, profile } = useAuth();

  const { data: classData, isLoading, error } = useQuery({
    queryKey: ['class-details', classId],
    queryFn: async (): Promise<TodayClass | null> => {
      if (!classId) return null;

      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          student:students(*)
        `)
        .eq('id', classId)
        .single();

      if (error) throw error;
      return data as TodayClass;
    },
    enabled: !!classId,
  });

  const handleCallEnd = () => {
    // Navigate to add lesson page after call ends
    navigate(`/lessons/add?classId=${classId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <Skeleton className="w-full h-[600px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Class Not Found</h1>
          <p className="text-muted-foreground">
            The class you're looking for doesn't exist or you don't have access.
          </p>
          <Button onClick={() => navigate('/today-classes')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Classes
          </Button>
        </div>
      </div>
    );
  }

  if (!teacher?.id || !profile?.full_name) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">
            Please log in to access the video classroom.
          </p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/today-classes')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold">Video Classroom</h1>
            <p className="text-sm text-muted-foreground">
              Session with {classData.student?.full_name}
            </p>
          </div>
        </div>

        {/* Video Room */}
        <div className="h-[calc(100vh-140px)] min-h-[500px]">
          <VideoRoom
            classId={classData.id}
            teacherId={teacher.id}
            studentId={classData.student_id}
            teacherName={profile.full_name}
            student={classData.student}
            onCallEnd={handleCallEnd}
            autoStart={autoStart}
          />
        </div>
      </div>
    </div>
  );
}
