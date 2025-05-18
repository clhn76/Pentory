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
      <main className="w-full flex flex-col">
        <DashboardHeader />
        <main className="flex-1">{children}</main>
      </main>
    </SidebarProvider>
  );
};
