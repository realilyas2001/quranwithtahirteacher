import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Student } from '@/types/database';

interface ClassFiltersProps {
  students: Student[];
  selectedStudent: string;
  onStudentChange: (value: string) => void;
  selectedStatus: string[];
  onStatusChange: (value: string[]) => void;
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'no_answer', label: 'No Answer' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function ClassFilters({
  students,
  selectedStudent,
  onStudentChange,
  selectedStatus,
  onStatusChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: ClassFiltersProps) {
  const hasFilters = selectedStudent || selectedStatus.length > 0 || startDate || endDate;

  const handleStatusToggle = (status: string) => {
    if (selectedStatus.includes(status)) {
      onStatusChange(selectedStatus.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatus, status]);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal w-[140px]',
                !startDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, 'MMM d, yyyy') : 'Start Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">to</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'justify-start text-left font-normal w-[140px]',
                !endDate && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, 'MMM d, yyyy') : 'End Date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Student Filter */}
      <Select value={selectedStudent} onValueChange={onStudentChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Students" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Students</SelectItem>
          {students.map((student) => (
            <SelectItem key={student.id} value={student.id}>
              {student.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="min-w-[120px]">
            Status
            {selectedStatus.length > 0 && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {selectedStatus.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-2" align="start">
          <div className="space-y-1">
            {STATUS_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={selectedStatus.includes(option.value) ? 'default' : 'ghost'}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleStatusToggle(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
