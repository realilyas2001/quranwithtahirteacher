import React from 'react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { ClassCard } from './ClassCard';
import type { ClassWithStudent } from '@/hooks/useClasses';

interface WeekCalendarProps {
  weekStart: Date;
  classes: ClassWithStudent[];
  onScheduleRecovery: (classData: ClassWithStudent) => void;
  onStartCall: (classData: ClassWithStudent) => void;
}

export function WeekCalendar({
  weekStart,
  classes,
  onScheduleRecovery,
  onStartCall,
}: WeekCalendarProps) {
  // Get week days starting from Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(startOfWeek(weekStart, { weekStartsOn: 1 }), i)
  );

  // Group classes by date
  const classesByDate = classes.reduce((acc, cls) => {
    const date = cls.scheduled_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(cls);
    return acc;
  }, {} as Record<string, ClassWithStudent[]>);

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b bg-muted/50">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              'px-2 py-3 text-center border-r last:border-r-0',
              isToday(day) && 'bg-primary/10'
            )}
          >
            <p className="text-xs text-muted-foreground uppercase">
              {format(day, 'EEE')}
            </p>
            <p className={cn(
              'text-lg font-semibold mt-1',
              isToday(day) && 'text-primary'
            )}>
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* Day Columns with Classes */}
      <div className="grid grid-cols-7 min-h-[400px]">
        {weekDays.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayClasses = classesByDate[dateStr] || [];

          return (
            <div
              key={day.toISOString()}
              className={cn(
                'border-r last:border-r-0 p-2 space-y-2',
                isToday(day) && 'bg-primary/5'
              )}
            >
              {dayClasses.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-xs text-muted-foreground">No classes</p>
                </div>
              ) : (
                dayClasses.map((cls) => (
                  <ClassCard
                    key={cls.id}
                    classData={cls}
                    compact
                    onScheduleRecovery={onScheduleRecovery}
                    onStartCall={onStartCall}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Mobile-friendly day view
interface DayViewProps {
  date: Date;
  classes: ClassWithStudent[];
  onScheduleRecovery: (classData: ClassWithStudent) => void;
  onStartCall: (classData: ClassWithStudent) => void;
}

export function DayView({
  date,
  classes,
  onScheduleRecovery,
  onStartCall,
}: DayViewProps) {
  const dateStr = format(date, 'yyyy-MM-dd');
  const dayClasses = classes.filter(c => c.scheduled_date === dateStr);

  return (
    <div className="space-y-4">
      <div className={cn(
        'text-center py-4 rounded-lg border',
        isToday(date) && 'bg-primary/10 border-primary/30'
      )}>
        <p className="text-sm text-muted-foreground uppercase">
          {format(date, 'EEEE')}
        </p>
        <p className="text-2xl font-bold">{format(date, 'MMMM d, yyyy')}</p>
      </div>

      {dayClasses.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No classes scheduled for this day
        </div>
      ) : (
        <div className="space-y-3">
          {dayClasses.map((cls) => (
            <ClassCard
              key={cls.id}
              classData={cls}
              onScheduleRecovery={onScheduleRecovery}
              onStartCall={onStartCall}
            />
          ))}
        </div>
      )}
    </div>
  );
}
