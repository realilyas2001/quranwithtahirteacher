import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Layouts
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { StudentLayout } from "./components/layout/StudentLayout";

// Public Pages
import Landing from "./pages/Landing";

// Main Pages (Teacher)
import Dashboard from "./pages/Dashboard";
import TodayClasses from "./pages/TodayClasses";
import ClassRoom from "./pages/ClassRoom";
import Students from "./pages/students/Students";
import Classes from "./pages/classes/Classes";
import Attendance from "./pages/attendance/Attendance";
import ClassSchedule from "./pages/classes/ClassSchedule";
import StudentProfile from "./pages/students/StudentProfile";
import AddLesson from "./pages/lessons/AddLesson";

// Phase 9: Communication & Tasks
import Tasks from "./pages/tasks/Tasks";
import Complaints from "./pages/complaints/Complaints";
import Suggestions from "./pages/suggestions/Suggestions";
import Feedback from "./pages/feedback/Feedback";
import Announcements from "./pages/announcements/Announcements";
import Improvement from "./pages/improvement/Improvement";
import Rules from "./pages/rules/Rules";
import Instructions from "./pages/instructions/Instructions";

// Phase 10: Remaining Pages
import LessonHistory from "./pages/lessons/LessonHistory";
import ExaminerRemarks from "./pages/lessons/ExaminerRemarks";
import Reminders from "./pages/reminders/Reminders";
import Salary from "./pages/salary/Salary";
import Deductions from "./pages/salary/Deductions";
import ConnectionRequests from "./pages/ConnectionRequests";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import FindTutors from "./pages/student/FindTutors";
import StudentTodayClasses from "./pages/student/TodayClasses";
import MyTeacher from "./pages/student/MyTeacher";
import MyClasses from "./pages/student/MyClasses";
import MySchedule from "./pages/student/MySchedule";
import StudentLessons from "./pages/student/Lessons";
import MyProgress from "./pages/student/MyProgress";
import StudentAttendance from "./pages/student/Attendance";
import StudentMessages from "./pages/student/Messages";
import StudentRequests from "./pages/student/Requests";
import StudentAnnouncements from "./pages/student/Announcements";
import StudentProfile2 from "./pages/student/Profile";
import StudentSettings from "./pages/student/Settings";
import StudentHelp from "./pages/student/Help";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Video Classroom (outside dashboard layout) */}
            <Route path="/classroom/:classId" element={<ClassRoom />} />

            {/* Protected Teacher Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/today-classes" element={<TodayClasses />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/schedule" element={<ClassSchedule />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              <Route path="/connection-requests" element={<ConnectionRequests />} />
              
              {/* Lessons Sub-routes */}
              <Route path="/lessons/add" element={<AddLesson />} />
              <Route path="/lessons/history" element={<LessonHistory />} />
              <Route path="/lessons/examiner" element={<ExaminerRemarks />} />
              
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/reminder" element={<Reminders />} />
              
              {/* Phase 9: Communication & Tasks */}
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/improvement" element={<Improvement />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/instruction" element={<Instructions />} />
              
              {/* Phase 10: Salary & Deductions */}
              <Route path="/salary" element={<Salary />} />
              <Route path="/deductions" element={<Deductions />} />
            </Route>

            {/* Protected Student Dashboard Routes */}
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/today" element={<StudentTodayClasses />} />
              <Route path="/student/find-tutors" element={<FindTutors />} />
              <Route path="/student/my-teacher" element={<MyTeacher />} />
              <Route path="/student/classes" element={<MyClasses />} />
              <Route path="/student/schedule" element={<MySchedule />} />
              <Route path="/student/lessons" element={<StudentLessons />} />
              <Route path="/student/progress" element={<MyProgress />} />
              <Route path="/student/attendance" element={<StudentAttendance />} />
              <Route path="/student/messages" element={<StudentMessages />} />
              <Route path="/student/requests" element={<StudentRequests />} />
              <Route path="/student/announcements" element={<StudentAnnouncements />} />
              <Route path="/student/profile" element={<StudentProfile2 />} />
              <Route path="/student/settings" element={<StudentSettings />} />
              <Route path="/student/help" element={<StudentHelp />} />
            </Route>

            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
