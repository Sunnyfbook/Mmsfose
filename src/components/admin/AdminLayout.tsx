import { Outlet } from 'react-router-dom';
import { Sidebar, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuth } from '@/components/auth/AdminAuth';
import { Video } from 'lucide-react';

export default function AdminLayout() {
  return (
    <AdminAuth>
      <SidebarProvider>
        <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-card">
          {/* Header */}
          <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div className="flex items-center gap-1 sm:gap-2">
                <Video className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-viral bg-clip-text text-transparent">
                  <span className="hidden sm:inline">KingTube Admin</span>
                  <span className="sm:hidden">Admin</span>
                </h1>
              </div>
            </div>
          </header>

          <div className="flex">
            <AdminSidebar />
            
            <main className="flex-1 p-3 sm:p-4 lg:p-6 admin-panel">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AdminAuth>
  );
}