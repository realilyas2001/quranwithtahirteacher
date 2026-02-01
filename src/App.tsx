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

// Remaining Placeholders
import {
  LessonHistory,
  ExaminerRemarks,
  Reminder,
  Salary,
  Deductions,
} from "./pages/placeholders";

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
              
              {/* Phase 9: Communication & Tasks */}
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/complaints" element={<Complaints />} />
              <Route path="/suggestions" element={<Suggestions />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/improvement" element={<Improvement />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/instruction" element={<Instructions />} />
              
              {/* Salary & Deductions (still placeholder) */}
              <Route path="/salary" element={<Salary />} />
              <Route path="/deductions" element={<Deductions />} />
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
