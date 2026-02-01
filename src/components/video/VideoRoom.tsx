import React, { useState, useEffect } from 'react';
import { VideoTile } from './VideoTile';
import { CallControls } from './CallControls';
import { ClassTimer } from './ClassTimer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wifi, WifiOff, Loader2, AlertCircle } from 'lucide-react';
import { useVideoCall, CallState } from '@/hooks/useVideoCall';
import type { Student } from '@/types/database';
import { cn } from '@/lib/utils';

interface VideoRoomProps {
  classId: string;
  teacherId: string;
  studentId: string;
  teacherName: string;
  student?: Student;
  onCallEnd?: () => void;
  autoStart?: boolean;
}

export function VideoRoom({
  classId,
  teacherId,
  studentId,
  teacherName,
  student,
  onCallEnd,
  autoStart = false,
}: VideoRoomProps) {
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const {
    callState,
    localParticipant,
    remoteParticipant,
    isMicOn,
    isCameraOn,
    error,
    startCall,
    endCall,
    toggleMic,
    toggleCamera,
  } = useVideoCall({
    classId,
    teacherId,
    studentId,
    teacherName,
    onCallEnd,
  });

  // Auto-start call if specified
  useEffect(() => {
    if (autoStart && callState === 'idle') {
      startCall();
    }
  }, [autoStart, callState, startCall]);

  // Set call start time when connected
  useEffect(() => {
    if (callState === 'connected' && !callStartTime) {
      setCallStartTime(new Date());
    }
  }, [callState, callStartTime]);

  const renderCallState = () => {
    switch (callState) {
      case 'idle':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ready to Start</h2>
              <p className="text-muted-foreground">
                Click the button below to start the video call with {student?.full_name || 'your student'}
              </p>
            </div>
            <Button size="lg" onClick={startCall}>
              Start Video Call
            </Button>
          </div>
        );

      case 'creating':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Creating Room...</h2>
              <p className="text-muted-foreground">Setting up the video connection</p>
            </div>
          </div>
        );

      case 'joining':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <div className="text-center">
              <h2 className="text-xl font-semibold">Joining Call...</h2>
              <p className="text-muted-foreground">Connecting to the video room</p>
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-destructive">Connection Failed</h2>
              <p className="text-muted-foreground max-w-md">
                {error || 'Unable to connect to the video call. Please check your internet connection and try again.'}
              </p>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg max-w-md">
              <p className="font-medium">Troubleshooting tips:</p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>Check your internet connection</li>
                <li>Allow camera and microphone permissions</li>
                <li>Try refreshing the page</li>
                <li>Close other video call applications</li>
              </ul>
            </div>
            <Button onClick={startCall}>Try Again</Button>
          </div>
        );

      case 'ended':
        return (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Call Ended</h2>
              <p className="text-muted-foreground">The video call has ended</p>
            </div>
          </div>
        );

      case 'connected':
        return null; // Will show the video interface

      default:
        return null;
    }
  };

  if (callState !== 'connected') {
    return (
      <div className="w-full h-full min-h-[400px] bg-background rounded-xl border">
        {renderCallState()}
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-xl shadow-lg p-3">
        <div className="flex items-center gap-3">
          <VideoTile
            participant={localParticipant}
            isLocal
            isMini
            fallbackName={teacherName}
          />
          <div className="flex flex-col gap-2">
            <ClassTimer startTime={callStartTime || undefined} />
            <CallControls
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              isMinimized={isMinimized}
              onToggleMic={toggleMic}
              onToggleCamera={toggleCamera}
              onEndCall={endCall}
              onToggleMinimize={() => setIsMinimized(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
            <Wifi className="h-3 w-3 mr-1" />
            Live
          </Badge>
          <span className="font-medium">
            {student?.full_name || 'Student'}
          </span>
          {student?.course_level && (
            <Badge variant="secondary">{student.course_level}</Badge>
          )}
        </div>
        <ClassTimer startTime={callStartTime || undefined} />
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Remote participant (student) - main view */}
        <div className="relative aspect-video lg:aspect-auto bg-muted rounded-xl overflow-hidden">
          {remoteParticipant ? (
            <VideoTile
              participant={remoteParticipant}
              fallbackName={student?.full_name || 'Student'}
              fallbackAvatar={student?.avatar_url || undefined}
              className="h-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm">Waiting for student to join...</p>
            </div>
          )}
        </div>

        {/* Local participant (teacher) */}
        <div className="relative aspect-video lg:aspect-auto">
          <VideoTile
            participant={localParticipant}
            isLocal
            fallbackName={teacherName}
            className="h-full"
          />
        </div>
      </div>

      {/* Controls */}
      <div 
        className="px-4 py-4 border-t bg-muted/50"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <CallControls
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          isMinimized={isMinimized}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onEndCall={endCall}
          onToggleMinimize={() => setIsMinimized(true)}
        />
      </div>
    </div>
  );
}
