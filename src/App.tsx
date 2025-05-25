
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import PrivateRoute from "@/components/auth/PrivateRoute";
import Auth from "@/pages/Auth";
import Unauthorized from "@/pages/Unauthorized";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingInfo from "./pages/PricingInfo";
import SignUpChoice from "./pages/SignUpChoice";
import MaintenancePage from "./pages/MaintenancePage";
import MaintenanceStatusPage from "./pages/MaintenanceStatusPage";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Appointments from "./pages/Appointments";
import Notifications from "./pages/Notifications";
import FindTherapist from "./pages/FindTherapist";
import PatientProfile from "./pages/PatientProfile";
import PatientSignup from "./pages/PatientSignup";
import TherapistProfile from "./pages/TherapistProfile";
import TherapistSignup from "./pages/TherapistSignup";
import TherapistDocumentation from "./pages/TherapistDocumentation";
import TherapistDashboardOverview from "@/components/dashboard/TherapistDashboardOverview";
import TherapistScheduleView from "@/components/dashboard/TherapistScheduleView";
import TherapistPatientsList from "@/components/dashboard/TherapistPatientsList";
import AdminOverviewPage from "./pages/AdminOverviewPage";

// Wrapper for maintenance mode redirection
const MaintenanceWrapper = ({ children }) => {
  const isMaintenanceMode = false;
  const location = useLocation();
  const isMaintenancePath = location.pathname.startsWith('/maintenance');
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
        staleTime: 1000 * 60 * 5,
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
                {/* Maintenance */}
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/maintenance/status" element={<MaintenanceStatusPage />} />

                {/* Public */}
                <Route path="/" element={<AppLayout><Index /></AppLayout>} />
                <Route path="/pricing" element={<AppLayout><PricingInfo /></AppLayout>} />
                <Route path="/signup" element={<AppLayout><SignUpChoice /></AppLayout>} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected: Both roles (patient/therapist) */}
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

                {/* Notifications: No layout for admin */}
                <Route path="/notifications" element={
                  <PrivateRoute>
                    {/* Only renders for authenticated users; will use their role within Notifications */}
                    <Notifications />
                  </PrivateRoute>
                } />

                {/* Patient-only */}
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

                {/* Therapist-only */}
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

                {/* Therapist Dashboard */}
                <Route path="/therapist-dashboard" element={
                  <PrivateRoute requiredRole="therapist">
                    <DashboardLayout />
                  </PrivateRoute>
                }>
                  <Route index element={<TherapistDashboardOverview />} />
                  <Route path="schedule" element={<TherapistScheduleView />} />
                  <Route path="patients" element={<TherapistPatientsList />} />
                </Route>
                <Route path="/schedule" element={<Navigate to="/therapist-dashboard/schedule" replace />} />
                <Route path="/patients" element={<Navigate to="/therapist-dashboard/patients" replace />} />

                {/* Admin Dashboard */}
                <Route path="/admin" element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboardLayout>
                      <AdminOverviewPage />
                    </AdminDashboardLayout>
                  </PrivateRoute>
                } />
                <Route path="/admin/users" element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboardLayout>
                      <div>Users Management Page (Coming Soon)</div>
                    </AdminDashboardLayout>
                  </PrivateRoute>
                } />
                <Route path="/admin/appointments" element={
                  <PrivateRoute requiredRole="admin">
                    <AdminDashboardLayout>
                      <div>Appointments Management Page (Coming Soon)</div>
                    </AdminDashboardLayout>
                  </PrivateRoute>
                } />

                {/* 404 */}
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

