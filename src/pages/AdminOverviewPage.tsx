
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";

// Example: Count of appointment requests for admin
async function fetchAppointmentRequestCount() {
  const { count, error } = await supabase
    .from("appointment_requests")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count;
}

const AdminOverviewPage: React.FC = () => {
  const { data: totalRequests, isLoading, error } = useQuery({
    queryKey: ["admin-appointment-request-count"],
    queryFn: fetchAppointmentRequestCount
  });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-2">Appointment Requests</h2>
        {isLoading ? (
          <span>Loading...</span>
        ) : error ? (
          <span className="text-red-600">Error loading data</span>
        ) : (
          <span className="text-2xl font-bold">{totalRequests ?? 0}</span>
        )}
        <div className="mt-1 text-gray-500 text-sm">Total appointment requests</div>
      </Card>
      {/* Add more admin widgets/metrics here */}
    </div>
  );
};
export default AdminOverviewPage;
