import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/dashboard-sidebar";
import { DashboardHeader } from "./_components/dashboard-header";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  prefetch(trpc.userRouter.getUserInfo.queryOptions());

  return (
    <HydrateClient>
      <SidebarProvider className="flex">
        <DashboardSidebar />
        <main className="w-full">
          <DashboardHeader />
          {children}
        </main>
      </SidebarProvider>
    </HydrateClient>
  );
};

export default DashboardLayout;
