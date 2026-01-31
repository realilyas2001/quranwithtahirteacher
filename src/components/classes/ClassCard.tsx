import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Phone,
  Plus,
  MoreVertical,
  User,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Ban,
  Calendar,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import type { ClassWithStudent } from '@/hooks/useClasses';

interface ClassCardProps {
  classData: ClassWithStudent;
  onScheduleRecovery?: (classData: ClassWithStudent) => void;
  onStartCall?: (classData: ClassWithStudent) => void;
  compact?: boolean;
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ElementType; className: string }> = {
  scheduled: { label: 'Scheduled', variant: 'default', icon: Calendar, className: 'bg-blue-500 hover:bg-blue-600' },
  in_progress: { label: 'In Progress', variant: 'default', icon: Clock, className: 'bg-yellow-500 hover:bg-yellow-600 animate-pulse' },
  completed: { label: 'Completed', variant: 'default', icon: CheckCircle2, className: 'bg-green-500 hover:bg-green-600' },
  missed: { label: 'Missed', variant: 'destructive', icon: XCircle, className: '' },
  no_answer: { label: 'No Answer', variant: 'default', icon: AlertCircle, className: 'bg-orange-500 hover:bg-orange-600' },
  cancelled: { label: 'Cancelled', variant: 'secondary', icon: Ban, className: '' },
};

export function ClassCard({ classData, onScheduleRecovery, onStartCall, compact = false }: ClassCardProps) {
  const navigate = useNavigate();
  const student = classData.student;
  const status = classData.status || 'scheduled';
  const config = statusConfig[status] || statusConfig.scheduled;
  const StatusIcon = config.icon;

  const formattedDate = format(parseISO(classData.scheduled_date), 'MMM d, yyyy');
  const formattedTime = classData.start_time.slice(0, 5);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const canScheduleRecovery = status === 'missed' || status === 'no_answer';
  const canStartCall = status === 'scheduled' || status === 'in_progress';
  const canAddLesson = status === 'completed' && !classData.lesson_added;

  if (compact) {
    return (
      <div
        className="p-2 rounded-md border bg-card hover:bg-accent/50 cursor-pointer transition-colors"
        onClick={() => student && navigate(`/students/${student.id}`)}
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            status === 'completed' ? 'bg-green-500' :
            status === 'missed' || status === 'no_answer' ? 'bg-red-500' :
            status === 'in_progress' ? 'bg-yellow-500 animate-pulse' :
            status === 'cancelled' ? 'bg-muted' :
            'bg-blue-500'
          }`} />
          <span className="text-xs font-medium truncate">{formattedTime}</span>
          <span className="text-xs text-muted-foreground truncate flex-1">
            {student?.full_name || 'Unknown'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          {/* Student Info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={student?.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                {student ? getInitials(student.full_name) : '??'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-medium truncate">{student?.full_name || 'Unknown Student'}</p>
              <p className="text-sm text-muted-foreground">
                {student?.country || 'Unknown location'}
              </p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="text-right shrink-0">
            <p className="font-medium">{formattedDate}</p>
            <p className="text-sm text-muted-foreground">
              {formattedTime} • {classData.duration_minutes || 30}min
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          {/* Status & Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={config.variant} className={config.className}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {config.label}
            </Badge>
            {classData.is_recovery && (
              <Badge variant="outline" className="text-orange-600 border-orange-300">
                <RefreshCw className="w-3 h-3 mr-1" />
                Recovery
              </Badge>
            )}
            {classData.lesson_added && (
              <Badge variant="outline" className="text-green-600 border-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Lesson Added
              </Badge>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {canStartCall && (
              <Button
                size="sm"
                variant="default"
                onClick={(e) => {
                  e.stopPropagation();
                  onStartCall?.(classData);
                }}
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            )}
            {canAddLesson && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/lessons/add?classId=${classData.id}&studentId=${student?.id}`);
                }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Lesson
              </Button>
            )}
            {canScheduleRecovery && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleRecovery?.(classData);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Recovery
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => student && navigate(`/students/${student.id}`)}>
                  <User className="w-4 h-4 mr-2" />
                  View Student
                </DropdownMenuItem>
                {canAddLesson && (
                  <DropdownMenuItem 
                    onClick={() => navigate(`/lessons/add?classId=${classData.id}&studentId=${student?.id}`)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Lesson
                  </DropdownMenuItem>
                )}
                {canScheduleRecovery && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onScheduleRecovery?.(classData)}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Schedule Recovery
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
