
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
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";

// Check if Supabase credentials are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";
const supabaseConfigured = supabaseUrl && supabaseKey;

const queryClient = new QueryClient();

const App = () => {
  const [showSupabaseWarning, setShowSupabaseWarning] = useState(!supabaseConfigured);
  
  useEffect(() => {
    // Check if credentials are available after a delay (in case they're being set)
    const timer = setTimeout(() => {
      if (!supabaseConfigured) {
        console.warn("Supabase credentials are not configured. Some features may not work properly.");
      } else {
        setShowSupabaseWarning(false);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSupabaseWarning && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-100 p-4 z-50 text-center">
            <p className="text-yellow-800">
              Supabase is not configured properly. Please check your environment variables.
            </p>
          </div>
        )}
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
