import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Search, UserPlus, Clock, BookOpen, Loader2 } from 'lucide-react';

interface TeacherPublic {
  id: string;
  full_name: string;
  avatar_url: string | null;
  specializations: string[] | null;
  bio: string | null;
  teaching_hours_per_week: number | null;
  status: string | null;
}

export default function FindTutors() {
  const { student } = useAuth();
  const [teachers, setTeachers] = useState<TeacherPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherPublic | null>(null);
  const [connectionMessage, setConnectionMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  useEffect(() => {
    fetchTeachers();
    fetchPendingRequests();
  }, []);

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('teachers_public')
        .select('*');

      if (error) throw error;
      setTeachers(data || []);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to load teachers');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    if (!student?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('teacher_id')
        .eq('student_id', student.id)
        .eq('status', 'pending');

      if (error) throw error;
      setPendingRequests(data?.map(r => r.teacher_id) || []);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const handleConnect = async () => {
    if (!selectedTeacher || !student?.id) return;
    
    setSending(true);
    try {
      const { error } = await supabase
        .from('connection_requests')
        .insert({
          student_id: student.id,
          teacher_id: selectedTeacher.id,
          message: connectionMessage || null,
        });

      if (error) throw error;
      
      toast.success('Connection request sent!');
      setPendingRequests([...pendingRequests, selectedTeacher.id]);
      setSelectedTeacher(null);
      setConnectionMessage('');
    } catch (error: any) {
      console.error('Error sending connection request:', error);
      toast.error(error.message || 'Failed to send request');
    } finally {
      setSending(false);
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.specializations?.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Find Tutors</h1>
        <p className="text-muted-foreground">Browse and connect with qualified Quran teachers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or specialization..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Teachers Found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try adjusting your search criteria' : 'No teachers are currently available'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeachers.map((teacher) => {
            const isPending = pendingRequests.includes(teacher.id);
            const initials = teacher.full_name
              ?.split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2);

            return (
              <Card key={teacher.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14">
                      <AvatarImage src={teacher.avatar_url || undefined} />
                      <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{teacher.full_name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {teacher.teaching_hours_per_week || 0} hrs/week
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Specializations */}
                  {teacher.specializations && teacher.specializations.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {teacher.specializations.slice(0, 3).map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {teacher.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.specializations.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Bio */}
                  {teacher.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {teacher.bio}
                    </p>
                  )}

                  {/* Action Button */}
                  <Button 
                    className="w-full"
                    variant={isPending ? 'outline' : 'default'}
                    disabled={isPending}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    {isPending ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Request Pending
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Connection Request Dialog */}
      <Dialog open={!!selectedTeacher} onOpenChange={() => setSelectedTeacher(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect with {selectedTeacher?.full_name}</DialogTitle>
            <DialogDescription>
              Send a connection request to start learning with this teacher.
              They will review your request and respond soon.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Introduction Message (optional)
              </label>
              <Textarea
                placeholder="Tell the teacher about yourself and your learning goals..."
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTeacher(null)}>
              Cancel
            </Button>
            <Button onClick={handleConnect} disabled={sending}>
              {sending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Send Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
