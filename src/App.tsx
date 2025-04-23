
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { AuthProvider } from "@/context/AuthContext";

// Layouts
import AppLayout from "@/components/layout/AppLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Auth and protection
import PrivateRoute from "@/components/auth/PrivateRoute";
import Auth from "@/pages/Auth";
import Unauthorized from "@/pages/Unauthorized";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingInfo from "./pages/PricingInfo";
import SignUpChoice from "./pages/SignUpChoice";

// Protected pages - Both roles
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Appointments from "./pages/Appointments";

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

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
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

              {/* Patient-only routes */}
              <Route path="/find-therapist" element={
                <AppLayout>
                  <PrivateRoute requiredRole="patient">
                    <FindTherapist />
                  </PrivateRoute>
                </AppLayout>
              } />
              
              <Route path="/patient-profile" element={
                <AppLayout>
                  <PrivateRoute requiredRole="patient">
                    <PatientProfile />
                  </PrivateRoute>
                </AppLayout>
              } />
              
              <Route path="/patient-signup" element={
                <AppLayout>
                  <PatientSignup />
                </AppLayout>
              } />

              {/* Therapist-only routes */}
              <Route path="/therapist-profile" element={
                <AppLayout>
                  <PrivateRoute requiredRole="therapist">
                    <TherapistProfile />
                  </PrivateRoute>
                </AppLayout>
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

              {/* 404 - Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
