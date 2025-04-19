import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FindTherapist from "./pages/FindTherapist";
import TherapistDashboard from "./pages/TherapistDashboard";
import Appointments from "./pages/Appointments";
import NotFound from "./pages/NotFound";
import PatientSignup from "./pages/PatientSignup";
import TherapistSignup from "./pages/TherapistSignup";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/find-therapist" element={<FindTherapist />} />
            <Route path="/therapist-dashboard" element={<TherapistDashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/schedule" element={<TherapistDashboard />} />
            <Route path="/patients" element={<TherapistDashboard />} />
            <Route path="/therapist-profile" element={<TherapistDashboard />} />
            <Route path="/my-profile" element={<Index />} />
            <Route path="/patient-signup" element={<PatientSignup />} />
            <Route path="/therapist-signup" element={<TherapistSignup />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
