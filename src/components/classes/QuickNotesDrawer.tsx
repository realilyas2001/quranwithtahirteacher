import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { TodayClass } from '@/types/database';

interface QuickNotesDrawerProps {
  classData: TodayClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickNotesDrawer({ classData, open, onOpenChange }: QuickNotesDrawerProps) {
  const [notes, setNotes] = useState('');
  const queryClient = useQueryClient();

  useEffect(() => {
    if (classData) {
      setNotes(classData.notes || '');
    }
  }, [classData]);

  const updateNotes = useMutation({
    mutationFn: async (newNotes: string) => {
      if (!classData) throw new Error('No class selected');
      
      const { error } = await supabase
        .from('classes')
        .update({ notes: newNotes })
        .eq('id', classData.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-classes'] });
      toast.success('Notes saved');
      onOpenChange(false);
    },
    onError: () => {
      toast.error('Failed to save notes');
    },
  });

  const handleSave = () => {
    updateNotes.mutate(notes);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (!classData) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Class Notes</SheetTitle>
          <SheetDescription>
            Add quick notes for this class session
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Student Info */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={classData.student?.avatar_url || ''}
                alt={classData.student?.full_name}
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {classData.student?.full_name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{classData.student?.full_name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {classData.student?.course_level}
                </Badge>
                <span>•</span>
                <span>{formatTime(classData.start_time)}</span>
              </div>
            </div>
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this class session..."
              className="min-h-[200px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              These notes are private and only visible to you.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              disabled={updateNotes.isPending}
            >
              {updateNotes.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Notes
                </>
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
