import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import AppLayout from "@/components/layout/AppLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";

// Auth and protection
import PrivateRoute from "@/components/auth/PrivateRoute";
import Auth from "@/pages/Auth";
import Unauthorized from "@/pages/Unauthorized";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingInfo from "./pages/PricingInfo";
import SignUpChoice from "./pages/SignUpChoice";
import MaintenancePage from "./pages/MaintenancePage";
import MaintenanceStatusPage from "./pages/MaintenanceStatusPage";

// Protected pages - Both roles
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Appointments from "./pages/Appointments";
import Notifications from "./pages/Notifications";

// Protected pages - Patient only
import FindTherapist from "./pages/FindTherapist";
import PatientProfile from "./pages/PatientProfile";
import PatientSignup from "./pages/PatientSignup";

// Protected pages - Therapist only
import TherapistProfile from "./pages/TherapistProfile";
import TherapistSignup from "./pages/TherapistSignup";
import TherapistDocumentation from "./pages/TherapistDocumentation";

// Dashboard components
import TherapistDashboardOverview from "@/components/dashboard/TherapistDashboardOverview";
import TherapistScheduleView from "@/components/dashboard/TherapistScheduleView";
import TherapistPatientsList from "@/components/dashboard/TherapistPatientsList";

// Maintenance mode wrapper component
const MaintenanceWrapper = ({ children }) => {
  // You can easily toggle this to false when you want to disable maintenance mode
  const isMaintenanceMode = false;
  const location = useLocation();
  
  // Check if current path starts with /maintenance
  const isMaintenancePath = location.pathname.startsWith('/maintenance');
  
  // Redirect to maintenance page if not already there
  if (isMaintenanceMode && !isMaintenancePath) {
    return <Navigate to="/maintenance" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <MaintenanceWrapper>
              <Routes>
                {/* Maintenance Routes - Always accessible */}
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/maintenance/status" element={<MaintenanceStatusPage />} />
                
                {/* Public Routes */}
                <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                <Route path="/pricing" element={<AppLayout><PricingInfo /></AppLayout>} />
                <Route path="/signup" element={<AppLayout><SignUpChoice /></AppLayout>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Routes accessible by both roles */}
                <Route path="/my-profile" element={
                  <AppLayout>
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  </AppLayout>
                } />
                
                <Route path="/messages" element={
                  <AppLayout>
                    <PrivateRoute>
                      <Messages />
                    </PrivateRoute>
                  </AppLayout>
                } />
                
                <Route path="/appointments" element={
                  <AppLayout>
                    <PrivateRoute>
                      <Appointments />
                    </PrivateRoute>
                  </AppLayout>
                } />
                
                {/* New Notifications route */}
                <Route path="/notifications" element={
                  <PrivateRoute>
                    <Notifications />
                  </PrivateRoute>
                } />

                {/* Patient-only routes */}
                <Route path="/find-therapist" element={
                  <AppLayout>
                    <PrivateRoute requiredRole="patient">
                      <FindTherapist />
                    </PrivateRoute>
                  </AppLayout>
                } />
                
                <Route path="/patient-profile" element={
                  <PrivateRoute requiredRole="patient">
                    <PatientProfile />
                  </PrivateRoute>
                } />
                
                <Route path="/patient-signup" element={
                  <AppLayout>
                    <PatientSignup />
                  </AppLayout>
                } />

                {/* Therapist-only routes */}
                <Route path="/therapist-profile" element={
                  <PrivateRoute requiredRole="therapist">
                    <TherapistProfile />
                  </PrivateRoute>
                } />
                
                <Route path="/therapist-signup" element={
                  <AppLayout>
                    <TherapistSignup />
                  </AppLayout>
                } />
                
                <Route path="/therapist-documentation" element={
                  <AppLayout>
                    <PrivateRoute requiredRole="therapist">
                      <TherapistDocumentation />
                    </PrivateRoute>
                  </AppLayout>
                } />

                {/* Therapist Dashboard with nested routes */}
                <Route path="/therapist-dashboard" element={
                  <PrivateRoute requiredRole="therapist">
                    <DashboardLayout />
                  </PrivateRoute>
                }>
                  <Route index element={<TherapistDashboardOverview />} />
                  <Route path="schedule" element={<TherapistScheduleView />} />
                  <Route path="patients" element={<TherapistPatientsList />} />
                </Route>

                {/* Redirect /schedule and /patients to their nested dashboard routes */}
                <Route path="/schedule" element={<Navigate to="/therapist-dashboard/schedule" replace />} />
                <Route path="/patients" element={<Navigate to="/therapist-dashboard/patients" replace />} />

                {/* ADMIN DASHBOARD (admin-only access) */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute requiredRole="admin">
                      <AdminDashboardLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<AdminOverviewPage />} />
                  {/* Example additional admin pages (stubs) */}
                  <Route path="users" element={<div>Users Management Page (Coming Soon)</div>} />
                  <Route path="appointments" element={<div>Appointments Management Page (Coming Soon)</div>} />
                </Route>

                {/* 404 - Not Found */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MaintenanceWrapper>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
