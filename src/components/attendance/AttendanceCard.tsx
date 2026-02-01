import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Pencil, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { AttendanceWithDetails } from '@/hooks/useAttendance';
import type { AttendanceStatus } from '@/types/database';

interface AttendanceCardProps {
  attendance: AttendanceWithDetails;
  onEdit: (attendance: AttendanceWithDetails) => void;
  onViewClass?: (classId: string) => void;
}

const statusConfig: Record<AttendanceStatus, { label: string; className: string }> = {
  present: { label: 'Present', className: 'attendance-present' },
  absent: { label: 'Absent', className: 'attendance-absent' },
  late: { label: 'Late', className: 'attendance-late' },
  leave: { label: 'Leave', className: 'attendance-leave' },
  no_answer: { label: 'No Answer', className: 'bg-[hsl(var(--attendance-no-answer)/0.15)] text-[hsl(var(--attendance-no-answer))]' },
};

export function AttendanceCard({ attendance, onEdit, onViewClass }: AttendanceCardProps) {
  const status = statusConfig[attendance.status];
  const classDate = attendance.class?.scheduled_date
    ? format(new Date(attendance.class.scheduled_date), 'MMM d, yyyy')
    : 'N/A';
  const classTime = attendance.class?.start_time
    ? format(new Date(`2000-01-01T${attendance.class.start_time}`), 'h:mm a')
    : 'N/A';

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Student Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={attendance.student?.avatar_url || ''}
                alt={attendance.student?.full_name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {attendance.student?.full_name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{attendance.student?.full_name}</h3>
                {attendance.student?.country_code && (
                  <span className="text-lg">{attendance.student.country_code}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {classDate} • {classTime}
              </p>
            </div>
          </div>

          {/* Status & Note */}
          <div className="flex items-center gap-3">
            <div className={cn('status-pill', status.className)}>{status.label}</div>
            {attendance.note && (
              <span className="text-sm text-muted-foreground max-w-[150px] truncate hidden md:inline">
                {attendance.note}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(attendance)}>
              <Pencil className="h-4 w-4 mr-1" />
              Edit
            </Button>
            {onViewClass && attendance.class_id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewClass(attendance.class_id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Note - Mobile */}
        {attendance.note && (
          <p className="text-sm text-muted-foreground mt-2 md:hidden">{attendance.note}</p>
        )}
      </CardContent>
    </Card>
  );
}
