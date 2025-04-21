import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/modules/auth";
import { UserDropdown } from "@/modules/user/ui/components/user-dropdown";

export const DashboardHeader = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 border-b w-full flex items-center justify-between px-3 py-2 bg-background/50 backdrop-blur-md z-50">
      <SidebarTrigger />

      {user && <UserDropdown user={user} />}
    </header>
  );
};
