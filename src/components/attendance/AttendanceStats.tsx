import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2, XCircle, Clock, Calendar, PhoneOff } from 'lucide-react';
import type { AttendanceStats as AttendanceStatsType } from '@/hooks/useAttendance';

interface AttendanceStatsProps {
  stats: AttendanceStatsType;
  isLoading?: boolean;
}

export function AttendanceStats({ stats, isLoading }: AttendanceStatsProps) {
  const getPercentage = (value: number) => {
    if (stats.total === 0) return 0;
    return Math.round((value / stats.total) * 100);
  };

  const statCards = [
    {
      label: 'Present',
      value: stats.present,
      percentage: getPercentage(stats.present),
      icon: CheckCircle2,
      className: 'text-[hsl(var(--attendance-present))]',
      bgClassName: 'bg-[hsl(var(--attendance-present)/0.1)]',
    },
    {
      label: 'Absent',
      value: stats.absent,
      percentage: getPercentage(stats.absent),
      icon: XCircle,
      className: 'text-[hsl(var(--attendance-absent))]',
      bgClassName: 'bg-[hsl(var(--attendance-absent)/0.1)]',
    },
    {
      label: 'Late',
      value: stats.late,
      percentage: getPercentage(stats.late),
      icon: Clock,
      className: 'text-[hsl(var(--attendance-late))]',
      bgClassName: 'bg-[hsl(var(--attendance-late)/0.1)]',
    },
    {
      label: 'Leave',
      value: stats.leave,
      percentage: getPercentage(stats.leave),
      icon: Calendar,
      className: 'text-[hsl(var(--attendance-leave))]',
      bgClassName: 'bg-[hsl(var(--attendance-leave)/0.1)]',
    },
    {
      label: 'No Answer',
      value: stats.no_answer,
      percentage: getPercentage(stats.no_answer),
      icon: PhoneOff,
      className: 'text-[hsl(var(--attendance-no-answer))]',
      bgClassName: 'bg-[hsl(var(--attendance-no-answer)/0.1)]',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-8 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-md ${stat.bgClassName}`}>
                <stat.icon className={`h-4 w-4 ${stat.className}`} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-sm text-muted-foreground">({stat.percentage}%)</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
