"use client";

import { Logo } from "@/components/common/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserPlanInfo } from "./user-plan-info";
import { DASHBOARD_GROUPS } from "../../config";

export const DashboardSidebar = () => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    } else {
      return pathname.startsWith(href);
    }
  };

  return (
    <div className="**:transition-none!">
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          {/* 유저 사용량 정보 */}
          <UserPlanInfo />

          {DASHBOARD_GROUPS.map((group) => (
            <SidebarGroup key={group.groupLabel}>
              {group.groupLabel && (
                <SidebarGroupLabel>{group.groupLabel}</SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive(item.href)}>
                        <Link href={item.href}>
                          <item.icon />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}

          {/* 내 스페이스 목록 */}
          {/* <Suspense fallback={<SidebarMySpacesSkeleton />}>
            <SidebarMySpaces />
          </Suspense> */}
        </SidebarContent>
      </Sidebar>
    </div>
  );
};
