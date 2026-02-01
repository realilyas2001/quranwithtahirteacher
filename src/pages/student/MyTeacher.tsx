import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { useStudentConnection } from '@/hooks/useStudentConnection';
import { 
  UserCheck, 
  Search, 
  Clock, 
  Mail, 
  Calendar,
  MessageSquare,
  BookOpen,
} from 'lucide-react';

export default function MyTeacher() {
  const { connectedTeacher, hasConnectedTeacher, isLoading } = useStudentConnection();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!hasConnectedTeacher) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Teacher</h1>
          <p className="text-muted-foreground">Your connected Quran teacher</p>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <UserCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg mb-2">No Teacher Connected</h3>
            <p className="text-muted-foreground mb-4">
              You haven't connected with a teacher yet. Browse our qualified teachers and send a connection request.
            </p>
            <Button asChild>
              <Link to="/student/find-tutors">
                <Search className="h-4 w-4 mr-2" />
                Find a Tutor
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const teacher = connectedTeacher;
  const profile = teacher?.profile;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Teacher</h1>
        <p className="text-muted-foreground">Your connected Quran teacher</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Teacher Avatar */}
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {profile?.full_name?.charAt(0) || 'T'}
                </AvatarFallback>
              </Avatar>
              <Badge variant="outline" className="mt-3 bg-green-500/10 text-green-600 border-green-500/30">
                <UserCheck className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            </div>

            {/* Teacher Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {profile?.full_name || 'Teacher'}
                </h2>
                {profile?.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                )}
              </div>

              {teacher?.bio && (
                <p className="text-muted-foreground">{teacher.bio}</p>
              )}

              {/* Specializations */}
              {teacher?.specializations && teacher.specializations.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-2">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {teacher.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex flex-wrap gap-4 pt-2">
                {teacher?.teaching_hours_per_week && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {teacher.teaching_hours_per_week} hours/week
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Link to="/student/schedule" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">View Schedule</h3>
                <p className="text-sm text-muted-foreground">See your upcoming classes</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
          <CardContent className="p-4">
            <Link to="/student/lessons" className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Lesson History</h3>
                <p className="text-sm text-muted-foreground">Review past lessons</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
