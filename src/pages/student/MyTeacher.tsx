import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserCheck, Search } from 'lucide-react';

export default function MyTeacher() {
  const { student, isParent, activeChild } = useAuth();
  const displayStudent = isParent && activeChild ? activeChild : student;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Teacher</h1>
        <p className="text-muted-foreground">Your connected Quran teacher</p>
      </div>

      {displayStudent?.teacher_id ? (
        <Card>
          <CardHeader>
            <CardTitle>Connected Teacher</CardTitle>
            <CardDescription>Your assigned Quran teacher</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Teacher details coming soon...</p>
          </CardContent>
        </Card>
      ) : (
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
      )}
    </div>
  );
}
