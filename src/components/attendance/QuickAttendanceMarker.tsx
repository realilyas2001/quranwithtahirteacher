import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CheckCircle2, XCircle, Clock, Calendar, PhoneOff, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import type { AttendanceStatus, Class, Student } from '@/types/database';

interface ClassWithStudent extends Class {
  student: Student;
}

interface QuickAttendanceMarkerProps {
  classes: ClassWithStudent[];
  isLoading?: boolean;
  onMarkAttendance: (classId: string, studentId: string, status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
}

const statusButtons: { status: AttendanceStatus; label: string; icon: React.ElementType }[] = [
  { status: 'present', label: 'Present', icon: CheckCircle2 },
  { status: 'absent', label: 'Absent', icon: XCircle },
  { status: 'late', label: 'Late', icon: Clock },
  { status: 'leave', label: 'Leave', icon: Calendar },
  { status: 'no_answer', label: 'No Answer', icon: PhoneOff },
];

export function QuickAttendanceMarker({
  classes,
  isLoading,
  onMarkAttendance,
  onMarkAllPresent,
}: QuickAttendanceMarkerProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="py-4">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (classes.length === 0) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="py-4 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-medium">
                  Classes Needing Attendance
                </CardTitle>
                <Badge variant="secondary">{classes.length}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAllPresent();
                  }}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Mark All Present
                </Button>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded-lg"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={cls.student?.avatar_url || ''}
                      alt={cls.student?.full_name}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {cls.student?.full_name?.charAt(0) || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{cls.student?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(`2000-01-01T${cls.start_time}`), 'h:mm a')} •{' '}
                      <span className="capitalize">{cls.status.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                {/* Quick Status Buttons */}
                <div className="flex flex-wrap gap-1.5">
                  {statusButtons.map(({ status, label, icon: Icon }) => (
                    <Button
                      key={status}
                      size="sm"
                      variant="outline"
                      className="h-8 px-2 text-xs"
                      onClick={() => onMarkAttendance(cls.id, cls.student_id, status)}
                    >
                      <Icon className="h-3.5 w-3.5 mr-1" />
                      <span className="hidden sm:inline">{label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
