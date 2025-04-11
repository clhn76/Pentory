import { Logo } from "@/components/common/logo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_MENU_ITEMS } from "@/configs/dashboard.config";
import { ChevronRight, FolderIcon } from "lucide-react";
import Link from "next/link";
import { UserPlanInfo } from "./user-plan-info";

const MY_SPACES = [
  {
    id: 1,
    name: "스페이스1",
  },
  {
    id: 2,
    name: "스페이스2",
  },
];

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
          <SidebarMenu>
            <Collapsible asChild defaultOpen className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip="내 스페이스">
                    <FolderIcon />
                    <span>내 스페이스</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {MY_SPACES.map((item) => (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton asChild>
                          <Link href={`/dashboard/spaces/${item.id}`}>
                            <span className="truncate">{item.name}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};
