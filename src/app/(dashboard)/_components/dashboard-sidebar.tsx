import { Logo } from "@/components/common/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_MENU_ITEMS } from "@/configs/dashboard.config";
import Link from "next/link";
import { Suspense } from "react";
import { SidebarMySpaces, SidebarMySpacesSkeleton } from "./sidebar-my-spaces";
import { UserPlanInfo } from "./user-plan-info";

export const DashboardSidebar = () => {
  return (
    <div className="**:transition-none!">
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          {/* 유저 사용량 정보 */}
          <UserPlanInfo />

          {/* 데시보드 메뉴 */}
          <SidebarMenu className="mt-3">
            {DASHBOARD_MENU_ITEMS.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          {/* 내 스페이스 목록 */}
          <Suspense fallback={<SidebarMySpacesSkeleton />}>
            <SidebarMySpaces />
          </Suspense>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};
