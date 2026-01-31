import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
}

export function PlaceholderPage({ title, description, icon: Icon = Construction }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>
            {description || 'This page is under construction and will be available soon.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Individual placeholder pages for each route
export const Classes = () => <PlaceholderPage title="Classes" description="Manage all your classes, scheduled sessions, and recovery classes." />;
export const ClassSchedule = () => <PlaceholderPage title="Class Schedule" description="View your weekly calendar with all scheduled classes." />;
export const Students = () => <PlaceholderPage title="My Students" description="View and manage your assigned students." />;
export const StudentProfile = () => <PlaceholderPage title="Student Profile" description="Detailed student information and progress." />;
// AddLesson moved to src/pages/lessons/AddLesson.tsx
export const LessonHistory = () => <PlaceholderPage title="Lesson History" description="View and filter past lesson records." />;
export const ExaminerRemarks = () => <PlaceholderPage title="Examiner Remarks" description="View OCA feedback and examiner notes." />;
export const Attendance = () => <PlaceholderPage title="Attendance" description="Track and manage student attendance." />;
export const Reminder = () => <PlaceholderPage title="Reminders" description="Set and manage your reminders." />;
export const Tasks = () => <PlaceholderPage title="Tasks" description="View and complete assigned tasks." />;
export const Complaints = () => <PlaceholderPage title="Complaints" description="Submit and track complaints." />;
export const Suggestions = () => <PlaceholderPage title="Suggestions" description="Share your ideas and suggestions." />;
export const FeedbackPage = () => <PlaceholderPage title="Feedback" description="View feedback from students and admin." />;
export const Salary = () => <PlaceholderPage title="Salary" description="View your salary breakdown and history." />;
export const Deductions = () => <PlaceholderPage title="Deductions" description="View deduction details and history." />;
export const Improvement = () => <PlaceholderPage title="Improvement" description="Track improvement suggestions and actions." />;
export const Rules = () => <PlaceholderPage title="Rules" description="Academy policies and procedures." />;
export const Instruction = () => <PlaceholderPage title="Instructions" description="How-to guides and best practices." />;
export const Announcements = () => <PlaceholderPage title="Announcements" description="Important announcements from admin." />;
