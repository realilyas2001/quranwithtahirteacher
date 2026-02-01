import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  BookOpen,
  TrendingUp,
  Clock,
  GraduationCap,
  Search,
  Video,
} from 'lucide-react';

export default function StudentDashboard() {
  const { student, profile, isParent, activeChild } = useAuth();
  
  const displayStudent = isParent && activeChild ? activeChild : student;
  const displayName = displayStudent?.full_name || profile?.full_name || 'Student';
  const currentSurah = displayStudent?.current_surah || 'Al-Fatiha';
  const currentJuzz = displayStudent?.current_juzz || 1;
  const progress = displayStudent?.progress_percentage || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Assalamu Alaikum, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground">
          {isParent 
            ? `Managing ${activeChild?.full_name}'s learning journey`
            : 'Continue your Quranic journey with us today'
          }
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No classes scheduled</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Surah</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSurah}</div>
            <p className="text-xs text-muted-foreground">Juzz {currentJuzz}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress}%</div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Classes completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Next Class Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Next Class
            </CardTitle>
            <CardDescription>Your upcoming scheduled class</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">No Upcoming Classes</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Connect with a teacher to schedule your first class
              </p>
              <Button asChild>
                <Link to="/student/find-tutors">
                  <Search className="h-4 w-4 mr-2" />
                  Find a Tutor
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>My Teacher</CardTitle>
            <CardDescription>Your connected Quran teacher</CardDescription>
          </CardHeader>
          <CardContent>
            {displayStudent?.teacher_id ? (
              <div className="text-center py-4">
                <Badge variant="secondary" className="mb-4">Connected</Badge>
                <p className="text-sm text-muted-foreground">
                  View your teacher's profile and upcoming schedule
                </p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/student/my-teacher">View Teacher</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">No Teacher Connected</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Browse our qualified teachers and send a connection request
                </p>
                <Button asChild>
                  <Link to="/student/find-tutors">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Teachers
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Lessons */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Lessons</CardTitle>
          <CardDescription>Your latest learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No lessons recorded yet. Start learning to see your progress here!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
