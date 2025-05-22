
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Home, Users, FileText } from "lucide-react";

interface AdminDashboardLayoutProps {
  children?: React.ReactNode;
}
const adminNavLinks = [
  { to: "/admin", icon: Home, label: "Dashboard" },
  // Example navigation items for admins:
  { to: "/admin/users", icon: Users, label: "Manage Users" },
  { to: "/admin/appointments", icon: FileText, label: "Appointments" }
];

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavLinks.map(item => (
                  <SidebarMenuItem key={item.to} active={location.pathname === item.to}>
                    <SidebarMenuButton asChild>
                      <Link to={item.to} className="flex items-center space-x-2">
                        <item.icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <main className="flex-1 container mx-auto px-4 py-8 mt-2">
        {children}
      </main>
    </div>
  );
};
export default AdminDashboardLayout;
