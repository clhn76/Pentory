import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "../components/dashboard-header";
import { DashboardSidebar } from "../components/dashboard-sidebar";

export const DashboardLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider className="flex">
      <DashboardSidebar />
      <main className="w-full">
        <DashboardHeader />
        {children}
      </main>
    </SidebarProvider>
  );
};
