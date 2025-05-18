import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/modules/auth";
import { UserDropdown } from "@/modules/user/ui/components/user-dropdown";
import { FeedbackDialog } from "@/modules/feedback/components/feedback-dialog";

export const DashboardHeader = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 border-b w-full flex items-center justify-between px-3 py-2 bg-background/50 backdrop-blur-md z-50">
      <SidebarTrigger />

      <div className="flex items-center gap-3">
        <FeedbackDialog />
        {user && <UserDropdown user={user} />}
      </div>
    </header>
  );
};
