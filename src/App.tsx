import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Dashboard Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

// Main Pages
import Dashboard from "./pages/Dashboard";
import TodayClasses from "./pages/TodayClasses";
import ClassRoom from "./pages/ClassRoom";
import {
  LessonHistory,
  ExaminerRemarks,
  Attendance,
  Reminder,
  Tasks,
  Complaints,
  Suggestions,
  FeedbackPage,
  Salary,
  Deductions,
  Improvement,
  Rules,
  Instruction,
  Announcements,
} from "./pages/placeholders";
import Students from "./pages/students/Students";
import Classes from "./pages/classes/Classes";
import ClassSchedule from "./pages/classes/ClassSchedule";
import StudentProfile from "./pages/students/StudentProfile";
import AddLesson from "./pages/lessons/AddLesson";

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Video Classroom (outside dashboard layout) */}
            <Route path="/classroom/:classId" element={<ClassRoom />} />

            {/* Protected Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/today-classes" element={<TodayClasses />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/schedule" element={<ClassSchedule />} />
              <Route path="/students" element={<Students />} />
              <Route path="/students/:id" element={<StudentProfile />} />
              
              {/* Lessons Sub-routes */}
              <Route path="/lessons/add" element={<AddLesson />} />
              <Route path="/lessons/history" element={<LessonHistory />} />
              <Route path="/lessons/examiner" element={<ExaminerRemarks />} />
              
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/reminder" element={<Reminder />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/salary" element={<Salary />} />
              <Route path="/deductions" element={<Deductions />} />
              <Route path="/improvement" element={<Improvement />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/instruction" element={<Instruction />} />
              <Route path="/announcements" element={<Announcements />} />
            </Route>

            {/* Redirects */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
