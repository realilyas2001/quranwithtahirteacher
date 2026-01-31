import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { format, parseISO, addDays, isBefore, startOfDay } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateRecoveryClass } from '@/hooks/useClasses';
import type { ClassWithStudent } from '@/hooks/useClasses';

interface RecoveryClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalClass: ClassWithStudent | null;
}

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  '21:00', '21:30', '22:00', '22:30', '23:00', '23:30',
];

const DURATION_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
];

export function RecoveryClassDialog({
  open,
  onOpenChange,
  originalClass,
}: RecoveryClassDialogProps) {
  const today = startOfDay(new Date());
  const tomorrow = addDays(today, 1);
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(tomorrow);
  const [selectedTime, setSelectedTime] = useState<string>(
    originalClass?.start_time?.slice(0, 5) || '10:00'
  );
  const [duration, setDuration] = useState<string>(
    String(originalClass?.duration_minutes || 30)
  );
  const [notes, setNotes] = useState<string>('');

  const createRecoveryClass = useCreateRecoveryClass();

  const handleSubmit = async () => {
    if (!originalClass || !selectedDate) return;

    await createRecoveryClass.mutateAsync({
      originalClassId: originalClass.id,
      studentId: originalClass.student_id,
      scheduledDate: format(selectedDate, 'yyyy-MM-dd'),
      startTime: selectedTime,
      durationMinutes: parseInt(duration),
      notes: notes || undefined,
    });

    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(tomorrow);
    setSelectedTime('10:00');
    setDuration('30');
    setNotes('');
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, today);
  };

  if (!originalClass) return null;

  const originalDate = format(parseISO(originalClass.scheduled_date), 'MMM d, yyyy');
  const originalTime = originalClass.start_time.slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Recovery Class</DialogTitle>
          <DialogDescription>
            Schedule a recovery session for the missed class.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Original Class Info */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium">Original Class</p>
                <p className="text-sm text-muted-foreground">
                  {originalClass.student?.full_name} • {originalDate} at {originalTime}
                </p>
                <p className="text-sm text-destructive capitalize mt-1">
                  Status: {originalClass.status?.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label>New Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selector */}
          <div className="space-y-2">
            <Label>Time</Label>
            <Select value={selectedTime} onValueChange={setSelectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {TIME_OPTIONS.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              placeholder="Recovery for missed class..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || createRecoveryClass.isPending}
          >
            {createRecoveryClass.isPending ? 'Scheduling...' : 'Schedule Recovery'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
