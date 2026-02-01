import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import type { AttendanceWithDetails } from '@/hooks/useAttendance';
import type { AttendanceStatus } from '@/types/database';

interface AttendanceEditDialogProps {
  attendance: AttendanceWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, status: AttendanceStatus, note: string) => void;
  isLoading?: boolean;
}

const statusOptions: { value: AttendanceStatus; label: string }[] = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'leave', label: 'Leave' },
  { value: 'no_answer', label: 'No Answer' },
];

export function AttendanceEditDialog({
  attendance,
  open,
  onOpenChange,
  onSave,
  isLoading,
}: AttendanceEditDialogProps) {
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (attendance) {
      setStatus(attendance.status);
      setNote(attendance.note || '');
    }
  }, [attendance]);

  const handleSave = () => {
    if (attendance) {
      onSave(attendance.id, status, note);
    }
  };

  if (!attendance) return null;

  const classDate = attendance.class?.scheduled_date
    ? format(new Date(attendance.class.scheduled_date), 'MMMM d, yyyy')
    : 'N/A';
  const classTime = attendance.class?.start_time
    ? format(new Date(`2000-01-01T${attendance.class.start_time}`), 'h:mm a')
    : 'N/A';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Attendance</DialogTitle>
          <DialogDescription>Update attendance status and add notes.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Student Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={attendance.student?.avatar_url || ''}
                alt={attendance.student?.full_name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {attendance.student?.full_name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{attendance.student?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {classDate} @ {classTime}
              </p>
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AttendanceStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea
              id="note"
              placeholder="Add a note about this attendance..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
