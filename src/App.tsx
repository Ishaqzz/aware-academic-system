
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Pages
import SignIn from "./pages/SignIn";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentBlackMarks from "./pages/student/StudentBlackMarks";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyBlackMarks from "./pages/faculty/FacultyBlackMarks";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBlackMarks from "./pages/admin/AdminBlackMarks";
import FeedbackPage from "./pages/shared/FeedbackPage";
import ChatPage from "./pages/shared/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/signin" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      
      {/* Student routes */}
      <Route 
        path="/student-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-dashboard/black-marks" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentBlackMarks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-dashboard/feedback" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <FeedbackPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student-dashboard/chat" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Faculty routes */}
      <Route 
        path="/faculty-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/faculty-dashboard/black-marks" 
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyBlackMarks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/faculty-dashboard/feedback" 
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FeedbackPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/faculty-dashboard/chat" 
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <ChatPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/black-marks" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminBlackMarks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin-dashboard/feedback" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FeedbackPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect from / to appropriate pages */}
      <Route path="/" element={<Navigate to="/signin" replace />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
