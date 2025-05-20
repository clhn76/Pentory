import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/modules/common/next-auth";
import { UserDropdown } from "@/modules/user/components/user-dropdown";
import { FeedbackDialog } from "@/modules/feedback/components/feedback-dialog";
import { DASHBOARD_HEADER_HEIGHT } from "../config";

export const DashboardHeader = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header
      style={{
        height: DASHBOARD_HEADER_HEIGHT,
      }}
      className="sticky top-0 border-b w-full flex items-center justify-between px-3 py-2 bg-background/50 backdrop-blur-md z-50"
    >
      <SidebarTrigger />

      <div className="flex items-center gap-3">
        <FeedbackDialog />
        {user && <UserDropdown user={user} />}
      </div>
    </header>
  );
};
