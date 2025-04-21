"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightIcon, LibraryIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const SidebarMySpaces = () => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const spaces = useQuery(trpc.spaceRouter.getSpaces.queryOptions());

  // 현재 경로 확인 함수
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);
  const isAllSpacesActive =
    pathname === "/dashboard/spaces" ||
    (pathname.startsWith("/dashboard/spaces/") &&
      !spaces.data?.some((space) =>
        pathname.startsWith(`/dashboard/spaces/${space.id}`)
      ));

  return (
    <SidebarMenu>
      <Collapsible asChild defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="내 스페이스">
              <LibraryIcon />
              <span>요약 스페이스</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  asChild
                  className={cn(
                    "font-medium rounded-md transition-colors",
                    isAllSpacesActive ? "bg-primary/10" : "hover:bg-muted/50"
                  )}
                >
                  <Link
                    href={`/dashboard/spaces`}
                    className="flex items-center px-2 py-1.5"
                  >
                    <span
                      className={cn(
                        "truncate",
                        isAllSpacesActive ? "text-primary font-medium" : ""
                      )}
                    >
                      전체 보기
                    </span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>

              {spaces.data && spaces.data.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/40">
                  {spaces.data.map((item) => {
                    const isSpaceActive = isActive(
                      `/dashboard/spaces/${item.id}`
                    );
                    return (
                      <SidebarMenuSubItem key={item.id}>
                        <SidebarMenuSubButton
                          asChild
                          className={cn(
                            "rounded-md transition-colors",
                            isSpaceActive
                              ? "bg-primary/10"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <Link
                            href={`/dashboard/spaces/${item.id}`}
                            className="flex items-center px-2 py-1.5"
                          >
                            <span
                              className={cn(
                                "truncate",
                                isSpaceActive ? "text-primary font-medium" : ""
                              )}
                            >
                              {item.name}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </div>
              )}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
};

export const SidebarMySpacesSkeleton = () => {
  return (
    <SidebarMenu>
      <Collapsible asChild defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip="내 스페이스">
              <LibraryIcon />
              <span>내 스페이스</span>
              <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <Skeleton className="h-9 w-full" />
              </SidebarMenuSubItem>
              <div className="mt-2 pt-2 border-t border-border/40">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuSubItem key={index}>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuSubItem>
                ))}
              </div>
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  );
};
